import { Typography } from '@shsg/ui';
import { projectTypes } from '../home-content';

const descriptions: Record<string, string> = {
  repair: 'The sticking door. The loose handle. The little things that shouldn’t stay on your list forever.',
  improvement: 'A more useful space, a better finish, or the small upgrade that makes daily life easier.',
  renovation: 'A fresh start for a room you’ve outgrown. Begin the conversation about what could work better.',
  construction: 'More room for the way you live. Talk through your bigger ideas with the Boxwood team.',
};

export function ServicesSection() {
  return (
    <section className="home-container home-section" id="services" aria-labelledby="services-heading">
      <div className="home-section-intro">
        <p className="home-eyebrow">What’s on your list?</p>
        <Typography as="h2" variant="h2" tone="inherit" id="services-heading" className="home-heading">
          A little help.
          <br />A whole lot of possibility.
        </Typography>
        <p>Start with the project you have in mind. We’ll help you find which part of our family to talk to.</p>
      </div>
      <div className="home-service-grid">
        {projectTypes.map((project, index) => (
          <article className="home-service" key={project.value}>
            <span className="home-service-number" aria-hidden="true">
              0{index + 1}
            </span>
            <h3>{project.label}</h3>
            <p>{descriptions[project.value]}</p>
            <a href="#plan-project" className="home-text-link">
              {project.division === 'handyman' ? 'Start with Southern Home Handyman' : 'Start with Boxwood'}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
