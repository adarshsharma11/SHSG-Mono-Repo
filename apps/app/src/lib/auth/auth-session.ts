import type { LoginResponse } from '../../api/resources/Auth';

export const SESSION_KEY = 'shsg.auth.session';
const MAX_SESSION_DURATION = 24 * 60 * 60 * 1000;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface AuthSession {
  token: string;
  expiresAt: number;
  user: AuthUser;
}

function isUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const user = value as Partial<AuthUser>;
  return typeof user.id === 'string' && typeof user.email === 'string' && typeof user.name === 'string' && typeof user.phone === 'string';
}

export function createSession(response: LoginResponse): AuthSession {
  return {
    token: response.access_token,
    expiresAt: Date.now() + response.expires_in * 1000,
    user: {
      id: response.user.id,
      email: response.user.email,
      name: response.user.full_name,
      phone: response.user.phone,
    },
  };
}

export function saveSession(session: AuthSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    throw new Error('Allow browser session storage to stay signed in.');
  }
}

export function restoreSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    const value = raw ? (JSON.parse(raw) as Partial<AuthSession>) : null;
    const now = Date.now();
    if (value && isUser(value.user) && typeof value.token === 'string' && value.token.length > 20 && typeof value.expiresAt === 'number' && Number.isFinite(value.expiresAt) && value.expiresAt > now && value.expiresAt <= now + MAX_SESSION_DURATION) {
      return value as AuthSession;
    }
  } catch {
    // Invalid or unavailable storage is handled as a signed-out session.
  }
  clearSession();
  return null;
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // In-memory logout still succeeds.
  }
}
