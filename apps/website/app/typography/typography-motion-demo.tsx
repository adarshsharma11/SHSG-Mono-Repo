'use client';
import { useState } from 'react';
import { Button, Typography, TYPOGRAPHY_ANIMATIONS } from '@shsg/ui';

export function TypographyMotionDemo() {
  const [replay, setReplay] = useState(0);
  return (
    <section aria-labelledby="text-motion-title" className="border-shsg-secondary-border space-y-6 border-t pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Typography as="h2" variant="h3" id="text-motion-title">
          Text animations
        </Typography>
        <Button variant="outline" size="sm" onClick={() => setReplay((value) => value + 1)}>
          Replay animations
        </Button>
      </div>
      <Typography tone="muted">Fade, rise, or gently sharpen text as it appears. Reduced-motion preferences disable every effect.</Typography>
      <div className="space-y-6">
        {TYPOGRAPHY_ANIMATIONS.map((animation) => (
          <div key={animation} className="grid gap-3 sm:grid-cols-[8rem_1fr]">
            <Typography variant="caption" tone="muted" className="font-mono">
              {animation}
            </Typography>
            <Typography key={`${animation}-${replay}`} variant="h4" as="p" animation={animation}>
              A welcome worth coming home to.
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}
