import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';

export const SPINNER_SIZES = ['sm', 'md', 'lg', 'xl'] as const;
export type SpinnerProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'role' | 'aria-label' | 'aria-hidden'> & {
  size?: (typeof SPINNER_SIZES)[number];
  label?: string;
  tone?: 'primary' | 'muted' | 'inherit';
  /** Suppresses announcements when a parent already communicates loading. */
  decorative?: boolean;
};
export function Spinner({ size = 'md', label = 'Loading', tone = 'primary', decorative = false, className, ...native }: SpinnerProps) {
  return (
    <span
      {...native}
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-size={size}
      className={cn(
        'inline-flex shrink-0 align-middle',
        { sm: 'size-4', md: 'size-6', lg: 'size-8', xl: 'size-12' }[size],
        {
          primary: 'text-shsg-primary',
          muted: 'text-shsg-muted',
          inherit: 'text-inherit',
        }[tone],
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-full animate-spin motion-reduce:animate-none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {!decorative && <span className="sr-only">{label}</span>}
    </span>
  );
}
