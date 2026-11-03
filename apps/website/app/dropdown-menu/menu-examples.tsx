'use client';
import { useState } from 'react';
import { Badge, DropdownMenu, Section, Typography } from '@shsg/ui';
export function MenuExamples() {
  const [message, setMessage] = useState('');
  const [archived, setArchived] = useState(false);
  return (
    <>
      <Section title="Visit actions" description="Try arrow keys, Home/End, typeahead, Enter, and Escape.">
        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu
            label="Visit actions"
            items={[
              {
                id: 'details',
                label: 'View details',
                onSelect: () => setMessage('Showing demo visit details.'),
              },
              {
                id: 'reschedule',
                label: 'Reschedule visit',
                onSelect: () => setMessage('Reschedule selected. This is a local demo.'),
              },
              { id: 'receipt', label: 'Download receipt', disabled: true },
              { id: 'divider', type: 'separator' },
              {
                id: 'archive',
                label: archived ? 'Restore visit' : 'Archive visit',
                danger: !archived,
                onSelect: () => {
                  setArchived((value) => !value);
                  setMessage(archived ? 'Visit restored in the demo.' : 'Visit archived in the demo.');
                },
              },
            ]}
          />
          <Badge variant={archived ? 'neutral' : 'primary'}>{archived ? 'Archived' : 'Scheduled'}</Badge>
        </div>
        <p role="status" className="text-shsg-muted min-h-6 text-sm">
          {message}
        </p>
      </Section>
      <Section title="Compact and aligned menus" description="Icon triggers keep their accessible names. Popups flip and stay within the viewport.">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <DropdownMenu
            label="More service actions"
            trigger={<span aria-hidden="true">•••</span>}
            align="start"
            items={[
              {
                id: 'edit',
                label: 'Edit service',
                onSelect: () => setMessage('Edit service selected.'),
              },
              { id: 'history', label: 'View history', href: '/table' },
            ]}
          />
          <DropdownMenu
            label="Component shortcuts"
            align="end"
            items={[
              { id: 'forms', label: 'Input examples', href: '/input' },
              { id: 'tabs', label: 'Tab examples', href: '/tabs' },
              { id: 'tables', label: 'Table examples', href: '/table' },
            ]}
          />
          <DropdownMenu label="Unavailable actions" disabled items={[]} />
        </div>
        <Typography variant="small" tone="muted">
          Disabled actions are skipped by keyboard navigation. Escape and selection return focus to the trigger; outside clicks dismiss without stealing focus.
        </Typography>
      </Section>
    </>
  );
}
