import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from './auth-provider';
import { AuthScreen } from './auth-screen';
import { GuestAccess } from './guest-access';
import { AuthEntry } from './auth-entry';
import { WorkspaceAccess } from './workspace-access';
import { DashboardShell } from '../dashboard/dashboard-shell';
import type { AuthOperations } from './auth-provider';
import { SESSION_KEY, saveSession, type AuthSession } from '../../lib/auth/auth-session';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
beforeEach(() => {
  sessionStorage.clear();
  replace.mockClear();
  operations.signIn.mockClear();
  operations.signUp.mockClear();
});
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
HTMLDialogElement.prototype.close = function () {
  this.open = false;
};

const testSession: AuthSession = {
  token: 'test-access-token-that-is-long-enough',
  expiresAt: Date.now() + 60 * 60 * 1000,
  user: { id: 'user-1', email: 'owner@example.com', name: 'Test owner', phone: '+15551234567' },
};
const operations = {
  signIn: vi.fn(async () => testSession),
  signUp: vi.fn(async () => testSession),
} satisfies AuthOperations;
const Provider = ({ children }: { children: React.ReactNode }) => <AuthProvider operations={operations}>{children}</AuthProvider>;

describe('authentication flow', () => {
  it('routes a signed-in root visit directly to the dashboard', async () => {
    saveSession(testSession);
    render(
      <Provider>
        <AuthEntry />
      </Provider>,
    );
    expect(replace).not.toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
    expect(replace).not.toHaveBeenCalledWith('/login');
  });
  it('routes a signed-out root visit to login after restoration', async () => {
    render(
      <Provider>
        <AuthEntry />
      </Provider>,
    );
    expect(replace).not.toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
  });
  it.each(['login', 'signup'] as const)('never mounts the auth frame or form for a signed-in %s visit', async (mode) => {
    saveSession(testSession);
    render(
      <Provider>
        <GuestAccess>
          <section aria-label="Authentication frame">
            <AuthScreen mode={mode} />
          </section>
        </GuestAccess>
      </Provider>,
    );
    expect(screen.queryByRole('region', { name: 'Authentication frame' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
    expect(screen.queryByRole('region', { name: 'Authentication frame' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
  });
  it('does not render the login form while restoring a signed-out session', async () => {
    render(
      <Provider>
        <GuestAccess>
          <AuthScreen mode="login" />
        </GuestAccess>
      </Provider>,
    );
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(await screen.findByLabelText(/email address/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('signs in through useAuth from the real form and navigates to the dashboard', async () => {
    const user = userEvent.setup();
    render(
      <Provider>
        <GuestAccess>
          <AuthScreen mode="login" />
        </GuestAccess>
      </Provider>,
    );
    await user.type(await screen.findByLabelText(/email address/i), 'owner@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'correct-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
    expect(operations.signIn).toHaveBeenCalledWith(expect.objectContaining({ email: 'owner@example.com' }));
    expect(sessionStorage.getItem(SESSION_KEY)).toContain('user-1');
  });
  it('creates an account through the signup page and navigates', async () => {
    const user = userEvent.setup();
    render(
      <Provider>
        <GuestAccess>
          <AuthScreen mode="signup" />
        </GuestAccess>
      </Provider>,
    );
    await user.type(await screen.findByLabelText(/full name/i), 'New Owner');
    await user.type(screen.getByLabelText(/phone number/i), '+15551234567');
    await user.type(screen.getByLabelText(/email address/i), 'new@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'a long demo password');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'));
    expect(operations.signUp).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'New Owner', phone: '+15551234567' }));
  });
  it('preserves the page segment while keeping its content behind a page-level guard', async () => {
    render(
      <Provider>
        <DashboardShell>
          <section aria-label="Page segment">
            <WorkspaceAccess>
              <h1>Private estimate</h1>
            </WorkspaceAccess>
          </section>
        </DashboardShell>
      </Provider>,
    );
    expect(screen.getByRole('region', { name: 'Page segment' })).toBeInTheDocument();
    expect(screen.queryByText('Private estimate')).not.toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(screen.getByRole('region', { name: 'Page segment' })).toBeInTheDocument();
    expect(screen.queryByText('Private estimate')).not.toBeInTheDocument();
  });

  it('blocks dashboard content when signed out', async () => {
    render(
      <Provider>
        <DashboardShell>
          <WorkspaceAccess>
            <h1>Protected workspace</h1>
          </WorkspaceAccess>
        </DashboardShell>
      </Provider>,
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('Protected workspace')).not.toBeInTheDocument();
  });
  it('restores a session, opens account settings, and logs out', async () => {
    const user = userEvent.setup();
    saveSession(testSession);
    render(
      <Provider>
        <DashboardShell>
          <WorkspaceAccess>
            <h1>Protected workspace</h1>
          </WorkspaceAccess>
        </DashboardShell>
      </Provider>,
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
