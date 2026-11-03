import type { Metadata } from 'next';
import { ComponentShowcase } from '../_components/component-showcase';
import { AccordionExamples } from './accordion-examples';
export const metadata: Metadata = {
  title: 'Accordion | SHSG',
  description: 'Expandable FAQs and service details.',
};
export default function AccordionPage() {
  return (
    <ComponentShowcase title="Accordion" description="Expandable answers and service details, with smooth height changes and clear keyboard controls.">
      <AccordionExamples />
    </ComponentShowcase>
  );
}
