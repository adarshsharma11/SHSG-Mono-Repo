import { describe, expect, it, vi } from 'vitest';
import axios, { AxiosError, CanceledError, type AxiosAdapter } from 'axios';
import { ApiError, createHttpClient, probeApi } from './index';
import { readServerApiConfig } from './config';
import { createApiProxy } from './proxy';
import { ApiClient as WebsiteApiClient } from '../../../apps/website/api/ApiClient';
import { ApiClient as AppApiClient } from '../../../apps/app/src/api/ApiClient';
const service = { id: 'hvac', name: 'HVAC', summary: 'Heating and cooling.' };
function mockHttp(data: unknown, status = 200) {
  const adapter = vi.fn<AxiosAdapter>(async (config) => {
    const response = { data, status, statusText: '', headers: {}, config };
    if (status >= 400) throw new AxiosError('private upstream details', 'ERR_BAD_RESPONSE', config, undefined, response);
    return response;
  });
  return { http: axios.create({ adapter }), adapter };
}
describe.each([
  ['website', WebsiteApiClient],
  ['app', AppApiClient],
] as const)('%s resource client', (_name, Client) => {
  it('uses the injected instance and returns service data', async () => {
    const { http, adapter } = mockHttp([service]);
    const client = new Client(http);
    expect(await client.services.list()).toEqual([service]);
    expect(adapter).toHaveBeenCalledWith(expect.objectContaining({ method: 'get', url: '/services' }));
  });
  it('validates service IDs before sending a request', async () => {
    const { http, adapter } = mockHttp(service);
    const client = new Client(http);
    expect(await client.services.get('hvac')).toEqual(service);
    await expect(client.services.get('../internal')).rejects.toMatchObject({
      code: 'INVALID_REQUEST',
    });
    expect(adapter).toHaveBeenCalledTimes(1);
  });
  it('discards upstream error bodies', async () => {
    await expect(new Client(mockHttp({ detail: 'private SQL' }, 404).http).services.get('missing')).rejects.toMatchObject({ status: 404, data: undefined });
  });
  it('preserves readiness failure status and returns migration data', async () => {
    const readiness = { status: 'not_ready', database: 'unavailable' };
    await expect(new Client(mockHttp(readiness, 503).http).health.readiness()).rejects.toMatchObject({ status: 503, data: undefined });
    const migrations = {
      tracking_table_exists: true,
      applied_revisions: ['0001_baseline'],
    };
    expect(await new Client(mockHttp(migrations).http).migrations.status()).toEqual(migrations);
  });
  it.each([
    [new AxiosError('private host', 'ERR_NETWORK'), 'NETWORK_ERROR', 502],
    [new AxiosError('private host', 'ECONNABORTED'), 'TIMEOUT', 504],
    [new CanceledError('private details'), 'CANCELLED', 499],
  ])('normalizes transport failures', async (error, code, status) => {
    const http = axios.create({
      adapter: async () => {
        throw error;
      },
    });
    await expect(new Client(http).health.get()).rejects.toMatchObject({
      code,
      status,
    });
    await expect(new Client(http).health.get()).rejects.not.toThrow('private');
  });
  it('forwards cancellation and avoids pre-cancelled requests', async () => {
    const { http, adapter } = mockHttp({ status: 'ok' });
    const controller = new AbortController();
    expect(await new Client(http).health.get({ signal: controller.signal })).toEqual({ status: 'ok' });
    expect(adapter).toHaveBeenCalledWith(expect.objectContaining({ signal: controller.signal }));
    controller.abort();
    await expect(new Client(http).health.get({ signal: controller.signal })).rejects.toMatchObject({ code: 'CANCELLED' });
    expect(adapter).toHaveBeenCalledTimes(1);
  });
});
describe('HTTP configuration', () => {
  it('configures isolated Axios instances', () => {
    const http = createHttpClient({ baseUrl: '/api/', timeoutMs: 1234 });
    expect(http.defaults.baseURL).toBe('/api');
    expect(http.defaults.timeout).toBe(1234);
    expect(http.defaults.maxRedirects).toBe(0);
    expect(http).not.toBe(createHttpClient({ baseUrl: '/api' }));
  });
  it('rejects unsafe configuration', () => {
    expect(() => createHttpClient({ baseUrl: '//host' })).toThrow();
    expect(() => createHttpClient({ baseUrl: 'http://user:secret@host' })).toThrow();
    expect(() => createHttpClient({ baseUrl: '/api', timeoutMs: 0 })).toThrow();
  });
  it('redacts unexpected probe failures', async () => {
    expect(
      await probeApi(async () => {
        throw new Error('private');
      }),
    ).toMatchObject({
      ok: false,
      status: null,
      data: { error: { code: 'UNEXPECTED_ERROR' } },
    });
  });
});
describe('server configuration and proxy', () => {
  it('freezes validated defaults and disables diagnostics outside development', () => {
    const config = readServerApiConfig({});
    expect(config).toEqual({
      baseUrl: 'http://127.0.0.1:8000',
      timeoutMs: 5000,
      diagnosticsEnabled: false,
    });
    expect(Object.isFrozen(config)).toBe(true);
    expect(
      readServerApiConfig({
        NODE_ENV: 'production',
        SHSG_ENABLE_DEV_DIAGNOSTICS: 'true',
      }).diagnosticsEnabled,
    ).toBe(false);
    expect(
      readServerApiConfig({
        NODE_ENV: 'development',
        SHSG_ENABLE_DEV_DIAGNOSTICS: 'true',
      }).diagnosticsEnabled,
    ).toBe(true);
  });
  it.each([{ SHSG_API_BASE_URL: 'ftp://host' }, { SHSG_API_BASE_URL: 'http://user:password@host' }, { SHSG_API_BASE_URL: '/relative' }, { SHSG_API_TIMEOUT_MS: 'NaN' }, { SHSG_ENABLE_DEV_DIAGNOSTICS: 'yes' }])('rejects invalid configuration %j', (env) => {
    expect(() => readServerApiConfig(env)).toThrow();
  });
  it('gates diagnostics before calling the operation and does not expose config errors', async () => {
    const operation = vi.fn();
    const proxy = createApiProxy(
      () => readServerApiConfig({}),
      () => ({}),
    );
    expect((await proxy(new Request('http://app/api/internal/migrations'), operation, true)).status).toBe(404);
    expect(operation).not.toHaveBeenCalled();
    const broken = createApiProxy(
      () => {
        throw new Error('private-password');
      },
      () => ({}),
    );
    const response = await broken(new Request('http://app/api/health'), operation);
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain('private-password');
  });
  it('returns JSON with no-store and propagates sanitized errors', async () => {
    const proxy = createApiProxy(
      () => readServerApiConfig({}),
      () => ({}),
    );
    const response = await proxy(new Request('http://app/api/services'), async () => [service]);
    expect(await response.json()).toEqual([service]);
    expect(response.headers.get('cache-control')).toBe('no-store');
    const failed = await proxy(new Request('http://app/api/services/x'), async () => {
      throw new ApiError('API request failed (404).', 404, 'HTTP_ERROR');
    });
    expect(failed.status).toBe(404);
    expect(await failed.json()).toEqual({
      error: { code: 'HTTP_ERROR', message: 'API request failed (404).' },
    });
  });
});
