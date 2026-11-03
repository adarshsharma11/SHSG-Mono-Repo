import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, Section, Skeleton, Spinner, SPINNER_SIZES, SKELETON_ANIMATIONS, Typography } from '@shsg/ui';
import { LoadingDemo } from './loading-demo';

export const metadata: Metadata = {
  title: 'Loading states | SHSG',
  description: 'Shared spinners and skeletons for pages, lists, and submissions.',
};
export default function LoadingStatesPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-4xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-2xl space-y-4">
          <nav aria-label="Component pages" className="text-shsg-link flex flex-wrap gap-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/badge">Badges</Link>
            <Link href="/alert">Alerts</Link>
            <Link href="/card">Cards & sections</Link>
            <Link href="/tabs">Tabs</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">Loading states</Typography>
          <Typography variant="lead" tone="muted">
            Keep people informed while content and actions are getting ready.
          </Typography>
        </header>
        <Section title="Spinner sizes" description="One accessible loading indicator, sized for its context.">
          <div className="flex flex-wrap items-end gap-8">
            {SPINNER_SIZES.map((size) => (
              <div key={size} className="space-y-3">
                <Spinner size={size} label={`Loading ${size} example`} />
                <Typography variant="caption" tone="muted">
                  {size}
                </Typography>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Spinner decorative tone="muted" />
            <Typography variant="small" tone="muted">
              Decorative spinner beside an existing loading message.
            </Typography>
          </div>
        </Section>
        <Section title="Skeleton treatments" description="Use placeholders that match the shape of the content being loaded.">
          <div className="grid gap-6 sm:grid-cols-3">
            {SKELETON_ANIMATIONS.map((animation) => (
              <div key={animation} className="space-y-4">
                <Typography variant="small" weight="medium">
                  {animation}
                </Typography>
                <Skeleton shape="rect" animation={animation} />
                <div className="flex gap-3">
                  <Skeleton shape="circle" animation={animation} />
                  <div className="flex-1 space-y-3">
                    <Skeleton animation={animation} />
                    <Skeleton animation={animation} className="w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Page placeholder" description="Mark the content region as busy and announce loading once.">
          <div className="flex items-center gap-3">
            <Spinner label="Loading service overview" />
            <Typography variant="small">Loading your service overview…</Typography>
          </div>
          <Card aria-busy="true" aria-label="Loading service overview">
            <Skeleton className="h-7 w-2/3" animation="shimmer" />
            <Skeleton shape="rect" className="h-36" animation="shimmer" />
            <Skeleton animation="shimmer" />
            <Skeleton className="w-3/4" animation="shimmer" />
          </Card>
        </Section>
        <LoadingDemo />
      </main>
    </div>
  );
}
