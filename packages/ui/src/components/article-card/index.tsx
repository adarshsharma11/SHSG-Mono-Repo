import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface ArticleCardProps {
  /** Pass an optimized image from the consuming application's framework. */
  media: ReactNode;
  /** A linked title; the link receives the entire card as its tap target. */
  title: ReactNode;
  category: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  readingTime: string;
  featured?: boolean;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

export function ArticleCard({ media, title, category, excerpt, date, dateLabel, readingTime, featured = false, headingLevel: Heading = 'h2', className }: ArticleCardProps) {
  return (
    <article className={cn('group relative isolate flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5 text-white focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#b3c3f0] hover:border-white/35 motion-safe:transition-colors', featured && 'md:grid md:grid-cols-2', className)}>
      <div className="relative aspect-[3/2] overflow-hidden bg-white">{media}</div>
      <div className={cn('flex flex-1 flex-col items-start gap-5 p-6 sm:p-8', featured && 'md:justify-center lg:p-12')}>
        <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-[#dce4fa]">{category}</span>
        <Heading className={cn('text-xl leading-snug font-semibold tracking-tight [&_a]:outline-none [&_a]:after:absolute [&_a]:after:inset-0', featured ? 'sm:text-3xl lg:text-4xl' : 'sm:text-2xl')}>{title}</Heading>
        <p className="line-clamp-3 text-sm leading-7 text-[#b8c1d4] sm:text-base">{excerpt}</p>
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-4 text-xs text-[#b8c1d4]">
          <time dateTime={date}>{dateLabel}</time>
          <span>{readingTime}</span>
        </div>
      </div>
    </article>
  );
}
