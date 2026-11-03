'use client';
import { forwardRef } from 'react';
import { useFormField } from '../../hooks/useFormField';
import type { SelectProps } from '../../types/input.types';
import { inputStyles } from '../../utils/inputStyles';
import { FieldShell } from './field-shell';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(props, ref) {
  const { label, description, error, success, size, variant, visibleOptions, className, children, ...native } = props;
  const accessibility = useFormField(props);
  return (
    <FieldShell {...{ label, description, error, success }} id={accessibility.id} required={native.required}>
      <select {...native} {...accessibility} ref={ref} size={visibleOptions} data-size={size ?? 'md'} data-variant={variant ?? 'outline'} className={inputStyles(props, className)}>
        {children}
      </select>
    </FieldShell>
  );
});
