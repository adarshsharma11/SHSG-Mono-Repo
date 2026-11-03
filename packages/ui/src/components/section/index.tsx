import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type SectionProps = Omit<ComponentPropsWithRef<'section'>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  divided?: boolean;
};
export function Section({ title, description, actions, headingLevel = 2, divided = true, id, className, children, 'aria-label': label, 'aria-labelledby': labelledBy, ...native }: SectionProps) {
  const Tag = headingLevel === 2 ? 'h2' : headingLevel === 3 ? 'h3' : 'h4';
  const titleId = id ? `${id}-title` : undefined;
  const headingId = labelledBy ?? titleId;
  return (
    <section {...native} id={id} aria-labelledby={headingId} aria-label={label ?? (!headingId && typeof title === 'string' ? title : undefined)} className={cn('text-shsg-ghost min-w-0 space-y-6', divided && 'border-shsg-secondary-border border-t pt-8', className)}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <Tag id={titleId} className="text-2xl leading-snug font-semibold tracking-tight">
            {title}
          </Tag>
          {description != null && <p className="text-shsg-muted text-base leading-7">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
