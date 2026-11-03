'use client';
import { useState } from 'react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Section, Select, Switch, Tabs, TABS_ANIMATIONS, TABS_VARIANTS, Typography, type TabItem, type TabsAnimation, type TabsVariant } from '@shsg/ui';

export function TabsShowcase() {
  const [animation, setAnimation] = useState<TabsAnimation>('fade');
  const [variant, setVariant] = useState<TabsVariant>('underline');
  const [vertical, setVertical] = useState(false);
  const [manual, setManual] = useState(false);
  const [value, setValue] = useState('overview');
  const items: TabItem[] = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Home cleaning</CardTitle>
              <Badge variant="primary">Scheduled</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Typography>Visit SHSG-1042</Typography>
            <Typography tone="muted" variant="small">
              Review your service, property details, and visit preferences.
            </Typography>
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'details',
      label: 'Service details',
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Included in your visit</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li>Kitchen surfaces and appliances</li>
              <li>Living areas and bedrooms</li>
              <li>Bathroom surfaces and floors</li>
            </ul>
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'settings',
      label: 'Preferences',
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Visit preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <Input label="Property nickname" placeholder="e.g. Southern House" description="Switch tabs and return; this draft is preserved." />
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'history',
      label: 'History (unavailable)',
      disabled: true,
      content: <Typography>No history available.</Typography>,
    },
  ];
  return (
    <>
      <Section title="Animation playground" description="Change the options, then switch tabs to compare the panel entrances.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Panel animation" value={animation} onChange={(event) => setAnimation(event.target.value as TabsAnimation)}>
            {TABS_ANIMATIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select label="Tab style" value={variant} onChange={(event) => setVariant(event.target.value as TabsVariant)}>
            {TABS_VARIANTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Switch label="Vertical tabs" checked={vertical} onChange={(event) => setVertical(event.target.checked)} />
          <Switch label="Manual keyboard activation" checked={manual} onChange={(event) => setManual(event.target.checked)} />
        </div>
        <Tabs label="Visit information" items={items} value={value} onValueChange={setValue} animation={animation} variant={variant} orientation={vertical ? 'vertical' : 'horizontal'} activationMode={manual ? 'manual' : 'automatic'} />
        <Typography variant="small" tone="muted">
          Selected view: {value}. Arrow keys move between enabled tabs; Home and End jump to the first and last. In manual mode, press Enter or Space to select. Reduced motion disables panel animations.
        </Typography>
        <Button variant="outline" size="sm" onClick={() => setValue('overview')}>
          Return to overview
        </Button>
      </Section>
      <Section title="Tab styles" description="Underline, pill, and enclosed controls use the same keyboard behavior.">
        <div className="space-y-10">
          {TABS_VARIANTS.map((style) => (
            <div key={style} className="space-y-4">
              <Typography as="h3" variant="h5">
                {style}
              </Typography>
              <Tabs
                label={`${style} style example`}
                variant={style}
                animation="slide-up"
                items={[
                  {
                    value: 'account',
                    label: 'Account',
                    content: <Typography>Manage your account details.</Typography>,
                  },
                  {
                    value: 'bookings',
                    label: 'Bookings',
                    content: <Typography>Review upcoming and completed visits.</Typography>,
                  },
                  {
                    value: 'billing',
                    label: 'Billing',
                    content: <Typography>Find payment methods and receipts.</Typography>,
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
