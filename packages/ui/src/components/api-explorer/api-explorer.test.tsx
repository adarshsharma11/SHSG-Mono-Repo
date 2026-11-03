import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ApiExplorer } from './index';
describe('ApiExplorer', () => {
  it('does not request on mount and renders a selected response', async () => {
    const run = vi.fn().mockResolvedValue({ ok: true, status: 200, data: { status: 'ok' } });
    render(<ApiExplorer title="API explorer" endpoints={[{ id: 'health', label: 'Health', path: '/api/health', run }]} />);
    expect(run).not.toHaveBeenCalled();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Run Health' }));
    expect(await screen.findByLabelText('API response')).toHaveTextContent('"status": "ok"');
  });
  it('ignores cancelled/stale responses and aborts on unmount', async () => {
    let firstSignal: AbortSignal | undefined;
    const first = vi.fn().mockImplementation((signal: AbortSignal) => {
      firstSignal = signal;
      return new Promise(() => {});
    });
    const second = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      data: { status: 'not_ready' },
    });
    const { unmount } = render(
      <ApiExplorer
        title="API explorer"
        endpoints={[
          { id: 'one', label: 'First', path: '/one', run: first },
          { id: 'two', label: 'Second', path: '/two', run: second },
        ]}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Run First' }));
    await user.click(screen.getByRole('button', { name: 'Run Second' }));
    expect(firstSignal?.aborted).toBe(true);
    await waitFor(() => expect(screen.getByLabelText('API response')).toHaveTextContent('not_ready'));
    const signal = second.mock.calls[0][0] as AbortSignal;
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
