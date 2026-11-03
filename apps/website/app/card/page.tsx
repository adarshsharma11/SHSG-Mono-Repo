import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CARD_VARIANTS, Section, Typography } from '@shsg/ui';
import { SettingsExample } from './settings-example';

export const metadata: Metadata = {
  title: 'Cards & sections | SHSG',
  description: 'Shared structure for service details, summaries, and settings.',
};
export default function CardPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-4xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-2xl space-y-4">
          <nav aria-label="Component pages" className="text-shsg-link flex flex-wrap gap-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/badge">Badges</Link>
            <Link href="/alert">Alerts</Link>
            <Link href="/loading-states">Loading states</Link>
            <Link href="/tabs">Tabs</Link>
          </nav>
          <Typography variant="overline" tone="muted">
            Southern Home Services / Shared UI
          </Typography>
          <Typography variant="h1">Cards & sections</Typography>
          <Typography variant="lead" tone="muted">
            Reusable structure for related details, summaries, and account settings.
          </Typography>
        </header>
        <Section title="Card surfaces" description="Choose a surface that fits the content hierarchy.">
          <div className="grid gap-6 sm:grid-cols-2">
            {CARD_VARIANTS.map((variant) => (
              <Card key={variant} variant={variant}>
                <CardHeader>
                  <CardTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)}</CardTitle>
                  <CardDescription>A shared container for related information.</CardDescription>
                </CardHeader>
                <CardContent>Header, content, and footer slots keep spacing consistent.</CardContent>
                <CardFooter>
                  <Badge variant="primary" appearance="outline">
                    Service summary
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>
        <Section title="Service details" description="Compose existing badges, type, and actions inside the card.">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Home cleaning</CardTitle>
                <Badge dot variant="primary">
                  Scheduled
                </Badge>
              </div>
              <CardDescription>Visit SHSG-1042 · Standard service</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-shsg-muted">Property</dt>
                  <dd className="mt-1 font-medium">Southern House</dd>
                </div>
                <div>
                  <dt className="text-shsg-muted">Visit window</dt>
                  <dd className="mt-1 font-medium">9:00–11:00 AM</dd>
                </div>
                <div>
                  <dt className="text-shsg-muted">Service professional</dt>
                  <dd className="mt-1 font-medium">Assigned before your visit</dd>
                </div>
                <div>
                  <dt className="text-shsg-muted">Summary</dt>
                  <dd className="mt-1 font-medium">Kitchen, living areas, and bedrooms</dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Link href="/modal" className="text-shsg-link text-sm font-medium underline underline-offset-4">
                Explore visit dialogs →
              </Link>
            </CardFooter>
          </Card>
        </Section>
        <Section title="Padding options" description="Compact, default, and spacious layouts share the same slots.">
          <div className="grid gap-5 sm:grid-cols-3">
            {(['sm', 'md', 'lg'] as const).map((padding) => (
              <Card key={padding} padding={padding}>
                <CardTitle>{padding}</CardTitle>
                <CardContent>Consistent internal spacing.</CardContent>
              </Card>
            ))}
          </div>
        </Section>
        <Section
          id="section-example"
          title="A section with actions"
          description="Sections group content under a semantic heading."
          actions={
            <Link href="/typography" className="text-shsg-link text-sm underline">
              View type scale
            </Link>
          }
        >
          <Section title="Nested section" headingLevel={3} divided={false} description="Choose the heading level to match the page hierarchy.">
            <Typography variant="small">Use sections for page structure and cards when content needs a shared surface.</Typography>
          </Section>
        </Section>
        <SettingsExample />
      </main>
    </div>
  );
}
