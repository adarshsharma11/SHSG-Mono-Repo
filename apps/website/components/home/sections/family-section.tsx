import Image from 'next/image';
import { Typography } from '@shsg/ui';
import { divisions } from '../../../content/divisions';

export function FamilySection() {
  return (
    <section className="home-family" id="our-family" aria-labelledby="family-heading">
      <div className="home-container home-section">
        <div className="home-family-heading">
          <p className="home-eyebrow">One family. Different strengths.</p>
          <Typography as="h2" variant="h2" tone="inherit" id="family-heading" className="home-heading">
            The right starting point.
            <br />
            <span>For your kind of project.</span>
          </Typography>
          <p>Two distinct brands. One place to find your next step.</p>
        </div>
        <div className="home-family-grid">
          {divisions.map((division, index) => (
            <article className="home-division" key={division.id}>
              <figure className="home-division-photo">
                <Image src={index === 0 ? '/images/shsg-home-interior.jpg' : '/images/shsg-kitchen.jpg'} alt={index === 0 ? 'A comfortable, naturally lit home interior' : 'An open-plan home connecting indoor and outdoor spaces'} fill sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc((100vw - 84px) / 2), (max-width: 1336px) calc((100vw - 141px) / 2), 598px" />
              </figure>
              <div className="home-division-copy">
                <p className="home-eyebrow">{division.name}</p>
                <h3>{division.label}</h3>
                <p>{division.description}</p>
                <a href={division.href} className="home-text-link">
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
