import Link from 'next/link';

export type HomeView = 'care' | 'workshop' | 'transformations';

const views = [
  { id: 'care', href: '/', label: 'Home & care', number: '01' },
  { id: 'workshop', href: '/home/workshop', label: 'The workshop', number: '02' },
  { id: 'transformations', href: '/home/transformations', label: 'Room for possibility', number: '03' },
] as const;

export function HomeViews({ current }: { current: HomeView }) {
  return (
    <nav aria-label="Homepage designs" className="border-y border-(--site-border) bg-[#f8f7f3]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-4 sm:px-10 lg:px-12">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-(--site-muted) uppercase">Three ways to feel at home</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {views.map(({ id, href, label, number }) => (
            <Link key={id} href={href} aria-current={current === id ? 'page' : undefined} className="inline-flex min-h-10 items-center gap-2 border-b border-transparent text-xs text-(--site-muted) transition-colors hover:text-(--site-primary) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--shsg-ring) aria-[current=page]:border-(--site-primary) aria-[current=page]:font-semibold aria-[current=page]:text-(--site-primary) sm:text-sm">
              <span className="text-[10px] opacity-60">{number}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
