'use client';
import { useState } from 'react';
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Section, Switch } from '@shsg/ui';

export function SettingsExample() {
  const [updates, setUpdates] = useState(true);
  const [saved, setSaved] = useState(false);
  return (
    <Section title="Settings layout" description="A small working example; values stay on this page.">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose which service messages you receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
            }}
          >
            <Switch
              label="Email service updates"
              checked={updates}
              onChange={(event) => {
                setUpdates(event.target.checked);
                setSaved(false);
              }}
            />
            <Button type="submit">Save notification settings</Button>
          </form>
        </CardContent>
      </Card>
      <Alert variant={saved ? 'success' : 'info'} title={saved ? 'Settings saved' : 'Demo settings'}>
        {saved ? `Email updates are ${updates ? 'enabled' : 'disabled'}.` : 'Change the switch and save to try this layout.'}
      </Alert>
    </Section>
  );
}
