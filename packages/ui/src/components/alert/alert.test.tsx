import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Alert } from './alert';

describe('Alert', () => {
  it('defaults to polite status feedback with title, description, and a decorative icon', () => {
    render(<Alert title="Visit scheduled">Review your booking details.</Alert>);
    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Visit scheduled');
    expect(alert).toHaveTextContent('Review your booking details.');
    expect(alert.querySelector('[data-slot="alert-icon"]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('uses assertive error feedback and supports a role override', () => {
    const { rerender } = render(<Alert variant="danger">Payment failed</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
    rerender(
      <Alert variant="danger" role="status">
        Payment failed
      </Alert>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Payment failed');
  });
  it('does not make warnings assertive by default', () => {
    render(<Alert variant="warning">Review your instructions</Alert>);
    expect(screen.getByRole('status')).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('supports no icon, a custom icon, title-only content, and zero values', () => {
    const { rerender } = render(<Alert icon={false} title="Profile complete" />);
    expect(screen.getByRole('status').querySelector('[data-slot="alert-icon"]')).toBeNull();
    rerender(
      <Alert title="Open requests" icon={<span data-testid="custom-icon">!</span>}>
        {0}
      </Alert>,
    );
    expect(screen.getByTestId('custom-icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('0')).toBeVisible();
  });
  it('runs action handlers without dismissing and keeps dismissal controlled', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const action = vi.fn();
    render(
      <Alert onDismiss={onDismiss} dismissLabel="Dismiss visit reminder" actions={<button onClick={action}>Review visit</button>}>
        Review needed
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: 'Review visit' }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
    const dismiss = screen.getByRole('button', {
      name: 'Dismiss visit reminder',
    });
    expect(dismiss).toHaveAttribute('type', 'button');
    dismiss.focus();
    await user.keyboard('{Enter}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toBeVisible();
  });
  it('lets the parent remove the alert', async () => {
    const user = userEvent.setup();
    function Example() {
      const [visible, setVisible] = useState(true);
      return visible ? <Alert onDismiss={() => setVisible(false)}>Dismiss me</Alert> : <p>Dismissed</p>;
    }
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Dismiss alert' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Dismissed')).toBeVisible();
  });
  it('forwards refs, native attributes, and appearance styles', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} id="notice" aria-label="Account notice" appearance="solid" className="custom-alert">
        Account updated
      </Alert>,
    );
    expect(ref.current).toBe(screen.getByRole('status', { name: 'Account notice' }));
    expect(ref.current).toHaveAttribute('id', 'notice');
    expect(ref.current).toHaveAttribute('data-appearance', 'solid');
    expect(ref.current).toHaveClass('custom-alert');
  });
  it('updates an existing status region when its content changes', () => {
    const { rerender } = render(<Alert>Ready to save</Alert>);
    const region = screen.getByRole('status');
    rerender(
      <Alert variant="success" title="Saved">
        Preferences updated
      </Alert>,
    );
    expect(screen.getByRole('status')).toBe(region);
    expect(region).toHaveTextContent('Preferences updated');
  });
});
