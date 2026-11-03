import { cn } from '../../lib/cn';
import { feedbackStyles } from '../../lib/feedbackStyles';
import { AlertDismiss } from './alert-dismiss';
import type { AlertProps, AlertVariant } from './alert.types';

function StatusIcon({ variant }: { variant: AlertVariant }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {variant === 'warning' ? (
        <>
          <path d="M10.3 4.9 2.6 18.2A2 2 0 0 0 4.3 21h15.4a2 2 0 0 0 1.7-2.8L13.7 4.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4m0 4h.01" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          {variant === 'success' ? <path d="m8 12 3 3 5-6" /> : variant === 'danger' ? <path d="m9 9 6 6m0-6-6 6" /> : <path d="M12 11v5m0-9h.01" />}
        </>
      )}
    </svg>
  );
}

export function Alert({ title, children, variant = 'info', appearance = 'soft', icon, actions, onDismiss, dismissLabel = 'Dismiss alert', role = variant === 'danger' ? 'alert' : 'status', className, ...native }: AlertProps) {
  return (
    <div {...native} role={role} data-variant={variant} data-appearance={appearance} className={cn('flex min-w-0 items-start gap-3 rounded-xl border p-4 text-sm leading-6 sm:p-5', feedbackStyles(variant, appearance), className)}>
      {icon !== false && (
        <span aria-hidden="true" data-slot="alert-icon" className="mt-0.5 inline-flex size-5 shrink-0 [&_svg]:size-5">
          {icon ?? <StatusIcon variant={variant} />}
        </span>
      )}
      <div className="min-w-0 flex-1 space-y-1 break-words">
        {title != null && <p className="font-semibold">{title}</p>}
        {children != null && <div>{children}</div>}
        {actions && <div className="flex flex-wrap items-center gap-3 pt-3">{actions}</div>}
      </div>
      {onDismiss && <AlertDismiss onDismiss={onDismiss} label={dismissLabel} />}
    </div>
  );
}
