import type { LoginRequest } from '@shsg/api-client';
import { proxyApi } from '@/lib/api.server';

export async function POST(request: Request) {
  let payload: LoginRequest;
  try {
    payload = (await request.json()) as LoginRequest;
  } catch {
    return Response.json({ error: { code: 'INVALID_REQUEST', message: 'A valid JSON request body is required.' } }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
  return proxyApi(request, (client, signal) => client.auth.login(payload, { signal }));
}
