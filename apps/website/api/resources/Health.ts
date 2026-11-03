import { getData, type AxiosInstance, type RequestOptions, type Health as HealthResponse, type Readiness } from '@shsg/api-client';
export default function Health(http: AxiosInstance) {
  async function get({ signal }: RequestOptions = {}) {
    return getData<HealthResponse>(http, '/health', signal);
  }
  async function readiness({ signal }: RequestOptions = {}) {
    return getData<Readiness>(http, '/ready', signal);
  }
  return { get, readiness };
}
