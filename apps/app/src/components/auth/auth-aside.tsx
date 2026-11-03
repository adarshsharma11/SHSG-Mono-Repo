import Image from 'next/image';

export function AuthAside() {
  return (
    <aside className="bg-app-primary-active hidden min-w-0 flex-col justify-center overflow-hidden rounded-[28px] px-10 py-12 lg:flex xl:px-16" aria-labelledby="auth-aside-heading">
      <div className="mx-auto w-full max-w-[520px]">
        <figure className="bg-app-accent relative aspect-[4/3] overflow-hidden rounded-[22px]">
          <Image src="/images/auth-home.jpg" alt="An open home interior with natural wood and views onto a terrace" fill sizes="(min-width: 1440px) 520px, (min-width: 1024px) 40vw, 1px" className="object-cover" />
          <figcaption className="from-app-primary-active/90 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent px-7 pt-16 pb-6 text-sm font-medium text-white">For the place you call home.</figcaption>
        </figure>
        <p className="text-app-accent mt-10 text-[10px] font-medium tracking-[0.18em] uppercase">The Southern Home family</p>
        <h2 id="auth-aside-heading" className="text-app-on-brand mt-4 text-[36px] leading-[1.16] font-medium tracking-[-0.045em]">
          Everyday care.
          <br />
          <span className="text-app-accent">Bigger possibilities.</span>
        </h2>
        <p className="text-app-on-brand-muted mt-5 max-w-[390px] text-sm leading-7">Home repairs with Southern Home Handyman. Renovation and construction with Boxwood. One family, with different strengths.</p>
        <div className="text-app-on-brand-muted mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs">
          <span>Southern Home Handyman</span>
          <span>Boxwood</span>
        </div>
      </div>
    </aside>
  );
}
