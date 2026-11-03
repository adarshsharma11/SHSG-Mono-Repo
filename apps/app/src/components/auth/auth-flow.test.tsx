import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { AuthProvider } from './auth-provider';
import { AuthScreen } from './auth-screen';
import { GuestAccess } from './guest-access';
import { AuthEntry } from './auth-entry';
import { WorkspaceAccess } from './workspace-access';
import { DashboardShell } from '../dashboard/dashboard-shell';
import { SESSION_KEY, mockSignIn, DEMO_CREDENTIALS } from '../../lib/auth/mock-auth';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: webcrypto,
});
beforeEach(() => {
  sessionStorage.clear();
  replace.mockClear();
});
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
HTMLDialogElement.prototype.close = function () {
  this.open = false;
};

describe('mock authentication flow', () => {
  it('routes a signed-in root visit directly to the dashboard', async () => {
    await mockSignIn(DEMO_CREDENTIALS);
    render(
      <AuthProvider>
        <AuthEntry />
      </AuthProvider>,
    );
    expect(replace).not.toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
    expect(replace).not.toHaveBeenCalledWith('/login');
  });
  it('routes a signed-out root visit to login after restoration', async () => {
    render(
      <AuthProvider>
        <AuthEntry />
      </AuthProvider>,
    );
    expect(replace).not.toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
  });
  it.each(['login', 'signup'] as const)('never mounts the auth frame or form for a signed-in %s visit', async (mode) => {
    await mockSignIn(DEMO_CREDENTIALS);
    render(
      <AuthProvider>
        <GuestAccess>
          <section aria-label="Authentication frame">
            <AuthScreen mode={mode} />
          </section>
        </GuestAccess>
      </AuthProvider>,
    );
    expect(screen.queryByRole('region', { name: 'Authentication frame' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
    expect(screen.queryByRole('region', { name: 'Authentication frame' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
  });
  it('does not render the login form while restoring a signed-out session', async () => {
    render(
      <AuthProvider>
        <GuestAccess>
          <AuthScreen mode="login" />
        </GuestAccess>
      </AuthProvider>,
    );
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(await screen.findByLabelText(/email address/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('signs in through useAuth from the real form and navigates to the dashboard', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <GuestAccess>
          <AuthScreen mode="login" />
        </GuestAccess>
      </AuthProvider>,
    );
    await user.click(await screen.findByRole('button', { name: 'Use demo account' }));
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
    expect(sessionStorage.getItem(SESSION_KEY)).toContain('demo-owner');
  });
  it('creates a mock account through the signup page and navigates', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <GuestAccess>
          <AuthScreen mode="signup" />
        </GuestAccess>
      </AuthProvider>,
    );
    await user.type(await screen.findByLabelText(/email address/i), 'new@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'a long demo password');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
  });
  it('preserves the page segment while keeping its content behind a page-level guard', async () => {
    render(
      <AuthProvider>
        <DashboardShell>
          <section aria-label="Page segment">
            <WorkspaceAccess>
              <h1>Private estimate</h1>
            </WorkspaceAccess>
          </section>
        </DashboardShell>
      </AuthProvider>,
    );
    expect(screen.getByRole('region', { name: 'Page segment' })).toBeInTheDocument();
    expect(screen.queryByText('Private estimate')).not.toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(screen.getByRole('region', { name: 'Page segment' })).toBeInTheDocument();
    expect(screen.queryByText('Private estimate')).not.toBeInTheDocument();
  });

  it('blocks dashboard content when signed out', async () => {
    render(
      <AuthProvider>
        <DashboardShell>
          <WorkspaceAccess>
            <h1>Protected workspace</h1>
          </WorkspaceAccess>
        </DashboardShell>
      </AuthProvider>,
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('Protected workspace')).not.toBeInTheDocument();
  });
  it('restores a session, opens account settings, and logs out', async () => {
    const user = userEvent.setup();
    await mockSignIn(DEMO_CREDENTIALS);
    render(
      <AuthProvider>
        <DashboardShell>
          <WorkspaceAccess>
            <h1>Protected workspace</h1>
          </WorkspaceAccess>
        </DashboardShell>
      </AuthProvider>,
    );
    expect(await screen.findByText('Protected workspace')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Account settings' })[0]);
    expect(await screen.findByRole('dialog', { name: 'Account settings' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Log out' }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    expect(screen.queryByText('Protected workspace')).not.toBeInTheDocument();
  });
});
