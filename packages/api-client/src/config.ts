export interface ServerApiConfig {
  baseUrl: string;
  timeoutMs: number;
  diagnosticsEnabled: boolean;
}
type Environment = Record<string, string | undefined>;

export function getEnvVar(env: Environment, name: string, fallback?: string): string {
  const value = env[name] ?? fallback;
  if (!value?.trim()) throw new Error(`Environment variable ${name} is not set.`);
  return value;
}

function getNumberEnvVar(env: Environment, name: string, fallback: string): number {
  const value = Number(getEnvVar(env, name, fallback));
  if (!Number.isInteger(value) || value < 1 || value > 30000) throw new Error(`${name} must be an integer between 1 and 30000.`);
  return value;
}

function getBooleanEnvVar(env: Environment, name: string): boolean {
  const value = getEnvVar(env, name, 'false');
  if (value !== 'true' && value !== 'false') throw new Error(`${name} must be true or false.`);
  return value === 'true';
}

export function readServerApiConfig(env: Environment): Readonly<ServerApiConfig> {
  const raw = getEnvVar(env, 'SHSG_API_BASE_URL', 'http://127.0.0.1:8000');
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('SHSG_API_BASE_URL must be an absolute HTTP(S) URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('SHSG_API_BASE_URL must use HTTP(S) without credentials, query, or fragment.');
  const timeoutMs = getNumberEnvVar(env, 'SHSG_API_TIMEOUT_MS', '5000');
  const diagnosticsEnabled = getBooleanEnvVar(env, 'SHSG_ENABLE_DEV_DIAGNOSTICS');
  return Object.freeze({
    baseUrl: url.toString().replace(/\/$/, ''),
    timeoutMs,
    diagnosticsEnabled: env.NODE_ENV === 'development' && diagnosticsEnabled,
  });
}
