import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Typography } from './typography';

describe('Typography', () => {
  it('uses paragraph semantics by default and heading semantics for heading variants', () => {
    const { container } = render(
      <>
        <Typography>Body text</Typography>
        <Typography variant="h2">Service details</Typography>
      </>,
    );
    expect(container.querySelector('p')).toHaveTextContent('Body text');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Service details');
  });

  it('keeps visual hierarchy independent from the semantic tag and forwards refs', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Typography as="h3" variant="display" ref={ref}>
        Book a visit
      </Typography>,
    );
    expect(ref.current).toBe(screen.getByRole('heading', { level: 3 }));
    expect(ref.current).toHaveAttribute('data-variant', 'display');
  });

  it('forwards element-specific attributes and supports accessible inline text', () => {
    render(
      <>
        <Typography as="label" htmlFor="name">
          Your name
        </Typography>
        <input id="name" />
        <Typography as="span" aria-label="Service ready" tone="success">
          Ready
        </Typography>
      </>,
    );
    expect(screen.getByLabelText('Your name')).toBeInTheDocument();
    expect(screen.getByLabelText('Service ready').tagName).toBe('SPAN');
  });

  it('supports explicit motion, truncation, tone, weight, and custom classes', () => {
    render(
      <Typography tone="muted" weight="bold" align="right" truncate animation="slide-up" className="custom-type" title="Full description">
        Description
      </Typography>,
    );
    expect(screen.getByText('Description')).toHaveClass('text-shsg-muted', 'font-bold!', 'text-right', 'truncate', 'shsg-type-motion', 'custom-type');
    expect(screen.getByText('Description')).toHaveAttribute('title', 'Full description');
  });
});
