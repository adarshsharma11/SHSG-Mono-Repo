'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Typography } from '@shsg/ui';

const stories = [
  { id: 'refresh', label: 'Refresh', title: 'Love your space again.', text: 'The wall that needs attention. The furniture worth keeping. A few considered repairs can change the way a room feels.', image: '/images/shsg-home-interior.jpg', alt: 'Sunlit living room with restored-style wooden furniture and a gallery wall', services: 'Drywall · Carpentry · Furniture restoration' },
  { id: 'rethink', label: 'Rethink', title: 'Make everyday work better.', text: 'Better lighting. Thoughtful storage. A screen in the right place. Start with how you use the room, and build the details around it.', image: '/images/shsg-home-interior.jpg', alt: 'A living room arranged for comfortable everyday use', services: 'Electrical · TV mounting · Wall installations' },
  { id: 'reimagine', label: 'Reimagine', title: 'See a bigger possibility.', text: 'A different layout. A new surface. A space with room for the way you live now. Explore the drawings and details before making a plan.', image: '/images/shsg-kitchen.jpg', alt: 'Open-plan interior with architectural wood detailing and a connection to an outdoor terrace', services: 'Remodel drawings · Architectural walls · Flooring' },
];

export function ProjectStories() {
  const [selected, setSelected] = useState(stories[0]);
  return (
    <section aria-labelledby="inspiration-heading" className="bg-[#f1eee7] px-5 py-20 sm:px-10 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1224px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-(--site-muted) uppercase">A little inspiration</p>
            <Typography as="h2" variant="h2" id="inspiration-heading">
              A home that feels more like you.
            </Typography>
          </div>
          <div role="group" aria-label="Project inspiration" className="flex gap-6">
            {stories.map((story) => (
              <button key={story.id} type="button" aria-pressed={selected.id === story.id} onClick={() => setSelected(story)} className="min-h-11 cursor-pointer border-b-2 border-transparent text-sm text-(--site-muted) transition-colors hover:text-(--site-primary) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--shsg-ring) aria-pressed:border-(--site-primary) aria-pressed:text-(--site-primary)">
                {story.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-20">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden">
              {stories.map((story) => (
                <Image key={story.id} src={story.image} alt={selected.id === story.id ? story.alt : ''} aria-hidden={selected.id !== story.id} fill sizes="(max-width: 1024px) 100vw, 60vw" className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${selected.id === story.id ? 'opacity-100' : 'opacity-0'}`} />
              ))}
            </div>
            <figcaption className="mt-3 text-[11px] text-(--site-muted)">Project inspiration · Illustrative photography</figcaption>
          </figure>
          <div aria-live="polite">
            <p className="mb-6 text-xs tracking-[0.12em] text-(--site-muted) uppercase">{selected.label} / Southern Home</p>
            <Typography as="h3" variant="h2">
              {selected.title}
            </Typography>
            <p className="mt-6 text-base leading-8 text-(--site-muted)">{selected.text}</p>
            <p className="mt-6 border-t border-(--site-border) pt-5 text-xs leading-6 text-(--site-muted)">{selected.services}</p>
            <a href="#services" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-(--site-primary) underline underline-offset-8">
              Find your project’s starting point
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
