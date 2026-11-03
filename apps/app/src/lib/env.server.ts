import 'server-only';
import { readServerApiConfig } from '@shsg/api-client/config';

export function getServerApiConfig() {
  return readServerApiConfig({
    NODE_ENV: process.env.NODE_ENV,
    SHSG_API_BASE_URL: process.env.SHSG_API_BASE_URL,
    SHSG_API_TIMEOUT_MS: process.env.SHSG_API_TIMEOUT_MS,
    SHSG_ENABLE_DEV_DIAGNOSTICS: process.env.SHSG_ENABLE_DEV_DIAGNOSTICS,
  });
}
