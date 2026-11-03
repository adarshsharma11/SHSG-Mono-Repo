'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import { cn } from '../../lib/cn';
import { useAnchoredPopup } from '../../hooks/useAnchoredPopup';

export type DropdownMenuItem =
  | {
      id: string;
      label: string;
      disabled?: boolean;
      danger?: boolean;
      href?: string;
      onSelect?: () => void;
    }
  | { id: string; type: 'separator' };
export interface DropdownMenuProps {
  label: string;
  trigger?: ReactNode;
  items: readonly DropdownMenuItem[];
  align?: 'start' | 'end';
  disabled?: boolean;
  className?: string;
}
export function DropdownMenu({ label, trigger, items, align = 'end', disabled = false, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const last = useRef(false);
  const search = useRef('');
  const searchTime = useRef(0);
  const id = useId();
  const position = useAnchoredPopup(open, anchor, menu, 'bottom', align);
  const enabled = () => Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []);
  const close = (restore = false) => {
    setOpen(false);
    if (restore) anchor.current?.focus();
  };
  useLayoutEffect(() => {
    if (open) {
      const nodes = enabled();
      (last.current ? nodes.at(-1) : nodes[0])?.focus();
      if (!nodes.length) menu.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && !anchor.current?.contains(target) && !menu.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
    };
  }, [open]);
  return (
    <>
      <Button
        ref={anchor}
        variant="outline"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          last.current = false;
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            last.current = event.key === 'ArrowUp';
            setOpen(true);
          }
        }}
      >
        {trigger ?? label}
      </Button>
      {open &&
        createPortal(
          <div
            ref={menu}
            id={id}
            role="menu"
            aria-label={label}
            tabIndex={-1}
            style={position}
            className={cn('shsg-popup-motion border-shsg-secondary-border bg-shsg-field text-shsg-ghost z-[100] max-h-[min(24rem,calc(100dvh-1rem))] max-w-[calc(100vw-1rem)] min-w-48 overflow-y-auto rounded-xl border p-1.5 text-sm shadow-lg outline-none', className)}
            onKeyDown={(event) => {
              const nodes = enabled();
              const current = nodes.indexOf(document.activeElement as HTMLElement);
              if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                event.preventDefault();
                const index = event.key === 'Home' ? 0 : event.key === 'End' ? nodes.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + nodes.length) % nodes.length;
                nodes[index]?.focus();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                close(true);
              } else if (event.key === 'Tab') {
                close(true);
              } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
                const now = Date.now();
                search.current = now - searchTime.current > 600 ? event.key.toLowerCase() : search.current + event.key.toLowerCase();
                searchTime.current = now;
                const ordered = [...nodes.slice(current + 1), ...nodes.slice(0, current + 1)];
                ordered.find((node) => node.textContent?.trim().toLowerCase().startsWith(search.current))?.focus();
              }
            }}
          >
            {items.map((item) =>
              'type' in item ? (
                <div key={item.id} role="separator" className="border-shsg-secondary-border my-1 border-t" />
              ) : (
                (() => {
                  const props = {
                    role: 'menuitem',
                    tabIndex: -1,
                    'aria-disabled': item.disabled || undefined,
                    className: cn('block w-full cursor-pointer rounded-lg px-3 py-2 text-left leading-6 focus:bg-shsg-field-muted focus:outline-none hover:bg-shsg-field-muted', item.disabled && 'cursor-not-allowed opacity-40', item.danger && 'text-shsg-danger'),
                    onClick: (event: React.MouseEvent) => {
                      if (item.disabled) {
                        event.preventDefault();
                        return;
                      }
                      close(true);
                      item.onSelect?.();
                    },
                  };
                  return item.href ? (
                    <a key={item.id} {...props} href={item.disabled ? undefined : item.href}>
                      {item.label}
                    </a>
                  ) : (
                    <button key={item.id} {...props} type="button" disabled={item.disabled}>
                      {item.label}
                    </button>
                  );
                })()
              ),
            )}
          </div>,
          anchor.current?.closest('dialog[open]') ?? document.body,
        )}
    </>
  );
}
