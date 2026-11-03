import { createHttpClient, type HttpClientOptions } from '@shsg/api-client';
import { ApiClient } from './ApiClient';
export { ApiClient } from './ApiClient';

export function createApiClient(options: HttpClientOptions) {
  console.log('createApiClient', options);
  return new ApiClient(createHttpClient(options));
}
