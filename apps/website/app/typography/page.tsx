import type { Metadata } from 'next';
import Link from 'next/link';
import { Typography, TYPOGRAPHY_VARIANTS } from '@shsg/ui';
import { TypographyMotionDemo } from './typography-motion-demo';

export const metadata: Metadata = {
  title: 'Typography | SHSG',
  description: 'Shared type scale, semantic elements, and text animations.',
};

export default function TypographyPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-5xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-2xl space-y-4">
          <nav aria-label="Component pages" className="text-shsg-link flex flex-wrap gap-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/button">Buttons</Link>
            <Link href="/input">Inputs</Link>
            <Link href="/modal">Modals →</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">Typography</Typography>
          <Typography variant="lead" tone="muted">
            A shared type scale for headings, body copy, and the details that help people act.
          </Typography>
        </header>
        <section aria-labelledby="scale-title" className="space-y-6">
          <Typography as="h2" variant="h3" id="scale-title">
            Type scale
          </Typography>
          <Typography tone="muted">Visual style and heading level can be chosen independently.</Typography>
          <div>
            {TYPOGRAPHY_VARIANTS.map((variant) => (
              <div key={variant} className="border-shsg-secondary-border grid gap-4 border-t py-7 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-baseline">
                <Typography variant="caption" tone="muted" className="font-mono">
                  {variant}
                </Typography>
                <Typography as={variant === 'quote' ? 'blockquote' : variant === 'code' ? 'code' : 'p'} variant={variant} className="break-words">
                  {variant === 'code' ? 'import { Typography } from "@shsg/ui";' : variant === 'quote' ? 'Care starts with the details.' : variant === 'body' ? 'Keep your home in good hands. Schedule a service, review your visit, and find everything you need in one place.' : 'Make yourself at home.'}
                </Typography>
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="tones-title" className="border-shsg-secondary-border space-y-6 border-t pt-8">
          <Typography as="h2" variant="h3" id="tones-title">
            Tone and emphasis
          </Typography>
          <div className="grid gap-5 sm:grid-cols-2">
            <Typography>Default / Service visit details</Typography>
            <Typography tone="muted">Muted / Last updated today</Typography>
            <Typography tone="primary" weight="semibold">
              Primary / Your home, looked after
            </Typography>
            <Typography tone="success">Success / Visit confirmed</Typography>
            <Typography tone="danger">Error / Payment needs attention</Typography>
            <Typography weight="bold">Bold / A little more emphasis</Typography>
          </div>
          <Typography as="h3" variant="h5">
            Alignment and overflow
          </Typography>
          <div className="bg-shsg-field-muted space-y-4 px-5 py-6">
            <Typography align="left">Left aligned</Typography>
            <Typography align="center">Centered</Typography>
            <Typography align="right">Right aligned</Typography>
            <Typography truncate title="A longer service description that will truncate when space runs out.">
              A longer service description that will truncate when space runs out. This keeps a single row readable in smaller spaces.
            </Typography>
          </div>
        </section>
        <TypographyMotionDemo />
      </main>
    </div>
  );
}
