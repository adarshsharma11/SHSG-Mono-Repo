import { Button, BUTTON_SIZES, BUTTON_VARIANTS, type ButtonVariant } from '@shsg/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Buttons',
  description: 'Shared button specimens for Southern Home Services Group.',
};

const variantLabel: Record<ButtonVariant, string> = {
  primary: 'Schedule visit',
  secondary: 'View services',
  outline: 'Learn more',
  ghost: 'Skip',
  link: 'See details',
  danger: 'Delete account',
  success: 'Payment received',
  warning: 'Review warning',
  soft: 'Save draft',
};

export default function ButtonPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-6 py-16 sm:px-10">
        <header className="flex max-w-xl flex-col gap-4">
          <Link href="/" className="text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400">
            Home
          </Link>
          <Link href="/input" className="text-shsg-link text-sm hover:underline">
            Explore inputs →
          </Link>
          <nav aria-label="More components" className="text-shsg-link flex gap-5 text-sm">
            <Link href="/typography" className="hover:underline">
              Typography
            </Link>
            <Link href="/modal" className="hover:underline">
              Modals
            </Link>
          </nav>
          <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">Southern Home Services</p>
          <h1 className="text-4xl font-semibold tracking-tight">Buttons</h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">Every shared action, from the primary visit request to icon controls, loading, and disabled states.</p>
        </header>

        <Section title="Variants" description="One treatment for each kind of action.">
          {BUTTON_VARIANTS.map((variant) => (
            <Row key={variant} label={variant}>
              <Button variant={variant}>{variantLabel[variant]}</Button>
            </Row>
          ))}
        </Section>

        <Section title="Sizes" description="Height, padding, and type scale stay in step.">
          {BUTTON_SIZES.filter((size) => !size.startsWith('icon')).map((size) => (
            <Row key={size} label={size}>
              <Button size={size}>Book a visit</Button>
            </Row>
          ))}
        </Section>

        <Section title="Icon buttons" description="Square controls need an accessible name.">
          {(['icon-sm', 'icon', 'icon-lg'] as const).map((size) => (
            <Row key={size} label={size}>
              <Button size={size} aria-label="Add service">
                <PlusIcon />
              </Button>
            </Row>
          ))}
        </Section>

        <Section title="Shapes" description="Rounded is the default. Pill and square are available when the layout asks for them.">
          <Row label="rounded">
            <Button shape="rounded">Continue</Button>
          </Row>
          <Row label="pill">
            <Button shape="pill">Continue</Button>
          </Row>
          <Row label="square">
            <Button shape="square">Continue</Button>
          </Row>
        </Section>

        <Section title="Icons" description="Leading and trailing icons stay decorative. The label is the accessible name.">
          <Row label="leading">
            <Button leftIcon={<SearchIcon />}>Search services</Button>
          </Row>
          <Row label="trailing">
            <Button variant="outline" rightIcon={<ArrowIcon />}>
              Get started
            </Button>
          </Row>
          <Row label="both">
            <Button variant="secondary" leftIcon={<PlusIcon />} rightIcon={<ArrowIcon />}>
              Add and continue
            </Button>
          </Row>
        </Section>

        <Section title="States" description="Disabled and loading block a second submit. Loading keeps the button from collapsing.">
          <Row label="disabled">
            <Button disabled>Schedule visit</Button>
            <Button variant="danger" disabled>
              Delete account
            </Button>
          </Row>
          <Row label="loading">
            <Button loading>Submitting</Button>
          </Row>
          <Row label="loading text">
            <Button loading loadingText="Saving changes...">
              Save changes
            </Button>
          </Row>
          <Row label="replace">
            <Button loading loadingPosition="replace">
              Submitting
            </Button>
          </Row>
          <Row label="full width">
            <div className="w-full max-w-sm">
              <Button fullWidth>Continue</Button>
            </div>
          </Row>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="mb-2 flex max-w-xl flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid items-center gap-3 border-t border-zinc-200 py-4 sm:grid-cols-[9rem_1fr] dark:border-zinc-800">
      <p className="font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
