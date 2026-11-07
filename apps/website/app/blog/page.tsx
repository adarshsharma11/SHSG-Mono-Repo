import type { Metadata } from 'next';
import { BlogCatalog } from '@/components/blog/blog-catalog';
import { BlogCard } from '@/components/blog/blog-card';
import { articles, blogCategories } from '@/components/blog/articles';

export const metadata: Metadata = {
  title: 'Home repair & improvement journal | SHSG',
  description: 'Practical guides for planning home repairs, drywall, flooring, TV mounting, plumbing visits, and seasonal maintenance from Southern Home Services Group.',
  openGraph: { title: 'The SHSG home journal', description: 'Thoughtful plans. Better spaces. Practical guides for your next home project.', type: 'website' },
};

export default function BlogPage() {
  const entries = articles.map(({ slug, title, category, description, ...rest }) => ({ slug, title, category, description, card: <BlogCard article={{ slug, title, category, description, ...rest }} /> }));
  return (
    <main className="bg-[#0d1428] text-white [--shsg-field:#17213a] [--shsg-ghost:#dce4fa] [--shsg-muted:#b8c1d4] [--shsg-primary-active:#94a9de] [--shsg-primary-foreground:#0d1428] [--shsg-primary-hover:#dce4fa] [--shsg-primary:#b3c3f0] [--shsg-ring:#b3c3f0] [--shsg-secondary-border:#34415e]">
      <header className="bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-size-[64px_64px] px-5 pt-20 pb-14 text-center sm:pt-24 sm:pb-20 lg:pt-28">
        <p className="text-xs font-semibold tracking-[0.22em] text-[#b3c3f0] uppercase">The SHSG home journal</p>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl leading-[1.08] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
          Thoughtful plans.
          <br />
          <span className="text-[#b3c3f0]">Better spaces.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-[#b8c1d4] sm:text-lg">A little know-how for the place you call home. Practical guides, project ideas, and a clearer place to start.</p>
      </header>
      <BlogCatalog entries={entries} categories={blogCategories} featured={articles[0] && <BlogCard article={articles[0]} featured />} />
    </main>
  );
}
