import type { ReactNode } from 'react';
import type { FieldProps } from '../../types/input.types';

export function FieldShell({
  id,
  label,
  description,
  error,
  success,
  required,
  inline,
  children,
}: FieldProps & {
  id: string;
  required?: boolean;
  inline?: boolean;
  children: ReactNode;
}) {
  const labelContent = (
    <>
      {label}
      {required && (
        <span aria-hidden="true" className="text-shsg-danger ml-1">
          *
        </span>
      )}
    </>
  );
  return (
    <div className="text-shsg-ghost min-w-0 space-y-1.5 text-sm">
      {inline ? (
        <div className="flex items-center gap-3">
          {children}
          {label && (
            <label htmlFor={id} className="font-medium">
              {labelContent}
            </label>
          )}
        </div>
      ) : (
        <>
          {label && (
            <label htmlFor={id} className="block font-medium">
              {labelContent}
            </label>
          )}
          {children}
        </>
      )}
      {description && (
        <p id={`${id}-description`} className="text-shsg-muted">
          {description}
        </p>
      )}
      {(error || success) && (
        <p id={`${id}-message`} role={error ? 'alert' : 'status'} className={error ? 'text-shsg-danger' : 'text-shsg-success'}>
          {error || success}
        </p>
      )}
    </div>
  );
}
