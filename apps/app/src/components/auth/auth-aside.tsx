import Image from 'next/image';

export function AuthAside() {
  return (
    <aside className="hidden min-w-0 flex-col justify-center overflow-hidden rounded-[28px] bg-[#111a15] px-10 py-12 lg:flex xl:px-16" aria-labelledby="auth-aside-heading">
      <div className="mx-auto w-full max-w-[520px]">
        <figure className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#9cceb1]">
          <Image src="/images/auth-home.jpg" alt="An open home interior with natural wood and views onto a terrace" fill sizes="(min-width: 1440px) 520px, (min-width: 1024px) 40vw, 1px" className="object-cover" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b2018]/90 to-transparent px-7 pt-16 pb-6 text-sm font-medium text-white">For the place you call home.</figcaption>
        </figure>
        <p className="mt-10 text-[10px] font-medium tracking-[0.18em] text-[#62dba1] uppercase">The Southern Home family</p>
        <h2 id="auth-aside-heading" className="mt-4 text-[36px] leading-[1.16] font-medium tracking-[-0.045em] text-[#f4f7f4]">
          Everyday care.
          <br />
          <span className="text-[#62dba1]">Bigger possibilities.</span>
        </h2>
        <p className="mt-5 max-w-[390px] text-sm leading-7 text-[#aabbb0]">Home repairs with Southern Home Handyman. Renovation and construction with Boxwood. One family, with different strengths.</p>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs text-[#bdcec2]">
          <span>Southern Home Handyman</span>
          <span>Boxwood</span>
        </div>
      </div>
    </aside>
  );
}
