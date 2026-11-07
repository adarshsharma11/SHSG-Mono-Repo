import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, formatArticleDate, getArticle, getReadingTime } from '@/components/blog/articles';
import { BlogCard } from '@/components/blog/blog-card';

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) {
    return {};
  }
  return { title: `${article.title} | SHSG`, description: article.description, openGraph: { title: article.title, description: article.description, type: 'article', publishedTime: article.published, authors: ['Southern Home Services Group'] } };
}
export default async function ArticlePage({ params }: PageProps) {
  const article = getArticle((await params).slug);
  if (!article) {
    notFound();
  }
  const related = articles
    .filter((item) => item.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3);
  const structuredData = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title, description: article.description, datePublished: article.published, dateModified: article.published, author: { '@type': 'Organization', name: 'Southern Home Services Group' }, publisher: { '@type': 'Organization', name: 'Southern Home Services Group' }, inLanguage: 'en', articleSection: article.category };
  return (
    <main className="bg-[#0d1428] text-white">
      {/* Static editorial data; escape HTML before placing JSON-LD in the document. */}
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-10 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-[#b8c1d4]">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span aria-hidden="true" className="px-3">
            /
          </span>
          <Link href="/blog" className="hover:text-white">
            Home journal
          </Link>
        </nav>
        <header>
          <p className="mb-5 text-xs font-semibold tracking-[0.15em] text-[#b3c3f0] uppercase">{article.category}</p>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-6 text-lg leading-8 text-[#b8c1d4]">{article.description}</p>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#b8c1d4]">
            <span>By the SHSG editorial team</span>
            <time dateTime={article.published}>{formatArticleDate(article.published)}</time>
            <span>{getReadingTime(article)}</span>
          </div>
        </header>
        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-2xl bg-white">
          <Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 896px) 100vw, 816px" className="object-cover" />
        </div>
        <nav aria-label="In this article" className="my-10 rounded-xl border border-white/15 p-6">
          <p className="mb-4 text-xs font-semibold tracking-widest text-[#b3c3f0] uppercase">In this article</p>
          <ol className="space-y-3 text-sm text-[#dce4fa]">
            {article.sections.map((section, index) => (
              <li key={section.heading}>
                <a href={`#section-${index + 1}`} className="underline decoration-white/25 underline-offset-4 hover:decoration-white">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="space-y-12">
          {article.sections.map((section, index) => (
            <section key={section.heading} id={`section-${index + 1}`}>
              <h2 className="mb-5 text-2xl font-semibold tracking-tight sm:text-3xl">{section.heading}</h2>
              <div className="space-y-5 text-base leading-8 text-[#c1c9da]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.checklist && (
                <ul className="mt-6 list-disc space-y-3 pl-5 text-[#dce4fa] marker:text-[#b3c3f0]">
                  {section.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <aside className="mt-14 border-t border-white/15 pt-8">
          <h2 className="text-2xl font-semibold">Ready to make a start?</h2>
          <p className="mt-3 mb-5 leading-7 text-[#b8c1d4]">Organize your project notes and explore the services available through the Southern Home family.</p>
          <Link href="/#plan-project" className="inline-flex min-h-11 items-center rounded-lg bg-[#b3c3f0] px-5 py-3 font-semibold text-[#0d1428] hover:bg-[#dce4fa]">
            Plan your project
          </Link>
        </aside>
      </article>
      <section aria-labelledby="related-heading" className="mx-auto max-w-[1320px] px-5 pt-6 pb-20 sm:px-10 lg:px-12">
        <h2 id="related-heading" className="mb-8 text-2xl font-semibold">
          A little more inspiration
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <BlogCard key={item.slug} article={item} />
          ))}
        </div>
        <Link href="/blog" className="mt-8 inline-block py-3 text-[#b3c3f0] underline underline-offset-4">
          Explore all articles
        </Link>
      </section>
    </main>
  );
}
