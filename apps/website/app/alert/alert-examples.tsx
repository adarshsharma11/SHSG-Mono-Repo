'use client';
import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Typography } from '@shsg/ui';

export function AlertExamples() {
  const [visible, setVisible] = useState(true);
  const [reviewed, setReviewed] = useState(false);
  const [saved, setSaved] = useState(false);
  const restoreRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!visible) restoreRef.current?.focus();
  }, [visible]);
  return (
    <>
      <section aria-labelledby="alert-actions" className="border-shsg-secondary-border space-y-6 border-t pt-8">
        <Typography as="h2" variant="h3" id="alert-actions">
          Actions and dismissal
        </Typography>
        <Typography tone="muted">Review the message, dismiss it, or restore it to try again.</Typography>
        {visible && (
          <Alert
            variant={reviewed ? 'success' : 'warning'}
            title={reviewed ? 'Instructions reviewed' : 'Your visit needs a quick review'}
            dismissLabel="Dismiss visit reminder"
            onDismiss={() => setVisible(false)}
            actions={
              <>
                <Button size="sm" variant="outline" onClick={() => setReviewed((value) => !value)}>
                  {reviewed ? 'Mark for review' : 'Review instructions'}
                </Button>
                <Badge size="sm" variant={reviewed ? 'success' : 'warning'}>
                  {reviewed ? 'Ready' : 'Needs review'}
                </Badge>
              </>
            }
          >
            {reviewed ? 'Your access instructions are ready for the service professional.' : 'Confirm that your property access instructions are up to date.'}
          </Alert>
        )}
        <Button
          ref={restoreRef}
          variant="secondary"
          size="sm"
          disabled={visible}
          onClick={() => {
            setReviewed(false);
            setVisible(true);
          }}
        >
          Restore reminder
        </Button>
      </section>
      <section aria-labelledby="alert-feedback" className="border-shsg-secondary-border space-y-6 border-t pt-8">
        <Typography as="h2" variant="h3" id="alert-feedback">
          Feedback after an action
        </Typography>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setSaved(true)} disabled={saved}>
            Save demo preferences
          </Button>
          <Button variant="ghost" onClick={() => setSaved(false)} disabled={!saved}>
            Reset example
          </Button>
        </div>
        <Alert variant={saved ? 'success' : 'info'} title={saved ? 'Preferences saved' : 'Ready to save'}>
          {saved ? 'Your demo preferences have been updated on this page.' : 'Choose Save demo preferences to see the feedback change.'}
        </Alert>
        <Typography variant="small" tone="muted">
          Informational messages use a polite status region. Errors use an assertive alert. Nothing is sent to a server.
        </Typography>
      </section>
    </>
  );
}
