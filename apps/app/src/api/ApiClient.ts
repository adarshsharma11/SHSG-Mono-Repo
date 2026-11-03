import type { AxiosInstance } from '@shsg/api-client';
import Services from './resources/Services';
import Health from './resources/Health';
import Migrations from './resources/Migrations';
import Auth from './resources/Auth';

export class ApiClient {
  public readonly services: ReturnType<typeof Services>;
  public readonly health: ReturnType<typeof Health>;
  public readonly migrations: ReturnType<typeof Migrations>;
  public readonly auth: ReturnType<typeof Auth>;

  constructor(http: AxiosInstance) {
    this.services = Services(http);
    this.health = Health(http);
    this.migrations = Migrations(http);
    this.auth = Auth(http);
  }
}
