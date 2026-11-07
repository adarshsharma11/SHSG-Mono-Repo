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
    <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-10 lg:px-12 lg:py-24" id="how-it-works" aria-labelledby="process-heading">
      <div className="mb-12 max-w-lg">
        <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-(--site-muted) uppercase">A clearer starting point</p>
        <Typography as="h2" variant="h2" tone="inherit" id="process-heading">
          From “someday”
          <br />
          to a starting point.
        </Typography>
      </div>
      <ol className="grid gap-10 md:grid-cols-3 md:gap-14">
        {steps.map(({ title, description }, index) => (
          <li key={title}>
            <span className="text-xs font-semibold tracking-[0.15em] text-[#9a684d]">0{index + 1}</span>
            <h3 className="mt-5 text-xl font-medium tracking-tight text-(--site-primary)">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-(--site-muted)">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
