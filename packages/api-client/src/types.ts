export interface Service {
  id: string;
  name: string;
  summary: string;
}
export interface Health {
  status: 'ok';
}
export interface Readiness {
  status: 'ready' | 'not_ready';
  database: 'ok' | 'unavailable';
}
export interface MigrationStatus {
  tracking_table_exists: boolean;
  applied_revisions: string[];
}
export interface RequestOptions {
  signal?: AbortSignal;
}
export interface ApiProbeResult {
  ok: boolean;
  status: number | null;
  data: unknown;
}
