import Link from 'next/link';
import { Typography } from '@shsg/ui';
import { termsDocument, termsSections } from './terms-content';
import { TableOfContents } from './table-of-contents';

export function TermsDocument() {
  return (
    <main data-terms-page className="border-x-[12px] border-(--site-primary) bg-white text-(--site-ink) max-[760px]:border-x-0 print:border-0 [&_a:focus-visible]:rounded-xs [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--shsg-ring)" aria-labelledby="terms-title">
      <div className="mx-auto w-[calc(100%_-_96px)] max-w-[1240px] max-[600px]:w-[calc(100%_-_40px)] print:w-full">
        <header className="border-b border-(--site-border) px-6 pt-20 pb-15 text-center max-[760px]:px-0 max-[760px]:pt-13 max-[760px]:pb-9">
          <Typography variant="overline" tone="muted" className="m-0 mb-5 text-[11px]! tracking-[0.18em]">
            Southern Home Services Group
          </Typography>
          <Typography as="h1" variant="display" id="terms-title" className="m-0 scroll-mt-[calc(var(--site-header-height)_+_32px)] text-[clamp(42px,5vw,68px)]! font-semibold tracking-[-0.055em] max-[760px]:scroll-mt-[calc(var(--site-header-height)_+_124px)] sm:text-[clamp(42px,5vw,68px)]!">
            {termsDocument.title}
          </Typography>
          <p className="mt-5.5 text-[15px] leading-[1.7] text-(--site-muted) max-[760px]:text-[13px]">
            {termsDocument.status}
            <span aria-hidden="true"> · </span>Updated <time dateTime={termsDocument.updatedAt}>{termsDocument.updatedLabel}</time>
          </p>
          <Typography variant="body" tone="muted" className="mx-auto mt-6.5 max-w-[730px] text-lg! leading-[1.8]! max-[760px]:text-base!">
            {termsDocument.introduction}
          </Typography>
          <p className="mt-5 text-xs leading-[1.6] text-(--site-muted)">Working draft: this wording is pending review and approval.</p>
        </header>
        <div className="grid grid-cols-[270px_minmax(0,1fr)] items-start gap-18 pt-14.5 pb-25 max-[1000px]:grid-cols-[220px_minmax(0,1fr)] max-[1000px]:gap-10 max-[760px]:block max-[760px]:pt-0 max-[760px]:pb-16 print:block">
          <aside data-terms-sidebar className="sticky top-[calc(var(--site-header-height)_+_28px)] max-h-[calc(100dvh_-_var(--site-header-height)_-_56px)] [scrollbar-width:thin] overflow-y-auto max-[760px]:top-(--site-header-height) max-[760px]:z-20 max-[760px]:mb-9 max-[760px]:max-h-none max-[760px]:overflow-visible max-[760px]:border-b max-[760px]:border-(--site-border) max-[760px]:bg-white max-[760px]:pt-4.5 max-[760px]:pb-3 print:hidden">
            <TableOfContents items={termsSections.map(({ id, title }) => ({ id, title }))} />
          </aside>
          <article className="min-w-0 text-lg leading-[1.9] [overflow-wrap:anywhere] text-(--site-ink) max-[760px]:text-base max-[760px]:leading-[1.85] [&_p+p]:mt-6" aria-label="SHSG draft website terms">
            {termsSections.map(({ id, title, paragraphs, items }) => (
              <section key={id} id={id} aria-labelledby={`${id}-title`} className="not-first:mt-14 not-first:border-t not-first:border-(--site-border) not-first:pt-9 max-[760px]:scroll-mt-[calc(var(--site-header-height)_+_124px)]! max-[760px]:not-first:mt-9 max-[760px]:not-first:pt-7">
                <Typography as="h2" variant="h2" id={`${id}-title`} className="m-0 mb-7 text-[clamp(28px,3vw,36px)]! font-semibold tracking-[-0.04em] max-[760px]:mb-5 sm:text-[clamp(28px,3vw,36px)]! print:break-after-avoid">
                  {title}
                </Typography>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {items && (
                  <ul className="mt-5 list-disc pl-6 [&>li+li]:mt-3">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {id === 'contact' && (
                  <Link className="mt-5 inline-flex min-h-11 items-center gap-3 text-[15px] font-semibold text-(--site-primary) underline underline-offset-5" href="/#our-family">
                    Find the right Southern Home team
                  </Link>
                )}
              </section>
            ))}
            <a className="mt-14 inline-flex min-h-11 items-center gap-3 text-[15px] font-semibold text-(--site-primary) underline underline-offset-5 print:hidden" href="#terms-title">
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </article>
        </div>
      </div>
    </main>
  );
}
