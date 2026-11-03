import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '../../lib/cn';
export type EmptyStateProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | false;
  actions?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  compact?: boolean;
};
export function EmptyState({ title, description, icon, actions, headingLevel = 3, compact = false, className, children, ...native }: EmptyStateProps) {
  const Tag = headingLevel === 2 ? 'h2' : headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div {...native} className={cn('text-shsg-ghost flex min-w-0 flex-col items-center text-center', compact ? 'gap-3 px-4 py-6' : 'gap-5 px-6 py-12', className)}>
      {icon !== false && (
        <span aria-hidden="true" className="bg-shsg-field-muted text-shsg-muted inline-flex size-12 items-center justify-center rounded-full [&_svg]:size-6">
          {icon ?? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h16l2 10v6H2v-6L4 4Zm-2 10h6l2 3h4l2-3h6" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      )}
      <div className="max-w-md space-y-2">
        <Tag className="text-xl font-semibold tracking-tight">{title}</Tag>
        {description != null && <p className="text-shsg-muted text-sm leading-6">{description}</p>}
      </div>
      {children}
      {actions && <div className="flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
