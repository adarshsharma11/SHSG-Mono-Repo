import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { EstimateWorkspace } from './estimate-workspace';

describe('sample estimate workspace', () => {
  it('filters line items and recalculates costs after a quantity edit', async () => {
    const user = userEvent.setup();
    render(<EstimateWorkspace />);
    const initial = screen
      .getAllByText(/\$[\d,]+\.\d{2}/)
      .map((node) => node.textContent)
      .join();
    const quantity = screen.getByRole('spinbutton', {
      name: 'Quantity for Mid-grade elongated toilet',
    });
    await user.clear(quantity);
    await user.type(quantity, '2');
    expect(
      screen
        .getAllByText(/\$[\d,]+\.\d{2}/)
        .map((node) => node.textContent)
        .join(),
    ).not.toBe(initial);
    await user.type(screen.getByRole('searchbox'), 'no matching product');
    expect(screen.getByText('No matching estimate items.')).toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.selectOptions(screen.getByRole('combobox'), 'Labor');
    expect(screen.queryByRole('button', { name: 'Mid-grade elongated toilet' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toilet installation' })).toBeInTheDocument();
  });
  it('updates the selected item detail', async () => {
    const user = userEvent.setup();
    render(<EstimateWorkspace />);
    await user.click(screen.getByRole('button', { name: 'Toilet installation' }));
    expect(screen.getByRole('heading', { name: 'Toilet installation' })).toBeInTheDocument();
  });
});
