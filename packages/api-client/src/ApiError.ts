export type ApiErrorCode = 'HTTP_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT' | 'CANCELLED' | 'INVALID_REQUEST';
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: ApiErrorCode,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
