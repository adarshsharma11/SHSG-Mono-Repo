import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';

export const CARD_VARIANTS = ['outline', 'elevated', 'soft', 'plain'] as const;
export type CardProps = ComponentPropsWithRef<'div'> & {
  variant?: (typeof CARD_VARIANTS)[number];
  padding?: 'sm' | 'md' | 'lg';
};
export function Card({ variant = 'outline', padding = 'md', className, ...native }: CardProps) {
  return (
    <div
      {...native}
      data-variant={variant}
      className={cn(
        'text-shsg-ghost flex min-w-0 flex-col gap-6 rounded-2xl',
        {
          outline: 'border-shsg-secondary-border bg-shsg-field border',
          elevated: 'border-shsg-secondary-border bg-shsg-field border shadow-md',
          soft: 'bg-shsg-field-muted border border-transparent',
          plain: 'bg-transparent',
        }[variant],
        { sm: 'p-4', md: 'p-6', lg: 'p-8' }[padding],
        className,
      )}
    />
  );
}
export function CardHeader({ className, ...native }: ComponentPropsWithRef<'div'>) {
  return <div {...native} className={cn('space-y-2', className)} />;
}
export type CardTitleProps = ComponentPropsWithRef<'h3'> & {
  as?: 'h2' | 'h3' | 'h4';
};
export function CardTitle({ as: Tag = 'h3', className, ...native }: CardTitleProps) {
  return <Tag {...native} className={cn('text-xl leading-snug font-semibold tracking-tight', className)} />;
}
export function CardDescription({ className, ...native }: ComponentPropsWithRef<'p'>) {
  return <p {...native} className={cn('text-shsg-muted text-sm leading-6', className)} />;
}
export function CardContent({ className, ...native }: ComponentPropsWithRef<'div'>) {
  return <div {...native} className={cn('min-w-0 flex-1 text-sm leading-6', className)} />;
}
export function CardFooter({ className, ...native }: ComponentPropsWithRef<'div'>) {
  return <div {...native} className={cn('border-shsg-secondary-border flex flex-wrap items-center gap-3 border-t pt-4', className)} />;
}
