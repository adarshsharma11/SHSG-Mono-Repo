import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import BlogPage from '../../app/blog/page';
import { articles, getArticle, getReadingTime } from './articles';

describe('home journal', () => {
  it('renders a featured guide and reveals the remaining linked articles', async () => {
    render(<BlogPage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('article')).toHaveLength(4);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Load more articles' }));
    expect(screen.getAllByRole('article')).toHaveLength(articles.length);
    expect(screen.queryByRole('button', { name: 'Load more articles' })).not.toBeInTheDocument();
    for (const article of articles) {
      expect(screen.getByRole('link', { name: article.title })).toHaveAttribute('href', `/blog/${article.slug}`);
    }
  });

  it('combines search and category filters and can recover from an empty result', async () => {
    const user = userEvent.setup();
    render(<BlogPage />);
    await user.click(screen.getByRole('tab', { name: 'Maintenance' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await user.type(screen.getByRole('searchbox', { name: 'Search articles' }), 'flooring');
    expect(screen.getByRole('heading', { name: 'No articles found' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Show all articles' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    await user.type(screen.getByRole('searchbox'), 'flooring');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /new flooring/i })).toBeVisible();
  });

  it('supports keyboard category navigation', async () => {
    const user = userEvent.setup();
    render(<BlogPage />);
    screen.getByRole('tab', { name: 'All' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Planning' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Planning' })).toBeVisible();
  });

  it('keeps unique slugs and derives reading time from complete article content', () => {
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(articles.length);
    expect(getArticle('missing-article')).toBeUndefined();
    for (const article of articles) {
      expect(getArticle(article.slug)).toBe(article);
      expect(article.sections.length).toBeGreaterThanOrEqual(4);
      expect(getReadingTime(article)).toMatch(/^[1-9]\d* min read$/);
    }
  });
});
