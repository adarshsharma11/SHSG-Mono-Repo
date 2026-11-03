'use client';
import { Button } from '../button';

export function AlertDismiss({ onDismiss, label }: { onDismiss: () => void; label: string }) {
  return (
    <Button size="icon-sm" variant="ghost" aria-label={label} onClick={onDismiss} className="shrink-0 text-inherit! hover:bg-current/10! focus-visible:outline-current!">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
      </svg>
    </Button>
  );
}
