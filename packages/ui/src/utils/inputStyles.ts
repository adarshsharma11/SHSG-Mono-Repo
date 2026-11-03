import { cn } from '../lib/cn';
import type { FieldProps } from '../types/input.types';

export function inputStyles({ size = 'md', variant = 'outline', error, success }: FieldProps, className?: string) {
  return cn(
    'block w-full min-w-0 text-shsg-ghost placeholder:text-shsg-muted accent-shsg-primary transition-colors duration-150 motion-reduce:transition-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shsg-ring disabled:cursor-not-allowed disabled:opacity-50 [&[readonly]]:cursor-default [&[readonly]]:bg-shsg-field-muted',
    'enabled:hover:border-shsg-primary [&:not(:placeholder-shown)]:font-medium',
    {
      sm: 'min-h-8 px-2.5 py-1 text-sm',
      md: 'min-h-10 px-3 py-2 text-sm',
      lg: 'min-h-12 px-4 py-3 text-base',
    }[size],
    {
      outline: 'rounded-lg border border-shsg-secondary-border bg-shsg-field',
      filled: 'rounded-lg border border-transparent bg-shsg-field-muted',
      underline: 'rounded-none border-0 border-b border-shsg-secondary-border bg-transparent',
    }[variant],
    error ? 'border-shsg-danger!' : success ? 'border-shsg-success!' : '',
    className,
  );
}
