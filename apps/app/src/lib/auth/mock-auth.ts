import type { AuthValues } from '../../components/auth/auth-schema';

export const DEMO_CREDENTIALS = Object.freeze({
  email: 'demo@shsg.local',
  password: 'DemoHome2026!',
});
export const SESSION_KEY = 'shsg.demo.session';
const ACCOUNTS_KEY = 'shsg.demo.accounts';
const SESSION_DURATION = 2 * 60 * 60 * 1000;
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
export interface AuthSession {
  token: string;
  expiresAt: number;
  user: AuthUser;
}
interface MockAccount extends AuthUser {
  salt: string;
  verifier: string;
}
export class MockAuthError extends Error {}
const normalize = (email: string) => email.trim().toLowerCase();

function read(key: string): unknown {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new MockAuthError('Allow browser session storage to use the demo.');
  }
}
function isUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') return false;
  const user = value as Partial<AuthUser>;
  return typeof user.id === 'string' && typeof user.email === 'string' && typeof user.name === 'string';
}
function accounts(): MockAccount[] {
  const value = read(ACCOUNTS_KEY);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is MockAccount => isUser(item) && typeof (item as Partial<MockAccount>).salt === 'string' && typeof (item as Partial<MockAccount>).verifier === 'string');
}
async function verifier(password: string, salt: string): Promise<string> {
  const bytes = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', bytes.encode(password), 'PBKDF2', false, ['deriveBits']);
  const result = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: bytes.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(result), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
function createSession(user: AuthUser): AuthSession {
  const session = {
    user,
    token: `demo-${crypto.randomUUID()}`,
    expiresAt: Date.now() + SESSION_DURATION,
  };
  write(SESSION_KEY, session);
  return session;
}
export function restoreSession(): AuthSession | null {
  const value = read(SESSION_KEY) as Partial<AuthSession> | null;
  if (value && isUser(value.user) && typeof value.token === 'string' && value.token.startsWith('demo-') && typeof value.expiresAt === 'number' && Number.isFinite(value.expiresAt) && value.expiresAt > Date.now() && value.expiresAt <= Date.now() + SESSION_DURATION) return value as AuthSession;
  clearSession();
  return null;
}
export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* In-memory logout still succeeds. */
  }
}
export async function mockSignIn({ email, password }: AuthValues): Promise<AuthSession> {
  const normalized = normalize(email);
  if (normalized === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password)
    return createSession({
      id: 'demo-owner',
      email: normalized,
      name: 'Demo owner',
    });
  const account = accounts().find((user) => user.email === normalized);
  if (!account || (await verifier(password, account.salt)) !== account.verifier) throw new MockAuthError('Email or password is incorrect.');
  return createSession({
    id: account.id,
    email: account.email,
    name: account.name,
  });
}
export async function mockSignUp({ email, password }: AuthValues): Promise<AuthSession> {
  const normalized = normalize(email);
  if (normalized === DEMO_CREDENTIALS.email || accounts().some((user) => user.email === normalized)) throw new MockAuthError('An account already exists for this email. Sign in instead.');
  if (!normalized || password.length < 12 || password.length > 128) throw new MockAuthError('Enter an email and a password with 12–128 characters.');
  const user = {
    id: crypto.randomUUID(),
    email: normalized,
    name: normalized.split('@')[0],
  };
  const salt = crypto.randomUUID();
  write(ACCOUNTS_KEY, [...accounts(), { ...user, salt, verifier: await verifier(password, salt) }]);
  return createSession(user);
}
