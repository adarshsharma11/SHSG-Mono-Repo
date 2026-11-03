import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Tabs } from './tabs';
import type { TabItem } from './tabs.types';

const items: TabItem[] = [
  { value: 'overview', label: 'Overview', content: <p>Service overview</p> },
  {
    value: 'disabled',
    label: 'Unavailable',
    disabled: true,
    content: <p>Hidden history</p>,
  },
  {
    value: 'settings',
    label: 'Settings',
    content: <input aria-label="Draft name" />,
  },
  { value: 'billing', label: 'Billing', content: <p>Payment details</p> },
];

describe('Tabs', () => {
  it('moves and resizes the bar indicator and gives enabled tabs pointer cursors', async () => {
    render(<Tabs label="Visit" items={items} />);
    const overview = screen.getByRole('tab', { name: 'Overview' });
    const settings = screen.getByRole('tab', { name: 'Settings' });
    for (const [tab, left, width] of [
      [overview, 0, 100],
      [settings, 120, 140],
    ] as const) {
      Object.defineProperties(tab, {
        offsetLeft: { value: left, configurable: true },
        offsetTop: { value: 0 },
        offsetWidth: { value: width },
        offsetHeight: { value: 40 },
      });
    }
    fireEvent(window, new Event('resize'));
    const indicator = screen.getByRole('tablist').querySelector('[data-slot="tab-indicator"]');
    expect(indicator).toHaveStyle({
      width: '100px',
      height: '2px',
      transform: 'translate(0px, 38px)',
    });
    await userEvent.setup().click(settings);
    expect(indicator).toHaveStyle({
      width: '140px',
      transform: 'translate(120px, 38px)',
    });
    expect(settings).toHaveClass('cursor-pointer');
    expect(screen.getByRole('tab', { name: 'Unavailable' })).toHaveClass('disabled:cursor-not-allowed');
  });
  it('associates tabs and panels with unique IDs across multiple instances', () => {
    render(
      <>
        <Tabs label="Visit" items={items} />
        <Tabs label="Account" items={items} />
      </>,
    );
    const lists = screen.getAllByRole('tablist');
    const first = within(lists[0]).getByRole('tab', { name: 'Overview' });
    const second = within(lists[1]).getByRole('tab', { name: 'Overview' });
    expect(first.id).not.toBe(second.id);
    const panel = document.getElementById(first.getAttribute('aria-controls') ?? '');
    expect(panel).toHaveAttribute('aria-labelledby', first.id);
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(2);
  });
  it('changes panels with clicks, keeps inactive content hidden, and ignores disabled tabs', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Tabs label="Visit" items={items} onValueChange={change} />);
    await user.click(screen.getByRole('tab', { name: 'Unavailable' }));
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    expect(change).toHaveBeenCalledWith('billing');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Payment details');
    expect(screen.getByText('Service overview')).not.toBeVisible();
  });
  it('supports roving focus, wrapping, Home/End, and disabled-tab skipping', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Visit" items={items} />);
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{End}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });
  it('uses vertical keys and activates manual tabs only on Enter or Space', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Visit" items={items} orientation="vertical" activationMode="manual" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowDown}');
    const settings = screen.getByRole('tab', { name: 'Settings' });
    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute('tabindex', '0');
    expect(settings).toHaveAttribute('aria-selected', 'false');
    await user.keyboard('{Enter}');
    expect(settings).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown} ');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowUp}');
    expect(settings).toHaveFocus();
  });
  it('supports controlled selection without changing it internally', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Tabs label="Visit" items={items} value="overview" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    expect(onValueChange).toHaveBeenCalledWith('billing');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    rerender(<Tabs label="Visit" items={items} value="billing" onValueChange={onValueChange} />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Payment details');
  });
  it('preserves input drafts across panels by default', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Visit" items={items} defaultValue="settings" />);
    await user.type(screen.getByLabelText('Draft name'), 'Southern House');
    await user.click(screen.getByRole('tab', { name: 'Overview' }));
    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.getByLabelText('Draft name')).toHaveValue('Southern House');
  });
  it('can unmount inactive content and falls back if selection becomes unavailable', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Tabs label="Visit" items={items} keepMounted={false} defaultValue="settings" />);
    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    expect(screen.queryByLabelText('Draft name')).not.toBeInTheDocument();
    rerender(<Tabs label="Visit" items={items.filter((item) => item.value !== 'billing')} keepMounted={false} />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });
  it('handles empty and entirely disabled item lists', () => {
    const { rerender } = render(<Tabs label="Empty" items={[]} />);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    rerender(
      <Tabs
        label="Disabled"
        items={[
          {
            value: 'off',
            label: 'Off',
            disabled: true,
            content: 'Unavailable',
          },
        ]}
      />,
    );
    expect(screen.getByRole('tab')).toBeDisabled();
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });
  it('supports a parent-driven view switch', async () => {
    function Example() {
      const [value, setValue] = useState('overview');
      return (
        <>
          <button onClick={() => setValue('billing')}>Go to billing</button>
          <Tabs label="Visit" items={items} value={value} onValueChange={setValue} />
        </>
      );
    }
    render(<Example />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Go to billing' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Payment details');
  });
});
