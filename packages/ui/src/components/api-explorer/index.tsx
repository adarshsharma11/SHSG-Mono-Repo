'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert } from '../alert';
import { Badge } from '../badge';
import { Button } from '../button';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Spinner } from '../spinner';
import { Typography } from '../typography';

export interface ApiExplorerEndpoint {
  id: string;
  label: string;
  path: string;
  run: (signal: AbortSignal) => Promise<{ ok: boolean; status: number | null; data: unknown }>;
}
export interface ApiExplorerProps {
  title: string;
  endpoints: readonly ApiExplorerEndpoint[];
  children?: ReactNode;
}
export function ApiExplorer({ title, endpoints, children }: ApiExplorerProps) {
  const [state, setState] = useState<{
    id: string;
    phase: 'loading' | 'success' | 'error';
    status: number | null;
    data?: unknown;
    duration?: number;
  } | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const run = async (endpoint: ApiExplorerEndpoint) => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    const start = performance.now();
    setState({ id: endpoint.id, phase: 'loading', status: null });
    try {
      const result = await endpoint.run(request.signal);
      if (request.signal.aborted) return;
      setState({
        id: endpoint.id,
        phase: result.ok ? 'success' : 'error',
        status: result.status,
        data: result.data,
        duration: Math.round(performance.now() - start),
      });
    } catch {
      if (!request.signal.aborted)
        setState({
          id: endpoint.id,
          phase: 'error',
          status: null,
          data: { error: { message: 'The request could not be completed.' } },
        });
    }
  };
  return (
    <div className="text-shsg-ghost mx-auto w-full max-w-5xl space-y-8 px-6 py-12 font-sans sm:px-10">
      <header className="space-y-3">
        <Typography variant="overline" tone="muted">
          SHSG / Development tools
        </Typography>
        <Typography variant="h1">{title}</Typography>
        <Typography tone="muted">Run a read-only request through this frontend’s API handlers. Configuration stays on the server.</Typography>
      </header>
      <Alert title="Development explorer" variant="info">
        Requests run only when you choose an endpoint. Migration diagnostics require explicit local configuration and do not execute migrations.
      </Alert>
      {children}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle as="h2">Available requests</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-shsg-secondary-border divide-y">
              {endpoints.map((endpoint) => (
                <li key={endpoint.id} className="space-y-3 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Typography weight="medium">{endpoint.label}</Typography>
                    <Button size="sm" variant="outline" onClick={() => void run(endpoint)} aria-label={`Run ${endpoint.label}`}>
                      {state?.id === endpoint.id && state.phase === 'loading' ? 'Run again' : 'Run'}
                    </Button>
                  </div>
                  <div className="flex min-w-0 gap-2">
                    <Badge size="sm" variant="primary">
                      GET
                    </Badge>
                    <code className="text-shsg-muted text-xs break-all">{endpoint.path}</code>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card aria-busy={state?.phase === 'loading'}>
          <CardHeader>
            <CardTitle as="h2">Response preview</CardTitle>
            <p role="status" className="text-shsg-muted flex flex-wrap items-center gap-2 text-sm">
              {!state ? (
                'Choose a request to begin.'
              ) : state.phase === 'loading' ? (
                <>
                  <Spinner decorative size="sm" />
                  Loading {state.id}…
                </>
              ) : (
                <>
                  <Badge variant={state.phase === 'success' ? 'success' : 'danger'}>{state.status ?? 'Error'}</Badge>
                  {state.phase === 'success' ? 'Request completed' : 'Request failed'}
                  {state.duration !== undefined && ` · ${state.duration} ms`}
                </>
              )}
            </p>
          </CardHeader>
          <CardContent>
            {state?.phase !== 'loading' && state?.data !== undefined ? (
              <pre className="bg-shsg-field-muted max-h-[32rem] overflow-auto rounded-lg p-4 text-xs leading-6 break-words whitespace-pre-wrap" tabIndex={0} aria-label="API response">
                {JSON.stringify(state.data, null, 2)}
              </pre>
            ) : (
              <Typography variant="small" tone="muted">
                Health and readiness report the backend’s current state; services currently use the static catalog.
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
