import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Tooltip } from './index';
afterEach(() => vi.useRealTimers());
describe('Tooltip', () => {
  it('opens on focus, preserves external descriptions, and dismisses with Escape', () => {
    render(
      <>
        <p id="extra">Existing help</p>
        <Tooltip content="More context">
          <button aria-describedby="extra">Help</button>
        </Tooltip>
      </>,
    );
    const trigger = screen.getByRole('button');
    fireEvent.focus(trigger);
    expect(screen.getByRole('tooltip')).toHaveTextContent('More context');
    expect(trigger).toHaveAccessibleDescription('Existing help More context');
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).toHaveAccessibleDescription('Existing help');
  });
  it('delays hover and stays visible while moving onto the tooltip', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hover context" delay={300}>
        <button>Help</button>
      </Tooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole('button').parentElement!);
    act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    const tooltip = screen.getByRole('tooltip');
    fireEvent.pointerLeave(screen.getByRole('button').parentElement!);
    fireEvent.pointerEnter(tooltip);
    act(() => vi.advanceTimersByTime(500));
    expect(tooltip).toBeVisible();
    fireEvent.pointerLeave(tooltip);
    act(() => vi.advanceTimersByTime(120));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
