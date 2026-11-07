'use client';

import { useEffect, useState } from 'react';

interface ContentsItem {
  id: string;
  title: string;
}

export function TableOfContents({ items }: { items: readonly ContentsItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      if (items.some((item) => item.id === id)) {
        setActiveId(id);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    if (typeof IntersectionObserver === 'undefined') {
      return () => window.removeEventListener('hashchange', syncHash);
    }
    const headerOffset = Number.parseFloat(getComputedStyle(document.querySelector('.site-shell') ?? document.documentElement).getPropertyValue('--site-header-height')) || 84;
    const toolbarOffset = window.matchMedia?.('(max-width: 760px)').matches ? (document.querySelector<HTMLElement>('[data-terms-sidebar]')?.offsetHeight ?? 0) : 0;
    const offset = headerOffset + toolbarOffset;
    const observer = new IntersectionObserver(
      () => {
        const current = sections.filter((section) => section.getBoundingClientRect().top <= offset + 48).at(-1) ?? sections[0];
        if (current) {
          setActiveId(current.id);
        }
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0, 0.1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncHash);
    };
  }, [items]);

  return (
    <nav aria-label="Table of contents">
      <p className="m-0 mb-5 text-[11px] font-semibold tracking-[0.14em] text-(--site-muted) uppercase max-[760px]:mb-2 max-[760px]:text-[10px]">Table of contents</p>
      <ol className="m-0 list-none p-0 max-[760px]:flex max-[760px]:[scrollbar-width:thin] max-[760px]:gap-4 max-[760px]:overflow-x-auto">
        {items.map(({ id, title }) => (
          <li key={id} className="max-[760px]:shrink-0">
            <a
              className="block min-h-11 border-l-2 border-transparent py-[11px] pr-3 pl-4.5 text-sm leading-[1.55] text-(--site-muted) no-underline transition-colors duration-150 hover:text-(--site-primary) aria-[current=location]:border-l-(--site-primary) aria-[current=location]:font-semibold aria-[current=location]:text-(--site-primary) motion-reduce:transition-none max-[760px]:border-b-2 max-[760px]:border-l-0 max-[760px]:px-0.5 max-[760px]:text-[13px] max-[760px]:whitespace-nowrap max-[760px]:aria-[current=location]:border-b-(--site-primary)"
              href={`#${id}`}
              aria-current={activeId === id ? 'location' : undefined}
              onClick={() => setActiveId(id)}
            >
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
