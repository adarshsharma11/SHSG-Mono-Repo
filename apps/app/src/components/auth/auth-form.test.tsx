import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthForm } from './auth-form';

describe('authentication forms', () => {
  it.each(['login', 'signup'] as const)('requires both fields in %s and focuses the first error', async (mode) => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<AuthForm mode={mode} onSubmit={submit} />);
    await user.click(
      screen.getByRole('button', {
        name: mode === 'login' ? 'Sign in' : 'Create account',
      }),
    );
    expect(await screen.findByText('Enter your email address.')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toHaveFocus();
    expect(screen.getByLabelText(/^password/i)).toHaveAttribute('aria-invalid', 'true');
    expect(submit).not.toHaveBeenCalled();
  });

  it('validates email on blur and shows an associated error', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="login" />);
    const email = screen.getByLabelText(/email address/i);
    await user.type(email, 'invalid-address');
    await user.tab();
    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Enter a valid email address.');
  });

  it('applies signup length rules and submits transformed email through the injected operation', async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockResolvedValue(undefined);
    render(<AuthForm mode="signup" onSubmit={submit} />);
    await user.type(screen.getByLabelText(/email address/i), '  owner@example.com  ');
    await user.type(screen.getByLabelText(/^password/i), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Use at least 12 characters.')).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText(/^password/i));
    await user.type(screen.getByLabelText(/^password/i), 'a long passphrase');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({
        email: 'owner@example.com',
        password: 'a long passphrase',
      }),
    );
    await waitFor(() => expect(screen.getByLabelText(/^password/i)).toHaveValue(''));
  });

  it('allows existing shorter passwords on login and derives pending state from React Hook Form', async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    const submit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    render(<AuthForm mode="login" onSubmit={submit} />);
    await user.type(screen.getByLabelText(/email address/i), 'owner@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'existing');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('button', { name: /signing in/i })).toBeDisabled();
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(submit).toHaveBeenCalledOnce();
    finish();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled());
  });

  it('reports unavailable authentication without sending or storing credentials', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const storage = vi.spyOn(Storage.prototype, 'setItem');
    render(<AuthForm mode="login" />);
    await user.type(screen.getByLabelText(/email address/i), 'owner@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'private-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Sign-in is not available yet. No credentials were sent.');
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storage).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/^password/i)).toHaveValue('');
  });

  it('redacts authentication exception details', async () => {
    const user = userEvent.setup();
    render(
      <AuthForm
        mode="login"
        onSubmit={async () => {
          throw new Error('private database and token');
        }}
      />,
    );
    await user.type(screen.getByLabelText(/email address/i), 'owner@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'existing');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t sign you in. Please try again.');
    expect(screen.queryByText(/private database/)).not.toBeInTheDocument();
  });

  it.each([
    ['login', 'Create an account', '/signup', 'current-password'],
    ['signup', 'Sign in', '/login', 'new-password'],
  ] as const)('links the %s page to its companion and uses password-manager semantics', (mode, link, href, autocomplete) => {
    render(<AuthForm mode={mode} />);
    expect(screen.getByRole('link', { name: link })).toHaveAttribute('href', href);
    expect(screen.getByLabelText(/^password/i)).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText(/^password/i)).toHaveAttribute('autocomplete', autocomplete);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });
});
