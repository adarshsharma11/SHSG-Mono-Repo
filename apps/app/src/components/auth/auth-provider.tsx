'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearSession, mockSignIn, mockSignUp, restoreSession, type AuthSession } from '../../lib/auth/mock-auth';
import type { AuthValues } from './auth-schema';
import { AuthContext, type AuthContextData } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthContextData['status']>('loading');
  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);
  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) {
        setSession(restoreSession());
        setStatus('ready');
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!session) {
      return;
    }
    const timeout = window.setTimeout(signOut, Math.max(0, session.expiresAt - Date.now()));
    const checkExpiry = () => {
      if (session.expiresAt <= Date.now()) {
        signOut();
      }
    };
    window.addEventListener('focus', checkExpiry);
    document.addEventListener('visibilitychange', checkExpiry);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('focus', checkExpiry);
      document.removeEventListener('visibilitychange', checkExpiry);
    };
  }, [session, signOut]);
  const signIn = useCallback(async (values: AuthValues) => {
    setSession(await mockSignIn(values));
  }, []);
  const signUp = useCallback(async (values: AuthValues) => {
    setSession(await mockSignUp(values));
  }, []);
  const value = useMemo(
    () => ({
      status,
      isAuthenticated: session !== null,
      user: session?.user ?? null,
      token: session?.token ?? null,
      expiresAt: session?.expiresAt ?? null,
      signIn,
      signUp,
      signOut,
    }),
    [status, session, signIn, signUp, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
