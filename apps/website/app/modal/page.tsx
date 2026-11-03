import type { Metadata } from 'next';
import Link from 'next/link';
import { Typography } from '@shsg/ui';
import { ModalShowcase } from './modal-showcase';

export const metadata: Metadata = {
  title: 'Modals | SHSG',
  description: 'Accessible shared dialogs with smooth motion, sizes, and form examples.',
};
export default function ModalPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-4xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-2xl space-y-4">
          <nav aria-label="Component pages" className="text-shsg-link flex flex-wrap gap-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/button">Buttons</Link>
            <Link href="/input">Inputs</Link>
            <Link href="/typography">Typography →</Link>
            <Link href="/badge">Badges</Link>
            <Link href="/alert">Alerts</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">Modals</Typography>
          <Typography variant="lead" tone="muted">
            Focused dialogs for decisions, details, and forms. Choose an animation and try it in context.
          </Typography>
        </header>
        <ModalShowcase />
      </main>
    </div>
  );
}
