import type { Metadata } from 'next';
import Link from 'next/link';
import { Alert, ALERT_APPEARANCES, Typography } from '@shsg/ui';
import { AlertExamples } from './alert-examples';

export const metadata: Metadata = {
  title: 'Alerts | SHSG',
  description: 'Shared inline feedback, actions, and dismissible alerts.',
};

export default function AlertPage() {
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
            <Link href="/badge">Badges →</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">Alerts</Typography>
          <Typography variant="lead" tone="muted">
            Clear inline feedback, with context and a next step when it helps.
          </Typography>
        </header>
        <section aria-labelledby="alert-variants" className="space-y-6">
          <Typography as="h2" variant="h3" id="alert-variants">
            Status variants
          </Typography>
          <Alert variant="neutral" title="No upcoming visits">
            Your visit history is available in your account.
          </Alert>
          <Alert variant="primary" title="Your visit is scheduled">
            Your booking details are ready to review.
          </Alert>
          <Alert variant="info" title="A small update">
            Your service professional will contact you before arriving.
          </Alert>
          <Alert variant="success" title="Payment received">
            Your receipt has been added to the visit details.
          </Alert>
          <Alert variant="warning" title="Review your access instructions">
            Let us know how to enter the property before your visit.
          </Alert>
          <Alert variant="danger" title="Payment could not be completed">
            Check your payment details and try again.
          </Alert>
        </section>
        <section aria-labelledby="alert-appearance" className="border-shsg-secondary-border space-y-6 border-t pt-8">
          <Typography as="h2" variant="h3" id="alert-appearance">
            Appearances and content
          </Typography>
          {ALERT_APPEARANCES.map((appearance) => (
            <Alert key={appearance} variant="info" appearance={appearance} title={`${appearance.charAt(0).toUpperCase() + appearance.slice(1)} appearance`}>
              The same message can fit different surface hierarchies.
            </Alert>
          ))}
          <Alert icon={false}>A compact message without an icon or title.</Alert>
          <Alert variant="success" title="Your profile is complete" />
          <Alert variant="primary" title="Prepare for your visit" icon={<HomeIcon />}>
            <ul className="list-disc space-y-1 pl-5">
              <li>Keep the work area accessible.</li>
              <li>Share any special instructions.</li>
            </ul>
          </Alert>
        </section>
        <AlertExamples />
      </main>
    </div>
  );
}
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" />
    </svg>
  );
}
