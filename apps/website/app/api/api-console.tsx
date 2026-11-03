'use client';
import { useState } from 'react';
import { probeApi } from '@shsg/api-client';
import { createApiClient } from '@/api';
import { ApiExplorer, Input, Typography, type ApiExplorerEndpoint } from '@shsg/ui';

const client = createApiClient({ baseUrl: '/api' });
export function ApiConsole({ diagnosticsEnabled }: { diagnosticsEnabled: boolean }) {
  const [serviceId, setServiceId] = useState('hvac');
  const endpoints: ApiExplorerEndpoint[] = [
    {
      id: 'health',
      label: 'Health',
      path: '/api/health',
      run: (signal) => probeApi(() => client.health.get({ signal })),
    },
    {
      id: 'ready',
      label: 'Readiness',
      path: '/api/ready',
      run: (signal) => probeApi(() => client.health.readiness({ signal })),
    },
    {
      id: 'services',
      label: 'Services',
      path: '/api/services',
      run: (signal) => probeApi(() => client.services.list({ signal })),
    },
    {
      id: 'service',
      label: 'Service details',
      path: `/api/services/${encodeURIComponent(serviceId)}`,
      run: (signal) => probeApi(() => client.services.get(serviceId, { signal })),
    },
  ];
  if (diagnosticsEnabled) {
    endpoints.push({
      id: 'migrations',
      label: 'Migration status',
      path: '/api/internal/migrations',
      run: (signal) => probeApi(() => client.migrations.status({ signal })),
    });
  }
  return (
    <ApiExplorer title="API explorer" endpoints={endpoints}>
      <div className="max-w-md space-y-3">
        <Input label="Service ID" value={serviceId} onChange={(event) => setServiceId(event.target.value)} description="Use hvac, plumbing, or electrical, or try an unknown ID." />
        {!diagnosticsEnabled && (
          <Typography variant="small" tone="muted">
            Migration status is disabled. Enable local diagnostics in both the frontend and FastAPI environment to inspect applied revisions.
          </Typography>
        )}
      </div>
    </ApiExplorer>
  );
}
