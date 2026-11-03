import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Accordion } from './index';
const items = [
  {
    value: 'first',
    title: 'First answer',
    content: <input aria-label="Draft note" />,
  },
  { value: 'off', title: 'Unavailable', content: 'Off', disabled: true },
  { value: 'last', title: 'Last answer', content: 'Last content' },
];
describe('Accordion', () => {
  it('associates triggers and regions, hides collapsed content, and opens one at a time', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const first = screen.getByRole('button', { name: 'First answer' });
    const region = document.getElementById(first.getAttribute('aria-controls')!);
    expect(region).toHaveAttribute('aria-labelledby', first.id);
    expect(region).toHaveAttribute('inert');
    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Last answer' }));
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('region')).toHaveLength(1);
  });
  it('supports multiple open sections, keyboard movement, and preserved drafts', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} multiple defaultValue={['first']} />);
    await user.type(screen.getByLabelText('Draft note'), 'Side gate');
    const first = screen.getByRole('button', { name: 'First answer' });
    first.focus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('button', { name: 'Last answer' })).toHaveFocus();
    expect(screen.getAllByRole('region')).toHaveLength(2);
    await user.click(first);
    await user.click(first);
    expect(screen.getByLabelText('Draft note')).toHaveValue('Side gate');
  });
  it('keeps controlled expansion under parent ownership', async () => {
    const change = vi.fn();
    render(<Accordion items={items} value={[]} onValueChange={change} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'First answer' }));
    expect(change).toHaveBeenCalledWith(['first']);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});
