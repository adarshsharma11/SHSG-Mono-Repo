import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, BADGE_APPEARANCES, BADGE_SIZES, BADGE_VARIANTS, Typography, type BadgeVariant } from '@shsg/ui';

export const metadata: Metadata = {
  title: 'Badges | SHSG',
  description: 'Shared status badges, labels, and counts.',
};
const labels: Record<BadgeVariant, string> = {
  neutral: 'Draft',
  primary: 'Scheduled',
  info: 'In progress',
  success: 'Completed',
  warning: 'Needs review',
  danger: 'Cancelled',
};

export default function BadgePage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-4xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-2xl space-y-4">
          <nav aria-label="Component pages" className="text-shsg-link flex flex-wrap gap-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/button">Buttons</Link>
            <Link href="/input">Inputs</Link>
            <Link href="/typography">Typography</Link>
            <Link href="/modal">Modals</Link>
            <Link href="/alert">Alerts →</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">Badges</Typography>
          <Typography variant="lead" tone="muted">
            Small labels for service status, categories, and counts. Text carries the meaning; color adds a quick cue.
          </Typography>
        </header>
        <section aria-labelledby="badge-variants" className="space-y-6">
          <Typography as="h2" variant="h3" id="badge-variants">
            Variants and appearances
          </Typography>
          {BADGE_APPEARANCES.map((appearance) => (
            <div key={appearance} className="border-shsg-secondary-border grid gap-4 border-t py-6 sm:grid-cols-[7rem_1fr]">
              <Typography variant="small" tone="muted" className="font-mono">
                {appearance}
              </Typography>
              <div className="flex flex-wrap items-center gap-3">
                {BADGE_VARIANTS.map((variant) => (
                  <Badge key={variant} variant={variant} appearance={appearance}>
                    {labels[variant]}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </section>
        <section aria-labelledby="badge-size" className="border-shsg-secondary-border space-y-6 border-t pt-8">
          <Typography as="h2" variant="h3" id="badge-size">
            Sizes and shapes
          </Typography>
          <div className="flex flex-wrap items-center gap-4">
            {BADGE_SIZES.map((size) => (
              <Badge key={size} size={size} variant="primary">
                {size} / Scheduled
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Badge shape="pill">Pill label</Badge>
            <Badge shape="rounded">Rounded label</Badge>
          </div>
        </section>
        <section aria-labelledby="badge-details" className="border-shsg-secondary-border space-y-6 border-t pt-8">
          <Typography as="h2" variant="h3" id="badge-details">
            Dots, icons, and counts
          </Typography>
          <div className="flex flex-wrap items-center gap-4">
            <Badge dot variant="success">
              Available
            </Badge>
            <Badge variant="success" icon={<CheckIcon />}>
              Verified
            </Badge>
            <Typography as="span" variant="small">
              Open requests{' '}
              <Badge variant="info" aria-label="12 open requests">
                12
              </Badge>
            </Typography>
            <Badge appearance="outline" size="sm">
              New
            </Badge>
          </div>
          <div className="max-w-xs">
            <Badge variant="info">A longer service category wraps safely when the available width is limited.</Badge>
          </div>
        </section>
        <section aria-labelledby="badge-context" className="border-shsg-secondary-border space-y-6 border-t pt-8">
          <Typography as="h2" variant="h3" id="badge-context">
            In a service list
          </Typography>
          <ul className="divide-shsg-secondary-border divide-y">
            {(
              [
                {
                  name: 'Home cleaning',
                  detail: 'Visit SHSG-1042',
                  status: 'primary',
                },
                {
                  name: 'Air conditioning service',
                  detail: 'Visit SHSG-1041',
                  status: 'success',
                },
                {
                  name: 'Plumbing repair',
                  detail: 'Visit SHSG-1040',
                  status: 'warning',
                },
              ] as const
            ).map((item) => (
              <li key={item.detail} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <Typography weight="medium">{item.name}</Typography>
                  <Typography variant="small" tone="muted">
                    {item.detail}
                  </Typography>
                </div>
                <Badge dot variant={item.status}>
                  {labels[item.status]}
                </Badge>
              </li>
            ))}
          </ul>
          <Typography variant="small" tone="muted">
            Badges are informational labels. Use a button or link for an action.
          </Typography>
        </section>
      </main>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
