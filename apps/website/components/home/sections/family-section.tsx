import Image from 'next/image';
import { Typography } from '@shsg/ui';
import { divisions } from '../../../content/divisions';

export function FamilySection() {
  return (
    <section className="bg-[#f8f7f3]" id="our-family" aria-labelledby="family-heading">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mb-12 max-w-xl">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-(--site-muted) uppercase">One family. Different strengths.</p>
          <Typography as="h2" variant="h2" tone="inherit" id="family-heading">
            The right starting point.
            <br />
            <span>For your kind of project.</span>
          </Typography>
          <p className="mt-5 text-base leading-7 text-(--site-muted)">Two distinct brands. One place to find your next step.</p>
        </div>
        <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          {divisions.map((division, index) => (
            <article className="group" key={division.id}>
              <figure className="relative aspect-[4/3] overflow-hidden">
                <Image src={index === 0 ? '/images/shsg-home-interior.jpg' : '/images/shsg-kitchen.jpg'} alt={index === 0 ? 'A comfortable, naturally lit home interior' : 'An open-plan home connecting indoor and outdoor spaces'} fill className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]" sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc((100vw - 84px) / 2), (max-width: 1336px) calc((100vw - 141px) / 2), 598px" />
              </figure>
              <p className="mt-2 text-[10px] text-(--site-muted)">Illustrative interior · Project inspiration</p>
              <div className="pt-7">
                <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-(--site-muted) uppercase">{division.name}</p>
                <h3 className="text-2xl font-medium tracking-tight text-(--site-primary)">{division.label}</h3>
                <p className="mt-4 max-w-lg text-sm leading-7 text-(--site-muted)">{division.description}</p>
                <a href={division.href} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-(--site-primary) underline underline-offset-8">
                  {division.linkLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
