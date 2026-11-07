import { Accordion, Typography } from '@shsg/ui';
import { questions } from '../home-content';

export function FaqSection() {
  return (
    <section className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-28" id="questions" aria-labelledby="faq-heading">
      <div>
        <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-(--site-muted) uppercase">A few things to know</p>
        <Typography as="h2" variant="h2" tone="inherit" id="faq-heading">
          Good questions.
          <br />
          Clear answers.
        </Typography>
      </div>
      <Accordion items={questions} />
    </section>
  );
}
