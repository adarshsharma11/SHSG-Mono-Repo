import type { Metadata } from 'next';
import Link from 'next/link';
import { Typography } from '@shsg/ui';
import { TabsShowcase } from './tabs-showcase';
export const metadata: Metadata = {
  title: 'Tabs | SHSG',
  description: 'Accessible shared tabs with multiple panel animations.',
};
export default function TabsPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-4xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-2xl space-y-4">
          <nav aria-label="Component pages" className="text-shsg-link flex flex-wrap gap-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/badge">Badges</Link>
            <Link href="/alert">Alerts</Link>
            <Link href="/loading-states">Loading states</Link>
            <Link href="/card">Cards & sections</Link>
            <Link href="/dropdown-menu">Dropdown menus</Link>
            <Link href="/table">Tables & pagination</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">Tabs</Typography>
          <Typography variant="lead" tone="muted">
            Organize related views with accessible controls and a choice of panel animations.
          </Typography>
        </header>
        <TabsShowcase />
      </main>
    </div>
  );
}
