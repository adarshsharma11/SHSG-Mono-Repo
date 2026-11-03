import { proxyApi } from '@/lib/api.server';
export function GET(request: Request) {
  return proxyApi(request, (client, signal) => client.migrations.status({ signal }), true);
}
