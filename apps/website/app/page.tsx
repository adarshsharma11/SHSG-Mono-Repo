import type { Metadata } from 'next';
import { Homepage } from '@/components/home/homepage';

export const metadata: Metadata = {
  title: 'Home repairs & improvements | Southern Home Services Group',
  description: 'Explore repairs, plumbing, electrical, carpentry, outdoor improvements, and renovation ideas. Find your starting point with the Southern Home family.',
};

export default function Home() {
  return <Homepage />;
}
