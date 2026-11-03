import { ApiError } from './ApiError';
import type { ApiProbeResult } from './types';
export { ApiError } from './ApiError';
export type { ApiErrorCode } from './ApiError';
export { createHttpClient, getData } from './http';
export type { HttpClientOptions, AxiosInstance } from './http';
export type * from './types';

export async function probeApi(operation: () => Promise<unknown>): Promise<ApiProbeResult> {
  try {
    return { ok: true, status: 200, data: await operation() };
  } catch (error) {
    if (error instanceof ApiError)
      return {
        ok: false,
        status: error.status,
        data: error.data ?? {
          error: { code: error.code, message: error.message },
        },
      };
    return {
      ok: false,
      status: null,
      data: {
        error: {
          code: 'UNEXPECTED_ERROR',
          message: 'The request could not be completed.',
        },
      },
    };
  }
}
