import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './index';
import { Pagination } from '../pagination';
import { EmptyState } from '../empty-state';
describe('Table, Pagination, and EmptyState', () => {
  it('preserves native table headers, captions, refs, and empty-state actions', async () => {
    const ref = createRef<HTMLTableElement>();
    const reset = vi.fn();
    render(
      <Table ref={ref}>
        <TableCaption>Bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <EmptyState title="No bookings" description="Try another search." actions={<button onClick={reset}>Reset search</button>} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toBe(screen.getByRole('table', { name: 'Bookings' }));
    expect(screen.getByRole('columnheader')).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('heading', { name: 'No bookings' })).toBeVisible();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Reset search' }));
    expect(reset).toHaveBeenCalledOnce();
  });
  it('marks the current page, emits controlled changes, and disables boundaries', async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Pagination page={1} totalPages={4} onPageChange={change} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(change).toHaveBeenCalledWith(2);
    rerender(<Pagination page={4} totalPages={4} onPageChange={change} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
  it('bounds long page lists and handles empty or invalid ranges', () => {
    const change = vi.fn();
    const { rerender } = render(<Pagination page={500} totalPages={1000} onPageChange={change} />);
    expect(screen.getAllByRole('button').length).toBeLessThan(10);
    expect(screen.getByRole('button', { name: 'Page 500' })).toHaveAttribute('aria-current', 'page');
    rerender(<Pagination page={NaN} totalPages={0} onPageChange={change} />);
    expect(screen.getByText('No pages')).toBeVisible();
    expect(screen.getAllByRole('button').every((button) => button.hasAttribute('disabled'))).toBe(true);
  });
});
