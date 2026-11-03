import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, type AuthOperations } from '../components/auth/auth-provider';
import { SESSION_KEY, restoreSession, saveSession, type AuthSession } from '../lib/auth/auth-session';
import { useAuth } from './useAuth';

const session: AuthSession = {
  token: 'test-access-token-that-is-long-enough',
  expiresAt: Date.now() + 60 * 60 * 1000,
  user: { id: 'user-1', email: 'owner@example.com', name: 'Test owner', phone: '+15551234567' },
};
const operations = {
  signIn: vi.fn(async () => session),
  signUp: vi.fn(async () => session),
} satisfies AuthOperations;
const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider operations={operations}>{children}</AuthProvider>;

beforeEach(() => {
  sessionStorage.clear();
  operations.signIn.mockClear();
  operations.signUp.mockClear();
});

describe('server-backed auth and useAuth', () => {
  it('restores a ready signed-out state without auto-signing in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('signs in, restores the session on remount, and logs out', async () => {
    const first = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(first.result.current.status).toBe('ready'));
    await act(async () => {
      await first.result.current.signIn({ email: 'owner@example.com', password: 'correct-password' });
    });
    expect(operations.signIn).toHaveBeenCalledOnce();
    expect(first.result.current.isAuthenticated).toBe(true);
    expect(first.result.current.user?.email).toBe('owner@example.com');
    first.unmount();
    const next = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(next.result.current.isAuthenticated).toBe(true));
    act(() => next.result.current.signOut());
    expect(next.result.current.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('creates an account through the injected API operation', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    await act(async () => {
      await result.current.signUp({
        fullName: 'New Owner',
        phone: '+15551234567',
        email: 'new.owner@example.com',
        password: 'a long secure passphrase',
      });
    });
    expect(operations.signUp).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'New Owner' }));
    expect(result.current.isAuthenticated).toBe(true);
    expect(JSON.stringify(sessionStorage)).not.toContain('a long secure passphrase');
  });

  it('rejects expired and malformed sessions', () => {
    sessionStorage.setItem(SESSION_KEY, 'invalid-json');
    expect(restoreSession()).toBeNull();
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        token: 'test-access-token-that-is-long-enough',
        expiresAt: Date.now() - 1,
        user: session.user,
      }),
    );
    expect(restoreSession()).toBeNull();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('expires a live session when the app regains focus', async () => {
    saveSession(session);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    const original = Date.now;
    const expiredTime = result.current.expiresAt! + 1;
    try {
      Date.now = () => expiredTime;
      act(() => window.dispatchEvent(new Event('focus')));
      expect(result.current.isAuthenticated).toBe(false);
    } finally {
      Date.now = original;
    }
  });

  it('requires a provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider.');
  });
});
