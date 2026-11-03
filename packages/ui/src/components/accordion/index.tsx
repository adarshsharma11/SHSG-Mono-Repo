'use client';
import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
export interface AccordionProps {
  items: readonly AccordionItem[];
  multiple?: boolean;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}
export function Accordion({ items, multiple = false, value, defaultValue = [], onValueChange, headingLevel = 3, className }: AccordionProps) {
  const [internal, setInternal] = useState<readonly string[]>(defaultValue);
  const all = (value ?? internal).filter((item) => items.some((entry) => entry.value === item));
  const expanded = multiple ? all : all.slice(0, 1);
  const id = useId();
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const Tag = headingLevel === 2 ? 'h2' : headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div className={cn('divide-shsg-secondary-border border-shsg-secondary-border text-shsg-ghost divide-y border-y', className)}>
      {items.map((item, index) => {
        const isOpen = expanded.includes(item.value);
        return (
          <div key={item.value}>
            <Tag>
              <button
                type="button"
                id={`${id}-trigger-${index}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-content-${index}`}
                disabled={item.disabled}
                ref={(node) => {
                  if (node) buttons.current.set(item.value, node);
                  else buttons.current.delete(item.value);
                }}
                className="hover:text-shsg-primary focus-visible:outline-shsg-ring flex w-full cursor-pointer items-center justify-between gap-5 rounded-md py-5 text-left text-base font-medium focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => {
                  const next = isOpen ? expanded.filter((entry) => entry !== item.value) : multiple ? [...expanded, item.value] : [item.value];
                  if (value === undefined) setInternal(next);
                  onValueChange?.(next);
                }}
                onKeyDown={(event) => {
                  const enabled = items.filter((entry) => !entry.disabled);
                  const position = enabled.findIndex((entry) => entry.value === item.value);
                  let next = position;
                  if (event.key === 'ArrowDown') next = (position + 1) % enabled.length;
                  else if (event.key === 'ArrowUp') next = (position - 1 + enabled.length) % enabled.length;
                  else if (event.key === 'Home') next = 0;
                  else if (event.key === 'End') next = enabled.length - 1;
                  else return;
                  event.preventDefault();
                  const target = enabled[next];
                  if (target) buttons.current.get(target.value)?.focus();
                }}
              >
                <span>{item.title}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className={cn('size-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none', isOpen && 'rotate-180')}>
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" />
                </svg>
              </button>
            </Tag>
            <div id={`${id}-content-${index}`} role="region" aria-labelledby={`${id}-trigger-${index}`} aria-hidden={!isOpen} inert={!isOpen} data-open={isOpen} className="shsg-accordion-content">
              <div className="min-h-0 overflow-hidden">
                <div className="text-shsg-muted pb-5 text-sm leading-7">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
