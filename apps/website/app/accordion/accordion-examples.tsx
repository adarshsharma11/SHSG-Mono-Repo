'use client';
import { useState } from 'react';
import { Accordion, Button, Input, Section, Switch, Typography } from '@shsg/ui';
export function AccordionExamples() {
  const [multiple, setMultiple] = useState(false);
  const [value, setValue] = useState<string[]>(['included']);
  return (
    <>
      <Section title="Service information" description="Control the expanded sections, or let the component manage its own state.">
        <Switch
          label="Allow multiple sections open"
          checked={multiple}
          onChange={(event) => {
            setMultiple(event.target.checked);
            setValue([]);
          }}
        />
        <Accordion
          multiple={multiple}
          value={value}
          onValueChange={setValue}
          items={[
            {
              value: 'included',
              title: 'What is included in a home cleaning?',
              content: 'Kitchen surfaces, living areas, bedrooms, bathroom surfaces, and floors. Review the service details for your booking.',
            },
            {
              value: 'prepare',
              title: 'How should I prepare for a visit?',
              content: (
                <div className="space-y-4">
                  <p>Keep the work area accessible and share any special instructions before your visit.</p>
                  <Input label="Draft access instruction" placeholder="e.g. Use the side entrance" />
                </div>
              ),
            },
            {
              value: 'change',
              title: 'Can I change my booking?',
              content: 'Review your booking to find available rescheduling options. This demo does not change real bookings.',
            },
            {
              value: 'unavailable',
              title: 'Premium service details (unavailable)',
              disabled: true,
              content: 'Unavailable',
            },
          ]}
        />
        <Typography variant="small" tone="muted">
          Open sections: {value.join(', ') || 'none'}. Drafts remain intact when a section is collapsed.
        </Typography>
        <Button size="sm" variant="outline" onClick={() => setValue([])}>
          Collapse all
        </Button>
      </Section>
      <Section title="Independent sections" description="Multiple sections can stay open together.">
        <Accordion
          multiple
          defaultValue={['visit']}
          items={[
            {
              value: 'visit',
              title: 'Before the visit',
              content: 'Check your booking details and property access instructions.',
            },
            {
              value: 'during',
              title: 'During the visit',
              content: 'Your professional will review the work and answer questions before starting.',
            },
            {
              value: 'after',
              title: 'After the visit',
              content: 'Review the completed work and find your receipt in your account.',
            },
          ]}
        />
      </Section>
    </>
  );
}
