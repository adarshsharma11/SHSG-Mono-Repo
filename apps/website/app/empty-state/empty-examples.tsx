'use client';
import { useState } from 'react';
import { Alert, Button, EmptyState, Section, Typography } from '@shsg/ui';
export function EmptyExamples() {
  const [cleared, setCleared] = useState(false);
  const [recovered, setRecovered] = useState(false);
  return (
    <>
      <Section title="No search results" description="Offer a way to broaden the search.">
        {cleared ? (
          <div className="space-y-4">
            <Alert variant="success" title="Filters cleared">
              Home cleaning, property maintenance, and air conditioning service are available.
            </Alert>
            <Button variant="outline" size="sm" onClick={() => setCleared(false)}>
              Restore empty search
            </Button>
          </div>
        ) : (
          <EmptyState
            title="No services match these filters"
            description="Try fewer filters or search for another service."
            actions={<Button onClick={() => setCleared(true)}>Clear filters</Button>}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="10" cy="10" r="6" />
                <path d="m15 15 6 6" />
              </svg>
            }
          />
        )}
      </Section>
      <Section title="Recoverable error" description="Keep the explanation short and offer a retry.">
        {recovered ? (
          <div className="space-y-4">
            <Alert variant="success" title="Visit history loaded">
              The retry succeeded in this local demo.
            </Alert>
            <Button variant="outline" size="sm" onClick={() => setRecovered(false)}>
              Show error again
            </Button>
          </div>
        ) : (
          <EmptyState title="Visit history could not load" description="Try loading the history again." actions={<Button onClick={() => setRecovered(true)}>Try again</Button>} />
        )}
      </Section>
      <Section title="Compact and text-only" description="Use a smaller layout inside a table cell or secondary panel.">
        <EmptyState compact icon={false} title="No notes added" description="Notes will appear here when you add them." />
        <Typography variant="small" tone="muted">
          Empty states are static content by default. Use an Alert or status message to announce the outcome of a recovery action.
        </Typography>
      </Section>
    </>
  );
}
