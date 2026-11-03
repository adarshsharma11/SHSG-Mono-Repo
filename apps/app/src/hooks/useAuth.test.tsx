import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { webcrypto } from 'node:crypto';
import { AuthProvider } from '../components/auth/auth-provider';
import { useAuth } from './useAuth';
import { DEMO_CREDENTIALS, SESSION_KEY, mockSignIn, mockSignUp, restoreSession } from '../lib/auth/mock-auth';

Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: webcrypto,
});
beforeEach(() => sessionStorage.clear());
const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe('mock auth and useAuth', () => {
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
      await first.result.current.signIn(DEMO_CREDENTIALS);
    });
    expect(first.result.current.isAuthenticated).toBe(true);
    expect(first.result.current.user?.email).toBe(DEMO_CREDENTIALS.email);
    first.unmount();
    const next = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(next.result.current.isAuthenticated).toBe(true));
    act(() => next.result.current.signOut());
    expect(next.result.current.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });
  it('creates an account, rejects duplicates and wrong passwords, and can sign in after logout', async () => {
    const values = {
      email: 'New.Owner@Example.com',
      password: 'a long demo passphrase',
    };
    const session = await mockSignUp(values);
    expect(session.user.email).toBe('new.owner@example.com');
    expect(JSON.stringify(sessionStorage)).not.toContain(values.password);
    await expect(mockSignUp(values)).rejects.toThrow('already exists');
    await expect(mockSignIn({ ...values, password: 'wrong' })).rejects.toThrow('Email or password is incorrect.');
    expect((await mockSignIn(values)).user.id).toBe(session.user.id);
  });
  it('rejects expired and malformed sessions', () => {
    sessionStorage.setItem(SESSION_KEY, 'invalid-json');
    expect(restoreSession()).toBeNull();
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        token: 'demo-example',
        expiresAt: Date.now() - 1,
        user: { id: '1', email: 'demo@shsg.local', name: 'Demo' },
      }),
    );
    expect(restoreSession()).toBeNull();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });
  it('expires a live session when the app regains focus', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    await act(async () => {
      await result.current.signIn(DEMO_CREDENTIALS);
    });
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
