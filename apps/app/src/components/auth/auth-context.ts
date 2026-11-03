'use client';
import { createContext } from 'react';
import type { AuthUser } from '../../lib/auth/auth-session';
import type { LoginValues, SignupValues } from './auth-schema';

export interface AuthContextData {
  status: 'loading' | 'ready';
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  expiresAt: number | null;
  signIn(values: LoginValues): Promise<void>;
  signUp(values: SignupValues): Promise<void>;
  signOut(): void;
}
export const AuthContext = createContext<AuthContextData | undefined>(undefined);
