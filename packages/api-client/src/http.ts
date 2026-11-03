import axios, { type AxiosInstance } from 'axios';
import { ApiError } from './ApiError';
export { ApiError } from './ApiError';
export type { AxiosInstance } from 'axios';

export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

export function createHttpClient({ baseUrl, timeoutMs = 5000 }: HttpClientOptions): AxiosInstance {
  const base = baseUrl.replace(/\/+$/, '');
  if (!base || base.startsWith('//')) throw new Error('An API base URL is required.');
  if (!base.startsWith('/')) {
    const url = new URL(base);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('API base URL must use HTTP(S) without credentials, query, or fragment.');
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000) throw new Error('API timeout must be between 1 and 30000 milliseconds.');
  return axios.create({
    baseURL: base,
    timeout: timeoutMs,
    responseType: 'json',
    headers: { Accept: 'application/json', 'Cache-Control': 'no-store' },
    maxRedirects: 0,
  });
}

export async function getData<T>(http: AxiosInstance, path: string, signal?: AbortSignal): Promise<T> {
  try {
    const { data } = await http.get<T>(path, { signal });
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (axios.isCancel(error) || signal?.aborted) throw new ApiError('Request cancelled.', 499, 'CANCELLED');
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') throw new ApiError('The API request timed out.', 504, 'TIMEOUT');
      if (error.response) {
        throw new ApiError(`API request failed (${error.response.status}).`, error.response.status, 'HTTP_ERROR');
      }
    }
    throw new ApiError('The API could not be reached.', 502, 'NETWORK_ERROR');
  }
}
