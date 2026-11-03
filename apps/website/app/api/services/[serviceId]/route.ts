import { proxyApi } from '@/lib/api.server';
export async function GET(request: Request, context: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await context.params;
  return proxyApi(request, (client, signal) => client.services.get(serviceId, { signal }));
}
