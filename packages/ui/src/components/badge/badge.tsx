import { cn } from '../../lib/cn';
import { feedbackStyles } from '../../lib/feedbackStyles';
import type { BadgeProps } from './badge.types';

export function Badge({ variant = 'neutral', appearance = 'soft', size = 'md', shape = 'pill', dot = false, icon, className, children, ...native }: BadgeProps) {
  return (
    <span
      {...native}
      data-variant={variant}
      data-appearance={appearance}
      data-size={size}
      data-shape={shape}
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 border align-middle font-medium',
        feedbackStyles(variant, appearance),
        {
          sm: 'min-h-5 px-2 py-0.5 text-[0.6875rem] leading-4 [&_svg]:size-3',
          md: 'min-h-6 px-2.5 py-0.5 text-xs leading-5 [&_svg]:size-3.5',
          lg: 'min-h-7 px-3 py-1 text-sm leading-5 [&_svg]:size-4',
        }[size],
        shape === 'pill' ? 'rounded-full' : 'rounded-md',
        className,
      )}
    >
      {dot && <span aria-hidden="true" data-slot="badge-dot" className="size-1.5 shrink-0 rounded-full bg-current" />}
      {icon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      )}
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}
