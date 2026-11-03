import type { Metadata } from 'next';
import { ComponentShowcase } from '../_components/component-showcase';
import { TableExamples } from './table-examples';
export const metadata: Metadata = {
  title: 'Tables & pagination | SHSG',
  description: 'Shared tables for bookings, customers, invoices, and service history.',
};
export default function TablePage() {
  return (
    <ComponentShowcase title="Tables & pagination" description="Readable records with native table semantics, sorting, filtering, and controlled pagination.">
      <TableExamples />
    </ComponentShowcase>
  );
}
