import { getData, type AxiosInstance, type RequestOptions, type MigrationStatus } from '@shsg/api-client';
export default function Migrations(http: AxiosInstance) {
  async function status({ signal }: RequestOptions = {}) {
    return getData<MigrationStatus>(http, '/internal/migrations', signal);
  }
  return { status };
}
