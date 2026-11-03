'use client';

import { useEffect, useId, useRef } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../button';
import { Typography } from '../typography';
import type { ModalProps } from './modal.types';

// Count per document so stacked dialogs and independent roots do not unlock each other.
const scrollLocks = new WeakMap<HTMLElement, { count: number; overflow: string }>();
function lockScroll(body: HTMLElement) {
  const lock = scrollLocks.get(body) ?? {
    count: 0,
    overflow: body.style.overflow,
  };
  lock.count++;
  scrollLocks.set(body, lock);
  body.style.overflow = 'hidden';
  return () => {
    lock.count--;
    if (lock.count === 0) {
      body.style.overflow = lock.overflow;
      scrollLocks.delete(body);
    }
  };
}

export function Modal({ open, onOpenChange, title, description, footer, children, size = 'md', animation = 'scale', speed = 'normal', closeOnEscape = true, closeOnBackdrop = true, showCloseButton = true, closeLabel = 'Close dialog', initialFocusRef, className, overlayClassName, onClick, onPointerDown, 'aria-describedby': describedBy, ...native }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const releaseScroll = useRef<(() => void) | null>(null);
  const id = useId();

  const unlockScroll = () => {
    releaseScroll.current?.();
    releaseScroll.current = null;
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.dataset.state = 'open';
      if (!dialog.open) {
        dialog.showModal();
        const target = initialFocusRef?.current;
        if (target && dialog.contains(target)) target.focus();
      }
      releaseScroll.current ??= lockScroll(dialog.ownerDocument.body);
      return;
    }
    if (!dialog.open) return;

    dialog.dataset.state = 'closing';
    const finishClose = () => {
      dialog.dataset.state = 'closed';
      if (dialog.open) dialog.close();
      unlockScroll();
    };
    // Read the actual CSS duration so custom styles and reduced motion are respected.
    const style = getComputedStyle(dialog);
    const toMs = (value: string) => (parseFloat(value) || 0) * (value.trim().endsWith('ms') ? 1 : 1000);
    const durations = style.transitionDuration.split(',').map(toMs);
    const delays = style.transitionDelay.split(',').map(toMs);
    const duration = Math.max(0, ...durations.map((value, index) => value + (delays[index % delays.length] ?? 0)));
    if (animation === 'none' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || duration === 0) {
      finishClose();
      return;
    }
    const onEnd = (event: TransitionEvent) => {
      if (event.target === dialog && event.propertyName === 'opacity') finishClose();
    };
    dialog.addEventListener('transitionend', onEnd);
    // Handles interrupted transitions, background tabs, and missing transition events.
    const timeout = window.setTimeout(finishClose, duration + 50);
    return () => {
      dialog.removeEventListener('transitionend', onEnd);
      window.clearTimeout(timeout);
    };
  }, [open, initialFocusRef, animation, speed]);

  useEffect(() => {
    return unlockScroll;
  }, []);

  return (
    <dialog
      {...native}
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={[describedBy, description && `${id}-description`].filter(Boolean).join(' ') || undefined}
      data-animation={animation}
      data-speed={speed}
      className={cn('shsg-modal text-shsg-ghost fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-4 outline-none open:grid open:place-items-center sm:p-6', overlayClassName)}
      onCancel={(event) => {
        event.preventDefault();
        if (closeOnEscape) onOpenChange(false);
      }}
      onClose={(event) => {
        if (!event.currentTarget.open) {
          unlockScroll();
          if (open) onOpenChange(false);
        }
      }}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget;
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && closeOnBackdrop && backdropPress.current && event.target === event.currentTarget) onOpenChange(false);
        backdropPress.current = false;
      }}
    >
      <div
        inert={!open}
        data-slot="modal-panel"
        data-size={size}
        className={cn(
          'shsg-modal-panel border-shsg-secondary-border bg-shsg-field flex max-h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border shadow-2xl',
          {
            sm: 'max-w-sm',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
            xl: 'max-w-4xl',
            full: 'h-full max-w-none',
          }[size],
          className,
        )}
      >
        <header className="border-shsg-secondary-border flex shrink-0 items-start justify-between gap-4 border-b px-6 py-5">
          <div className="min-w-0 space-y-2">
            <Typography as="h2" variant="h4" id={`${id}-title`}>
              {title}
            </Typography>
            {description && (
              <Typography variant="small" tone="muted" id={`${id}-description`}>
                {description}
              </Typography>
            )}
          </div>
          {showCloseButton && (
            <Button variant="ghost" size="icon-sm" aria-label={closeLabel} onClick={() => onOpenChange(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </Button>
          )}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6">{children}</div>
        {footer && <footer className="border-shsg-secondary-border flex shrink-0 flex-wrap items-center justify-end gap-3 border-t px-6 py-4">{footer}</footer>}
      </div>
    </dialog>
  );
}
