'use client';

import { useState, type ReactNode } from 'react';
import { Button, Input, Tabs } from '@shsg/ui';

interface BlogEntry {
  slug: string;
  title: string;
  category: string;
  description: string;
  card: ReactNode;
}
interface BlogCatalogProps {
  entries: BlogEntry[];
  categories: readonly string[];
  featured: ReactNode;
}

export function BlogCatalog({ entries, categories, featured }: BlogCatalogProps) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(3);
  const query = search.trim().toLowerCase();
  const showFeatured = category === 'All' && !query;
  const matches = entries.filter((entry) => (category === 'All' || entry.category === category) && `${entry.title} ${entry.description} ${entry.category}`.toLowerCase().includes(query));
  const results = showFeatured ? matches.slice(1) : matches;
  const reset = () => {
    setSearch('');
    setCategory('All');
    setLimit(3);
  };
  const content = (
    <div>
      <p role="status" className="mb-8 text-sm text-[#b8c1d4]">
        {matches.length} {matches.length === 1 ? 'article' : 'articles'}
        {query ? ` matching “${search.trim()}”` : ''}
      </p>
      {showFeatured && <div className="mb-10 lg:mb-14">{featured}</div>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.slice(0, limit).map((entry) => (
          <div key={entry.slug} className="flex min-w-0 [&>article]:w-full">
            {entry.card}
          </div>
        ))}
      </div>
      {!matches.length && (
        <div className="rounded-2xl border border-white/15 p-10 text-center">
          <h2 className="text-xl font-semibold text-white">No articles found</h2>
          <p className="mt-3 mb-6 text-[#b8c1d4]">Try a different topic or explore all of our homeowner guides.</p>
          <Button onClick={reset}>Show all articles</Button>
        </div>
      )}
      {results.length > limit && (
        <div className="mt-12 text-center">
          <Button onClick={() => setLimit((current) => current + 3)} shape="pill">
            Load more articles
          </Button>
        </div>
      )}
    </div>
  );
  return (
    <section aria-labelledby="latest-articles" className="mx-auto max-w-[1320px] px-5 pb-20 sm:px-10 lg:px-12 lg:pb-28">
      <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <h2 id="latest-articles" className="text-xs font-semibold tracking-[0.2em] text-[#b8c1d4] uppercase">
          Latest articles
        </h2>
        <div className="w-full sm:max-w-sm">
          <Input
            label="Search articles"
            type="search"
            placeholder="Try flooring or repairs…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setLimit(3);
            }}
          />
        </div>
      </div>
      <Tabs
        label="Article categories"
        value={category}
        onValueChange={(next) => {
          setCategory(next);
          setLimit(3);
        }}
        variant="underline"
        animation="fade"
        keepMounted={false}
        items={categories.map((label) => ({ value: label, label, content }))}
      />
    </section>
  );
}
