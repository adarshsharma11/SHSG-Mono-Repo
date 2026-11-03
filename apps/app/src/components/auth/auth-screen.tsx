'use client';
import { useAuth } from '../../hooks/useAuth';
import { AuthForm } from './auth-form';
import type { AuthMode } from './auth-schema';

/** GuestAccess owns route decisions; this component only connects form actions. */
export function AuthScreen({ mode }: { mode: AuthMode }) {
  const auth = useAuth();
  return <AuthForm key={mode} mode={mode} onSubmit={mode === 'login' ? auth.signIn : auth.signUp} />;
}
