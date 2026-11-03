'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { useFormField } from '../../hooks/useFormField';
import type { InputProps } from '../../types/input.types';
import { inputStyles } from '../../utils/inputStyles';
import { FieldShell } from './field-shell';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { label, description, error, success, size, variant, className, type = 'text', ...native } = props;
  const accessibility = useFormField(props);
  if (type === 'hidden') return <input {...native} ref={ref} type="hidden" id={accessibility.id} />;
  const checkable = type === 'checkbox' || type === 'radio';
  const isSwitch = type === 'checkbox' && native.role === 'switch';
  return (
    <FieldShell {...{ label, description, error, success }} id={accessibility.id} required={native.required} inline={checkable}>
      <input
        {...native}
        {...accessibility}
        ref={ref}
        type={type}
        data-size={size ?? 'md'}
        data-variant={variant ?? 'outline'}
        className={
          checkable
            ? cn(
                'accent-shsg-primary focus-visible:outline-shsg-ring shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                !isSwitch && (size === 'sm' ? 'size-4' : size === 'lg' ? 'size-6' : 'size-5'),
                isSwitch && 'border-shsg-secondary-border bg-shsg-secondary checked:bg-shsg-primary before:bg-shsg-field appearance-none rounded-full border before:block before:translate-x-0.5 before:rounded-full before:transition-transform motion-reduce:before:transition-none',
                isSwitch &&
                  {
                    sm: 'h-4 w-7 before:size-2.5 checked:before:translate-x-3.5',
                    md: 'h-5 w-9 before:size-3.5 checked:before:translate-x-4.5',
                    lg: 'h-6 w-11 before:size-4.5 checked:before:translate-x-5.5',
                  }[size ?? 'md'],
                error && 'outline-shsg-danger outline',
                className,
              )
            : inputStyles(props, cn(type === 'range' && 'px-0', type === 'color' && 'min-w-16 p-1', className))
        }
      />
    </FieldShell>
  );
});
