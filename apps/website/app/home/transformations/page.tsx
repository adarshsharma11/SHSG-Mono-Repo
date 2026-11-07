import type { Metadata } from 'next';
import { Homepage } from '@/components/home/homepage';

export const metadata: Metadata = {
  title: 'Room for possibility | Southern Home Services Group',
  description: 'Explore ideas for refreshing, rethinking, and reimagining your home with the Southern Home family.',
  robots: { index: false, follow: true },
};

export default function TransformationsPage() {
  return <Homepage view="transformations" />;
}
