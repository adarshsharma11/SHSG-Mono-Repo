'use client';
import type { ComponentPropsWithRef } from 'react';
import { Button } from '../button';
import { cn } from '../../lib/cn';
export type PaginationProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};
export function Pagination({ page, totalPages, onPageChange, disabled = false, className, 'aria-label': label = 'Pagination', ...native }: PaginationProps) {
  const total = Number.isFinite(totalPages) ? Math.max(0, Math.floor(totalPages)) : 0;
  const current = total ? Math.min(total, Math.max(1, Math.floor(Number.isFinite(page) ? page : 1))) : 0;
  const numbers = total <= 7 ? Array.from({ length: total }, (_, index) => index + 1) : [...new Set([1, ...Array.from({ length: 3 }, (_, index) => Math.max(2, Math.min(current - 1, total - 3)) + index), total])].filter((value) => value <= total).sort((a, b) => a - b);
  const change = (next: number) => {
    if (!disabled && next >= 1 && next <= total && next !== current) onPageChange(next);
  };
  return (
    <nav {...native} aria-label={label} className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button variant="outline" size="sm" disabled={disabled || current <= 1} onClick={() => change(current - 1)}>
        Previous
      </Button>
      {numbers.map((number, index) => (
        <span key={number} className="inline-flex items-center gap-2">
          {index > 0 && number - numbers[index - 1] > 1 && (
            <span aria-hidden="true" className="text-shsg-muted px-1">
              …
            </span>
          )}
          <Button size="sm" variant={number === current ? 'primary' : 'ghost'} aria-label={`Page ${number}`} aria-current={number === current ? 'page' : undefined} disabled={disabled} onClick={() => change(number)}>
            {number}
          </Button>
        </span>
      ))}
      <Button variant="outline" size="sm" disabled={disabled || current === total} onClick={() => change(current + 1)}>
        Next
      </Button>
      {!total && <span className="text-shsg-muted text-sm">No pages</span>}
    </nav>
  );
}
