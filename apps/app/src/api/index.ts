import { createHttpClient, type HttpClientOptions } from '@shsg/api-client';
import { ApiClient } from './ApiClient';
export { ApiClient } from './ApiClient';

export function createApiClient(options: HttpClientOptions) {
  return new ApiClient(createHttpClient(options));
}

console.log('This is a test file for Husky pre-commit hooks.');
