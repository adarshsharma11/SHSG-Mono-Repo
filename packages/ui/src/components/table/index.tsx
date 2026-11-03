import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';
export type TableProps = ComponentPropsWithRef<'table'> & {
  density?: 'comfortable' | 'compact';
  containerClassName?: string;
  scrollLabel?: string;
};
export function Table({ density = 'comfortable', containerClassName, scrollLabel = 'Scrollable data table', className, ...native }: TableProps) {
  return (
    <div role="region" aria-label={scrollLabel} tabIndex={0} className={cn('border-shsg-secondary-border focus-visible:outline-shsg-ring overflow-x-auto rounded-xl border focus-visible:outline-2', containerClassName)}>
      <table {...native} data-density={density} className={cn('text-shsg-ghost w-full border-collapse text-left text-sm [&[data-density=compact]_td]:py-2 [&[data-density=compact]_th]:py-2', className)} />
    </div>
  );
}
export function TableCaption({ className, ...native }: ComponentPropsWithRef<'caption'>) {
  return <caption {...native} className={cn('text-shsg-muted caption-top px-4 py-3 text-left text-sm', className)} />;
}
export function TableHeader({ className, ...native }: ComponentPropsWithRef<'thead'>) {
  return <thead {...native} className={cn('border-shsg-secondary-border bg-shsg-field-muted border-b', className)} />;
}
export function TableBody({ className, ...native }: ComponentPropsWithRef<'tbody'>) {
  return <tbody {...native} className={cn('divide-shsg-secondary-border divide-y', className)} />;
}
export function TableFooter({ className, ...native }: ComponentPropsWithRef<'tfoot'>) {
  return <tfoot {...native} className={cn('border-shsg-secondary-border bg-shsg-field-muted border-t font-medium', className)} />;
}
export function TableRow({ className, ...native }: ComponentPropsWithRef<'tr'>) {
  return <tr {...native} className={cn('hover:bg-shsg-field-muted/60 transition-colors motion-reduce:transition-none', className)} />;
}
export function TableHead({ className, scope = 'col', ...native }: ComponentPropsWithRef<'th'>) {
  return <th {...native} scope={scope} className={cn('px-4 py-3 font-semibold whitespace-nowrap', className)} />;
}
export function TableCell({ className, ...native }: ComponentPropsWithRef<'td'>) {
  return <td {...native} className={cn('px-4 py-4 align-middle', className)} />;
}
