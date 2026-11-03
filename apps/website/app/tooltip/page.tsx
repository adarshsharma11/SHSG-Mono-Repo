import type { Metadata } from 'next';
import { Button, Section, Tooltip, Typography } from '@shsg/ui';
import { ComponentShowcase } from '../_components/component-showcase';
export const metadata: Metadata = {
  title: 'Tooltips | SHSG',
  description: 'Explanations for icon controls on hover and keyboard focus.',
};
export default function TooltipPage() {
  return (
    <ComponentShowcase title="Tooltips" description="Short explanations for familiar controls. Hover or focus a trigger to see its description.">
      <Section title="Icon controls" description="Tooltips supplement an accessible button label; they do not replace it.">
        <div className="flex flex-wrap gap-6">
          <Tooltip content="Adjust your service notification preferences.">
            <Button variant="outline" size="icon" aria-label="Notification settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 3v18M4 7h16M4 17h16" />
                <circle cx="12" cy="7" r="3" />
                <circle cx="12" cy="17" r="3" />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip content="Find receipts in the billing section.">
            <Button variant="outline" aria-label="About receipts">
              Receipt help
            </Button>
          </Tooltip>
        </div>
      </Section>
      <Section title="Preferred placement" description="The preferred side flips when there is not enough room.">
        <div className="flex flex-wrap justify-center gap-6 py-12">
          {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
            <Tooltip key={side} side={side} content={`This tooltip prefers the ${side} side.`}>
              <Button variant="secondary">{side}</Button>
            </Tooltip>
          ))}
        </div>
        <Typography variant="small" tone="muted">
          Focus reveals descriptions immediately. Hover uses a short delay; you can move onto the tooltip without losing it. Escape dismisses it. Keep essential instructions visible and use a menu or dialog for interactive content.
        </Typography>
      </Section>
    </ComponentShowcase>
  );
}
