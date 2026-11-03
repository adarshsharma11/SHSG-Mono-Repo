import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Badge } from './badge';
import { BADGE_VARIANTS } from './badge.types';

describe('Badge', () => {
  it('renders a static label without adding interactive or live-region semantics', () => {
    render(<Badge>Scheduled</Badge>);
    const badge = screen.getByText('Scheduled').parentElement;
    expect(badge?.tagName).toBe('SPAN');
    expect(badge).toHaveAttribute('data-variant', 'neutral');
    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('tabindex');
  });
  it.each(BADGE_VARIANTS)('keeps a visible label for the %s status', (variant) => {
    render(<Badge variant={variant}>{variant}</Badge>);
    expect(screen.getByText(variant)).toBeVisible();
  });
  it('keeps dots and icons decorative while preserving the status text', () => {
    const { container } = render(
      <Badge
        dot
        icon={
          <svg data-testid="icon">
            <title>Decorative check</title>
          </svg>
        }
        variant="success"
      >
        Completed
      </Badge>,
    );
    expect(container.querySelector('[data-slot="badge-dot"]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Completed')).toBeVisible();
  });
  it('forwards a ref, native attributes, accessible count, and styling options', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} id="count" aria-label="12 open requests" title="Requests" appearance="outline" size="lg" shape="rounded" className="custom-badge">
        12
      </Badge>,
    );
    expect(ref.current).toBe(screen.getByLabelText('12 open requests'));
    expect(ref.current).toHaveAttribute('id', 'count');
    expect(ref.current).toHaveAttribute('data-appearance', 'outline');
    expect(ref.current).toHaveAttribute('data-size', 'lg');
    expect(ref.current).toHaveClass('rounded-md', 'custom-badge');
  });
  it('renders a zero count', () => {
    render(<Badge>{0}</Badge>);
    expect(screen.getByText('0')).toBeVisible();
  });
});
