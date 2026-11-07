import Image from 'next/image';
import { Typography } from '@shsg/ui';
import { Toolbench } from './toolbench';

const headline = 'text-[clamp(46px,6.5vw,94px)]! leading-[1.02]! font-medium tracking-[-0.065em] sm:text-[clamp(46px,6.5vw,94px)]!';

export function CareHero() {
  return (
    <section aria-labelledby="home-heading" className="relative isolate flex min-h-[min(720px,calc(100svh_-_var(--site-header-height)))] items-center overflow-hidden bg-(--site-primary) text-white">
      <Image src="/images/shsg-home-interior.jpg" alt="A warm living room filled with natural light, comfortable furniture, and plants" fill sizes="100vw" preload className="-z-20 object-cover object-[65%_center]" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#101b35]/90 via-[#101b35]/65 to-[#101b35]/10" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-16 sm:px-10 lg:px-12 lg:py-24">
        <p className="mb-7 text-[11px] font-semibold tracking-[0.22em] text-[#e6d7c0] uppercase">Southern Home Services Group</p>
        <Typography as="h1" variant="display" tone="inherit" animation="slide-up" id="home-heading" className={headline}>
          Small fixes.
          <br />
          <span className="text-[#e6d7c0]">Big difference.</span>
        </Typography>
        <p className="mt-7 max-w-[440px] text-base leading-8 text-white/85 sm:text-lg">For the repairs on your list and the possibilities on your mind. Let’s find the right help for your home.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <a href="#services" className="inline-flex min-h-13 items-center justify-center bg-[#ede2cf] px-7 text-sm font-semibold text-[#1b2951] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Find your service
          </a>
          <a href="#plan-project" className="inline-flex min-h-13 items-center border border-white/50 px-7 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Create a project brief
          </a>
        </div>
      </div>
      <p className="absolute right-6 bottom-5 hidden text-[10px] tracking-[0.12em] text-white/70 uppercase sm:block">Home inspiration · Illustrative interior</p>
    </section>
  );
}

export function WorkshopHero() {
  return (
    <section aria-labelledby="home-heading" className="overflow-hidden bg-[#1b2951] text-[#f2ecdf]">
      <div className="mx-auto grid min-h-[680px] max-w-[1320px] items-center gap-8 px-5 py-14 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-4 lg:px-12 lg:py-16">
        <div className="relative z-10">
          <p className="mb-7 text-[11px] font-semibold tracking-[0.22em] text-[#d5936d] uppercase">The Southern Home workshop</p>
          <Typography as="h1" variant="display" tone="inherit" animation="slide-up" id="home-heading" className={headline}>
            Good tools.
            <br />
            Better hands.
            <br />
            <span className="text-[#d5936d]">Your home.</span>
          </Typography>
          <p className="mt-7 max-w-md text-base leading-8 text-[#d3d8e4]">From a stubborn cabinet door to a room with a new purpose. Bring us the idea. We’ll help you find a starting point.</p>
          <a href="#services" className="mt-8 inline-flex min-h-13 items-center bg-[#d5936d] px-7 text-sm font-semibold text-[#172442] transition-colors hover:bg-[#e5b293] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Open the toolbox
          </a>
        </div>
        <Toolbench />
      </div>
      <div className="border-t border-white/15 px-5 py-5 text-center text-[11px] tracking-[0.2em] text-white/65 uppercase">Repair with care. Improve with purpose. Build with a plan.</div>
    </section>
  );
}

export function TransformationHero() {
  return (
    <section aria-labelledby="home-heading" className="bg-[#f1eee7]">
      <div className="mx-auto max-w-[1320px] px-5 pt-12 pb-10 sm:px-10 lg:px-12 lg:pt-16 lg:pb-14">
        <p className="mb-5 text-[11px] font-semibold tracking-[0.22em] text-(--site-muted) uppercase">Southern Home · A different perspective</p>
        <div className="grid items-end gap-7 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Typography as="h1" variant="display" animation="slide-up" id="home-heading" className={`${headline} text-(--site-primary)`}>
            Make room
            <br />
            for possibility.
          </Typography>
          <div>
            <p className="max-w-md text-base leading-8 text-(--site-muted)">Sometimes it’s a small repair. Sometimes it’s a whole new way to live in a space. Every project starts with seeing what could be.</p>
            <a href="#inspiration" className="mt-6 inline-flex min-h-11 items-center border-b border-(--site-primary) text-sm font-semibold text-(--site-primary)">
              Explore the possibilities
            </a>
          </div>
        </div>
      </div>
      <figure className="relative h-[340px] overflow-hidden sm:h-[430px] lg:h-[480px]">
        <Image src="/images/shsg-kitchen.jpg" alt="A contemporary open-plan home with warm wood detailing and a view toward an outdoor terrace" fill sizes="100vw" preload className="object-cover object-[center_60%] transition-transform duration-1000 motion-safe:hover:scale-[1.025]" />
        <figcaption className="absolute right-5 bottom-4 bg-[#1b2951]/85 px-3 py-2 text-[10px] text-white">Spaces to inspire · Illustrative photography</figcaption>
      </figure>
    </section>
  );
}
