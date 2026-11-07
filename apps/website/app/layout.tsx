import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/components/site/theme.css';
import '@/components/site/site.css';
import { SiteShell } from '@/components/site/site-shell';
import { getWebsiteConfig } from '@/lib/env.server';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Southern Home Services Group',
  description: 'Home repairs, improvements, and renovations with the Southern Home family.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const { appUrl } = getWebsiteConfig();
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased motion-safe:has-[[data-home-page]]:scroll-smooth motion-safe:has-[[data-terms-page]]:scroll-smooth print:has-[[data-terms-page]]:[&_.site-footer]:hidden print:has-[[data-terms-page]]:[&_.site-header]:hidden print:has-[[data-terms-page]]:[&_.site-skip-link]:hidden`}>
      <body className="flex min-h-full flex-col">
        <SiteShell appUrl={appUrl} showDeveloperLinks={process.env.NODE_ENV === 'development'}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
