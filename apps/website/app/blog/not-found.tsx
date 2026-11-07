import Link from 'next/link';

export default function ArticleNotFound() {
  return (
    <main className="bg-[#0d1428] px-5 py-24 text-center text-white">
      <p className="mb-4 text-xs tracking-widest text-[#b3c3f0] uppercase">Home journal</p>
      <h1 className="text-3xl font-semibold sm:text-5xl">We couldn’t find that article.</h1>
      <p className="mx-auto mt-5 max-w-md leading-7 text-[#b8c1d4]">Explore our guides for a little inspiration for your next home project.</p>
      <Link href="/blog" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#b3c3f0] px-5 py-3 font-semibold text-[#0d1428] hover:bg-[#dce4fa]">
        Back to the journal
      </Link>
    </main>
  );
}
