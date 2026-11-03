import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // Keep the page slot in the render tree; each page guards its visual auth frame.
  return children;
}
