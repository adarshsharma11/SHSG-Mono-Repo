'use client';
import { forwardRef } from 'react';
import { useFormField } from '../../hooks/useFormField';
import type { TextareaProps } from '../../types/input.types';
import { inputStyles } from '../../utils/inputStyles';
import { FieldShell } from './field-shell';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(props, ref) {
  const { label, description, error, success, size, variant, className, ...native } = props;
  const accessibility = useFormField(props);
  return (
    <FieldShell {...{ label, description, error, success }} id={accessibility.id} required={native.required}>
      <textarea rows={4} {...native} {...accessibility} ref={ref} data-size={size ?? 'md'} data-variant={variant ?? 'outline'} className={inputStyles(props, className)} />
    </FieldShell>
  );
});
