import 'server-only';
import { connection } from 'next/server';
import { createApiProxy, type ApiOperation } from '@shsg/api-client/proxy';
import { createApiClient, type ApiClient } from '@/api';
import { getServerApiConfig } from './env.server';
const handle = createApiProxy(getServerApiConfig, createApiClient);
export async function proxyApi(request: Request, operation: ApiOperation<ApiClient>, diagnostics = false) {
  await connection();
  return handle(request, operation, diagnostics);
}
