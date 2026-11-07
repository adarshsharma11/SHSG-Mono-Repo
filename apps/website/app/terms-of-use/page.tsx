import type { Metadata } from 'next';
import { TermsDocument } from '@/components/legal/terms-document';

export const metadata: Metadata = {
  title: 'Terms of use | Southern Home Services Group',
  description: 'Read the draft website terms for Southern Home Services Group, including accounts, project enquiries, acceptable use, and contacting our family of businesses.',
  // Keep working legal copy out of search results until it has been approved.
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <TermsDocument />;
}
