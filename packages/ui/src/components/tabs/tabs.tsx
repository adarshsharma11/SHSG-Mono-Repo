'use client';
import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';
import type { TabsProps } from './tabs.types';

export function Tabs({ items, label, value, defaultValue, onValueChange, variant = 'underline', animation = 'fade', orientation = 'horizontal', activationMode = 'automatic', keepMounted = true, className, ...native }: TabsProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? items.find((item) => !item.disabled)?.value);
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const requested = value ?? internalValue;
  const active = items.find((item) => item.value === requested && !item.disabled)?.value ?? items.find((item) => !item.disabled)?.value;
  const focusable = items.some((item) => item.value === focusedValue && !item.disabled) ? focusedValue : active;
  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const update = () => {
      const tab = active === undefined ? undefined : buttons.current.get(active);
      if (!tab) {
        indicator.hidden = true;
        return;
      }
      indicator.hidden = false;
      list.dataset.indicatorReady = 'true';
      const horizontal = orientation === 'horizontal';
      const underline = variant === 'underline';
      indicator.style.width = `${underline && !horizontal ? 2 : tab.offsetWidth}px`;
      indicator.style.height = `${underline && horizontal ? 2 : tab.offsetHeight}px`;
      indicator.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop + (underline && horizontal ? tab.offsetHeight - 2 : 0)}px)`;
    };
    update();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(list);
    for (const tab of buttons.current.values()) observer?.observe(tab);
    window.addEventListener('resize', update);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [active, orientation, variant, items]);
  const select = (next: string) => {
    if (next === active) return;
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: string) => {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.value === current);
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    let next = index;
    if (event.key === nextKey) next = (index + 1) % enabled.length;
    else if (event.key === previousKey) next = (index - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabled.length - 1;
    else return;
    event.preventDefault();
    const item = enabled[next];
    if (!item) return;
    buttons.current.get(item.value)?.focus();
    if (activationMode === 'automatic') select(item.value);
  };

  return (
    <div {...native} data-variant={variant} data-orientation={orientation} className={cn('text-shsg-ghost min-w-0', orientation === 'vertical' ? 'grid gap-6 sm:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)]' : 'space-y-6', className)}>
      <div
        ref={listRef}
        data-style={variant}
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusedValue(null);
        }}
        className={cn(
          'shsg-tab-list relative isolate flex min-w-0 gap-1',
          orientation === 'vertical' ? 'flex-col items-stretch' : 'overflow-x-auto',
          {
            underline: orientation === 'vertical' ? 'border-shsg-secondary-border border-l' : 'border-shsg-secondary-border border-b',
            pills: 'bg-shsg-field-muted rounded-xl p-1',
            enclosed: 'border-shsg-secondary-border bg-shsg-field rounded-xl border p-1',
          }[variant],
        )}
      >
        <span ref={indicatorRef} aria-hidden="true" data-slot="tab-indicator" className={cn('shsg-tab-indicator bg-shsg-primary pointer-events-none absolute top-0 left-0 -z-10', variant !== 'underline' && 'rounded-lg shadow-sm')} />
        {items.map((item, index) => (
          <button
            key={item.value}
            ref={(node) => {
              if (node) buttons.current.set(item.value, node);
              else buttons.current.delete(item.value);
            }}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={item.value === active}
            aria-controls={`${id}-panel-${index}`}
            disabled={item.disabled}
            tabIndex={item.value === focusable ? 0 : -1}
            onFocus={() => setFocusedValue(item.value)}
            onClick={() => select(item.value)}
            onKeyDown={(event) => onKeyDown(event, item.value)}
            className={cn(
              'focus-visible:outline-shsg-ring relative shrink-0 cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none',
              orientation === 'vertical' && 'text-left',
              variant === 'underline' ? cn('hover:text-shsg-primary border-transparent', orientation === 'vertical' ? '-ml-px border-l-2' : '-mb-px border-b-2', item.value === active && 'text-shsg-primary') : cn('rounded-lg', item.value === active ? 'bg-shsg-primary text-shsg-primary-foreground' : 'text-shsg-muted hover:bg-shsg-secondary/60'),
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="min-w-0">
        {items.map((item, index) => (
          <div key={item.value} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={item.value !== active} tabIndex={0} data-animation={animation} className="shsg-tab-panel focus-visible:outline-shsg-ring min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4">
            {(keepMounted || item.value === active) && item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
