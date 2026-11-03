import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerApiConfig } from '@/lib/env.server';
import { ApiConsole } from './api-console';
export const metadata: Metadata = {
  title: 'API explorer | SHSG',
  robots: { index: false, follow: false },
};
export default function ApiPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }
  const config = getServerApiConfig();
  return (
    <main className="bg-shsg-field flex-1">
      <nav className="mx-auto max-w-5xl px-6 pt-8 sm:px-10">
        <Link href="/" className="text-shsg-link text-sm hover:underline">
          ← Home
        </Link>
      </nav>
      <ApiConsole diagnosticsEnabled={config.diagnosticsEnabled} />
    </main>
  );
}
