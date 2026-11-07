import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ArticleCard } from './index';

describe('ArticleCard', () => {
  it('supports framework-independent media and linked headings with semantic dates', () => {
    render(<ArticleCard media={<img src="/cover.webp" alt="A room plan" />} title={<a href="/blog/plan">Plan a repair</a>} category="Planning" excerpt="A useful starting point." date="2026-11-07" dateLabel="Nov 7, 2026" readingTime="3 min read" headingLevel="h3" featured />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Plan a repair');
    expect(screen.getByRole('link', { name: 'Plan a repair' })).toHaveAttribute('href', '/blog/plan');
    expect(screen.getByText('Nov 7, 2026')).toHaveAttribute('datetime', '2026-11-07');
    expect(screen.getByRole('img')).toHaveAccessibleName('A room plan');
  });
});
