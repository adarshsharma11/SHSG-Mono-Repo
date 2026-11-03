'use client';
import { cloneElement, useEffect, useId, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredPopup, type PopupSide } from '../../hooks/useAnchoredPopup';

export interface TooltipProps {
  content: string;
  children: ReactElement<{ 'aria-describedby'?: string }>;
  side?: PopupSide;
  delay?: number;
}
export function Tooltip({ content, children, side = 'top', delay = 300 }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focused = useRef(false);
  const id = useId();
  const position = useAnchoredPopup(open, anchor, popup, side);
  const cancel = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  const hide = () => {
    cancel();
    timer.current = setTimeout(() => {
      if (!focused.current) setOpen(false);
    }, 120);
  };
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        cancel();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', escape, true);
    return () => document.removeEventListener('keydown', escape, true);
  }, [open]);
  const describedBy = [children.props['aria-describedby'], open && id].filter(Boolean).join(' ') || undefined;
  return (
    <span
      ref={anchor}
      className="inline-flex max-w-full"
      onPointerEnter={() => {
        cancel();
        timer.current = setTimeout(() => setOpen(true), Math.max(0, delay));
      }}
      onPointerLeave={hide}
      onFocusCapture={() => {
        cancel();
        focused.current = true;
        setOpen(true);
      }}
      onBlurCapture={() => {
        focused.current = false;
        hide();
      }}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      {open &&
        createPortal(
          <div ref={popup} id={id} role="tooltip" style={position} onPointerEnter={cancel} onPointerLeave={hide} className="shsg-popup-motion bg-shsg-ghost text-shsg-field z-[110] max-w-[min(18rem,calc(100vw-1rem))] rounded-lg px-3 py-2 text-xs leading-5 shadow-lg">
            {content}
          </div>,
          anchor.current?.closest('dialog[open]') ?? document.body,
        )}
    </span>
  );
}
