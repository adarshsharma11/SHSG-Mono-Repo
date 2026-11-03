import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { LoadingDemo } from '../../../../../apps/website/app/loading-states/loading-demo';
import { SettingsExample } from '../../../../../apps/website/app/card/settings-example';

afterEach(() => vi.useRealTimers());
describe('loading and card website examples', () => {
  it('replaces list placeholders with loaded content', () => {
    render(<LoadingDemo />);
    expect(screen.queryByText('Home cleaning')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show loaded list' }));
    expect(screen.getByText('Home cleaning')).toBeVisible();
    expect(screen.getByText('3 services loaded.')).toBeVisible();
  });
  it('blocks repeat saves while loading and reports completion', () => {
    vi.useFakeTimers();
    render(<LoadingDemo />);
    fireEvent.click(screen.getByRole('button', { name: 'Save demo preferences' }));
    expect(screen.getByRole('button', { name: 'Saving preferences…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Saving preferences…' })).toHaveAttribute('aria-busy', 'true');
    act(() => vi.advanceTimersByTime(1200));
    expect(screen.getByRole('button', { name: 'Save demo preferences' })).toBeEnabled();
    expect(screen.getByText('Demo preferences saved.')).toBeVisible();
  });
  it('saves the notification setting inside a card', () => {
    render(<SettingsExample />);
    fireEvent.click(screen.getByRole('switch', { name: 'Email service updates' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save notification settings' }));
    expect(screen.getByText('Settings saved')).toBeVisible();
    expect(screen.getByText('Email updates are disabled.')).toBeVisible();
  });
});
