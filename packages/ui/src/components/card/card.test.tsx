import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './index';
import { Section } from '../section';

describe('Card and Section', () => {
  it('composes semantic headings, content, and footer actions with native refs', async () => {
    const ref = createRef<HTMLDivElement>();
    const action = vi.fn();
    render(
      <Card ref={ref} aria-label="Visit summary">
        <CardHeader>
          <CardTitle as="h2">Home cleaning</CardTitle>
          <CardDescription>Visit SHSG-1042</CardDescription>
        </CardHeader>
        <CardContent>9:00–11:00 AM</CardContent>
        <CardFooter>
          <button onClick={action}>Review</button>
        </CardFooter>
      </Card>,
    );
    expect(ref.current).toHaveAttribute('aria-label', 'Visit summary');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Home cleaning');
    expect(screen.getByText('9:00–11:00 AM')).toBeVisible();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Review' }));
    expect(action).toHaveBeenCalledOnce();
  });
  it('names a section from its heading and supports a nested heading level', () => {
    render(
      <Section id="visits" title="Visits" description="Upcoming visits">
        <Section title="Details" headingLevel={3} divided={false}>
          Content
        </Section>
      </Section>,
    );
    const region = screen.getByRole('region', { name: 'Visits' });
    expect(region).toHaveAttribute('aria-labelledby', 'visits-title');
    expect(screen.getByRole('heading', { name: 'Details', level: 3 })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Details' })).toBeVisible();
  });
  it('accepts explicit accessible names for rich titles and actions', () => {
    render(
      <Section title={<span>Account</span>} aria-label="Account settings" actions={<button>Save</button>}>
        Settings
      </Section>,
    );
    expect(screen.getByRole('region', { name: 'Account settings' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save' })).toBeVisible();
  });
});
