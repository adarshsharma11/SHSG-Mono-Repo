'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { signIn as apiSignIn, signUp as apiSignUp } from '../../lib/auth/auth-client';
import { clearSession, restoreSession, saveSession, type AuthSession } from '../../lib/auth/auth-session';
import type { LoginValues, SignupValues } from './auth-schema';
import { AuthContext, type AuthContextData } from './auth-context';

export interface AuthOperations {
  signIn(values: LoginValues): Promise<AuthSession>;
  signUp(values: SignupValues): Promise<AuthSession>;
}

const defaultOperations: AuthOperations = { signIn: apiSignIn, signUp: apiSignUp };

export function AuthProvider({ children, operations = defaultOperations }: { children: React.ReactNode; operations?: AuthOperations }) {
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
    if (!session) return;
    const timeout = window.setTimeout(signOut, Math.max(0, session.expiresAt - Date.now()));
    const checkExpiry = () => {
      if (session.expiresAt <= Date.now()) signOut();
    };
    window.addEventListener('focus', checkExpiry);
    document.addEventListener('visibilitychange', checkExpiry);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('focus', checkExpiry);
      document.removeEventListener('visibilitychange', checkExpiry);
    };
  }, [session, signOut]);
  const signIn = useCallback(
    async (values: LoginValues) => {
      const nextSession = await operations.signIn(values);
      saveSession(nextSession);
      setSession(nextSession);
    },
    [operations],
  );
  const signUp = useCallback(
    async (values: SignupValues) => {
      const nextSession = await operations.signUp(values);
      saveSession(nextSession);
      setSession(nextSession);
    },
    [operations],
  );
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
