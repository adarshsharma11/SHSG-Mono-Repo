import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState, Section } from '@shsg/ui';
import { ComponentShowcase } from '../_components/component-showcase';
import { EmptyExamples } from './empty-examples';
export const metadata: Metadata = {
  title: 'Empty states | SHSG',
  description: 'Helpful next steps for missing data, search results, and errors.',
};
export default function EmptyStatePage() {
  return (
    <ComponentShowcase title="Empty states" description="Explain what is missing and offer a useful next step.">
      <Section title="No data yet" description="Give a clear reason and a route to the first action.">
        <EmptyState
          title="No service visits yet"
          description="Your scheduled and completed visits will appear here."
          actions={
            <Link href="/input" className="bg-shsg-primary text-shsg-primary-foreground focus-visible:outline-shsg-ring rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2">
              Explore the request form
            </Link>
          }
        />
      </Section>
      <EmptyExamples />
    </ComponentShowcase>
  );
}
