import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { TableExamples } from '../../../../../apps/website/app/table/table-examples';
import { EmptyExamples } from '../../../../../apps/website/app/empty-state/empty-examples';
describe('record and recovery showcases', () => {
  it('filters to an empty state, clears search, sorts, and paginates', async () => {
    const user = userEvent.setup();
    render(<TableExamples />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'no matching booking' },
    });
    expect(screen.getByRole('heading', { name: 'No bookings match' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    const table = screen.getByRole('table', { name: /Demo bookings/ });
    expect(within(table).getAllByRole('row')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: /Customer/ }));
    expect(within(table).getByRole('columnheader', { name: /Customer/ })).toHaveAttribute('aria-sort', 'descending');
    await user.click(within(screen.getByRole('navigation', { name: 'Booking pagination' })).getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Page 2 of 3')).toBeVisible();
  });
  it('recovers from missing results and retryable errors', async () => {
    const user = userEvent.setup();
    render(<EmptyExamples />);
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('Filters cleared')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Visit history loaded')).toBeVisible();
  });
});
