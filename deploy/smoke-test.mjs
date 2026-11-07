// Creates an account in the isolated CI database; do not run against production.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const websiteUrl = process.env.SMOKE_WEBSITE_URL || 'http://127.0.0.1:9001';
const appUrl = process.env.SMOKE_APP_URL || 'http://127.0.0.1:9002';
const expectedAppUrl = (process.env.SHSG_APP_URL || 'http://localhost:9002').replace(/\/$/, '');

async function request(url, payload) {
  const response = await fetch(url, {
    method: payload ? 'POST' : 'GET',
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  assert.ok(response.ok, `${url}: HTTP ${response.status}`);
  return payload ? response.json() : response.text();
}

const home = await request(`${websiteUrl}/`);
assert.ok(home.includes(expectedAppUrl), 'Website links must target the configured app');
for (const url of [`${appUrl}/login`, `${appUrl}/signup`, `${websiteUrl}/api/health`, `${appUrl}/api/health`]) {
  await request(url);
}
const email = `smoke-${randomUUID()}@example.com`;
const password = 'CI-only-strong-password-2026!';
await request(`${appUrl}/api/auth/signup`, { full_name: 'CI Smoke Test', email, phone: '+61412345678', password });
const login = await request(`${appUrl}/api/auth/login`, { email, password });
assert.ok(login.data.access_token, 'Login must return a bearer token');
assert.equal(login.data.user.email, email);
console.log('Production pages, backend proxy, signup and login passed');
