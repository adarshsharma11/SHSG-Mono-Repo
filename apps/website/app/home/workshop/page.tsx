import type { Metadata } from 'next';
import { Homepage } from '@/components/home/homepage';

export const metadata: Metadata = {
  title: 'The workshop | Southern Home Services Group',
  description: 'Explore home repairs, installations, outdoor work, and specialist services through the Southern Home workshop.',
  robots: { index: false, follow: true },
};

export default function WorkshopPage() {
  return <Homepage view="workshop" />;
}
