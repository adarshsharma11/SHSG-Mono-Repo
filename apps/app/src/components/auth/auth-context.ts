'use client';
import { createContext } from 'react';
import type { AuthUser } from '../../lib/auth/mock-auth';
import type { AuthValues } from './auth-schema';

export interface AuthContextData {
  status: 'loading' | 'ready';
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  expiresAt: number | null;
  signIn(values: AuthValues): Promise<void>;
  signUp(values: AuthValues): Promise<void>;
  signOut(): void;
}
export const AuthContext = createContext<AuthContextData | undefined>(undefined);
