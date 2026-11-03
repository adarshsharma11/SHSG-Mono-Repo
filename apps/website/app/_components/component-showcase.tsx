import Link from 'next/link';
import type { ReactNode } from 'react';
import { Typography } from '@shsg/ui';
export function ComponentShowcase({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-5xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-3xl space-y-4">
          <nav aria-label="Component pages" className="text-shsg-link flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <Link href="/">Home</Link>
            <Link href="/tabs">Tabs</Link>
            <Link href="/dropdown-menu">Dropdown menus</Link>
            <Link href="/tooltip">Tooltips</Link>
            <Link href="/accordion">Accordion</Link>
            <Link href="/table">Tables & pagination</Link>
            <Link href="/empty-state">Empty states</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">{title}</Typography>
          <Typography variant="lead" tone="muted">
            {description}
          </Typography>
        </header>
        {children}
      </main>
    </div>
  );
}
