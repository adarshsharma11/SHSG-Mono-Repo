import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Spinner } from './index';
import { Skeleton } from '../skeleton';

describe('loading primitives', () => {
  it('announces a named loading status and forwards a ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} label="Loading services" size="lg" />);
    expect(ref.current).toBe(screen.getByRole('status', { name: 'Loading services' }));
    expect(ref.current?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(ref.current).toHaveTextContent('Loading services');
  });
  it('suppresses duplicate announcements for a decorative spinner', () => {
    const { container } = render(<Spinner decorative />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
  it('keeps skeletons out of the accessibility tree and forwards sizing and shape', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} shape="circle" animation="shimmer" className="size-16!" style={{ width: 64 }} />);
    expect(ref.current).toHaveAttribute('aria-hidden', 'true');
    expect(ref.current).toHaveAttribute('data-animation', 'shimmer');
    expect(ref.current).toHaveClass('rounded-full', 'size-16!');
    expect(ref.current).toHaveStyle({ width: '64px' });
  });
});
