'use client';
import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Section, Skeleton, Spinner, Typography } from '@shsg/ui';

export function LoadingDemo() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  const submit = () => {
    setSubmitting(true);
    setSaved(false);
    timer.current = setTimeout(() => {
      setSubmitting(false);
      setSaved(true);
    }, 1200);
  };
  return (
    <>
      <Section
        title="List loading"
        description="Toggle between placeholders and the service list."
        actions={
          <Button size="sm" variant="outline" onClick={() => setLoading((value) => !value)}>
            {loading ? 'Show loaded list' : 'Show skeletons'}
          </Button>
        }
      >
        <p role="status" className="text-shsg-muted text-sm">
          {loading ? 'Loading services…' : '3 services loaded.'}
        </p>
        <div aria-busy={loading}>
          {loading ? (
            <div className="divide-shsg-secondary-border divide-y">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-4 py-5">
                  <Skeleton shape="circle" animation="shimmer" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="w-2/3" animation="shimmer" />
                    <Skeleton className="w-1/3" animation="shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-shsg-secondary-border divide-y">
              {['Home cleaning', 'Air conditioning service', 'Property maintenance'].map((service) => (
                <li key={service} className="flex flex-wrap items-center justify-between gap-3 py-5">
                  <Typography>{service}</Typography>
                  <Badge variant="success">Available</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
      <Section title="Submission feedback" description="A short simulated save blocks repeat submissions and reports completion.">
        <Button loading={submitting} loadingText="Saving preferences…" loadingIndicator={<Spinner decorative size="sm" tone="inherit" />} onClick={submit}>
          Save demo preferences
        </Button>
        <p role="status" className="text-shsg-success text-sm">
          {saved ? 'Demo preferences saved.' : ''}
        </p>
        <Typography variant="small" tone="muted">
          Demo only. Nothing is sent to a server. Reduced motion stops the spinner and skeleton effects.
        </Typography>
      </Section>
    </>
  );
}
