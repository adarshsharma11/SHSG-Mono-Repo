import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard } from '@shsg/ui';
import { formatArticleDate, getReadingTime, type BlogArticle } from './articles';

export function BlogCard({ article, featured = false }: { article: BlogArticle; featured?: boolean }) {
  return (
    <ArticleCard
      featured={featured}
      title={<Link href={`/blog/${article.slug}`}>{article.title}</Link>}
      category={article.category}
      excerpt={article.description}
      date={article.published}
      dateLabel={formatArticleDate(article.published)}
      readingTime={getReadingTime(article)}
      media={<Image src={article.image} alt={article.imageAlt} fill sizes={featured ? '(max-width: 767px) 100vw, 50vw' : '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw'} className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.025]" />}
    />
  );
}
