import { ApiError } from './ApiError';
import type { ServerApiConfig } from './config';
export type ApiOperation<Client> = (client: Client, signal: AbortSignal) => Promise<unknown>;
export function createApiProxy<Client>(getConfig: () => ServerApiConfig, createClient: (config: ServerApiConfig) => Client) {
  return async function proxy(request: Request, operation: ApiOperation<Client>, diagnostics = false): Promise<Response> {
    const headers = { 'Cache-Control': 'no-store' };
    try {
      const config = getConfig();
      if (diagnostics && !config.diagnosticsEnabled) return Response.json({ error: { code: 'NOT_FOUND', message: 'Not found.' } }, { status: 404, headers });
      const data = await operation(createClient(config), request.signal);
      return Response.json(data, { headers });
    } catch (error) {
      if (error instanceof ApiError) return Response.json(error.data ?? { error: { code: error.code, message: error.message } }, { status: error.status, headers });
      return Response.json(
        {
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'The API connection is not configured correctly.',
          },
        },
        { status: 500, headers },
      );
    }
  };
}
