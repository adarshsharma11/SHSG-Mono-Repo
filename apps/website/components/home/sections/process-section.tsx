import { Typography } from '@shsg/ui';

const steps = [
  {
    title: 'Tell your home’s story.',
    description: 'A quick repair or a bigger idea? Put together a few details about what you have in mind.',
  },
  {
    title: 'Find your starting point.',
    description: 'We’ll point you toward Southern Home Handyman or Boxwood based on the kind of project.',
  },
  {
    title: 'Make a plan together.',
    description: 'Contact the team to discuss your location, scope, and timing before any work is agreed.',
  },
];

export function ProcessSection() {
  return (
    <section className="home-container home-section" id="how-it-works" aria-labelledby="process-heading">
      <div className="home-process-heading">
        <p className="home-eyebrow">A clearer starting point</p>
        <Typography as="h2" variant="h2" tone="inherit" id="process-heading" className="home-heading">
          From “someday”
          <br />
          to a starting point.
        </Typography>
      </div>
      <ol className="home-steps">
        {steps.map(({ title, description }, index) => (
          <li key={title}>
            <span className="home-step-number">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
