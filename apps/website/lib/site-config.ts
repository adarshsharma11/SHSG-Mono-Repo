/** The application entry point is intentionally public; API credentials are not. */
export function parseAppUrl(value = 'http://localhost:9002'): string {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('SHSG_APP_URL must be an HTTP(S) URL without credentials, query, or fragment.');
  }
  return url.toString();
}
