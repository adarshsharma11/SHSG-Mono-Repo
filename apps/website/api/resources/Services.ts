import { ApiError, getData, type AxiosInstance, type RequestOptions, type Service } from '@shsg/api-client';
export default function Services(http: AxiosInstance) {
  async function list({ signal }: RequestOptions = {}) {
    return getData<Service[]>(http, '/services', signal);
  }
  async function get(id: string, { signal }: RequestOptions = {}) {
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) throw new ApiError('Use a service ID containing letters, numbers, underscores, or hyphens.', 400, 'INVALID_REQUEST');
    return getData<Service>(http, `/services/${encodeURIComponent(id)}`, signal);
  }
  return { list, get };
}
