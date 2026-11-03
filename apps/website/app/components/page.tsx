import type { Metadata } from 'next';
import Link from 'next/link';
import { Typography } from '@shsg/ui';
export const metadata: Metadata = {
  title: 'Shared components | SHSG',
  robots: { index: false, follow: false },
};
const pages = ['button', 'input', 'typography', 'modal', 'badge', 'alert', 'loading-states', 'card', 'tabs', 'dropdown-menu', 'tooltip', 'accordion', 'table', 'empty-state'];
export default function ComponentsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <Link href="/" className="text-shsg-link underline">
        ← SHSG home
      </Link>
      <Typography variant="h1" className="mt-10">
        Shared component library
      </Typography>
      <Typography tone="muted" className="mt-4">
        Examples and interactions for the SHSG design system.
      </Typography>
      <nav aria-label="Component examples" className="mt-10 grid gap-4 sm:grid-cols-3">
        {pages.map((page) => (
          <Link key={page} href={`/${page}`} className="border-shsg-secondary-border text-shsg-link border-b py-4 capitalize hover:underline">
            {page.replaceAll('-', ' ')} ↗
          </Link>
        ))}
        {process.env.NODE_ENV === 'development' && (
          <Link href="/api" className="text-shsg-link py-4 underline">
            API explorer ↗
          </Link>
        )}
      </nav>
    </main>
  );
}
