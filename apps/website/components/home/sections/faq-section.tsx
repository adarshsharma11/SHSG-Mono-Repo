import { Accordion, Typography } from '@shsg/ui';
import { questions } from '../home-content';

export function FaqSection() {
  return (
    <section className="home-container home-section home-faq" id="questions" aria-labelledby="faq-heading">
      <div>
        <p className="home-eyebrow">A few things to know</p>
        <Typography as="h2" variant="h2" tone="inherit" id="faq-heading" className="home-heading">
          Good questions.
          <br />
          Clear answers.
        </Typography>
      </div>
      <Accordion items={questions} />
    </section>
  );
}
