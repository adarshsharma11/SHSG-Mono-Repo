import Image from 'next/image';
import { Typography } from '@shsg/ui';

export function HeroSection() {
  return (
    <section className="home-hero" aria-labelledby="hero-heading">
      <div className="home-container home-hero-content">
        <p className="home-eyebrow home-hero-enter">Southern Home Services Group</p>
        <Typography as="h1" variant="display" tone="inherit" id="hero-heading" className="home-hero-heading home-hero-enter">
          Your home.
          <br />
          <span>Our kind of care.</span>
        </Typography>
        <p className="home-hero-description home-hero-enter">Everyday repairs. Thoughtful renovations. Find the right starting point for your home with Southern Home Handyman and Boxwood.</p>
        <div className="home-hero-actions home-hero-enter">
          <a href="#plan-project" className="site-action">
            Plan your project
          </a>
          <a href="#services" className="home-secondary-action">
            Explore our services
          </a>
        </div>
      </div>
      <figure className="home-container home-hero-visual">
        <div className="home-hero-image-wrap">
          <Image src="/images/shsg-home-interior.jpg" alt="A sunlit living room with natural wood, soft seating, and green plants" fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 56px), (max-width: 1336px) calc(100vw - 96px), 1240px" preload className="home-hero-image" />
        </div>
        <figcaption>
          <span>For the place you call home.</span>
          <span>Small fixes. Bigger possibilities.</span>
        </figcaption>
      </figure>
    </section>
  );
}
