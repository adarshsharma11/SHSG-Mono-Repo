'use client';

import { useId } from 'react';
import type { FieldProps } from '../types/input.types';

export function useFormField(
  props: FieldProps & {
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  },
) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  return {
    id,
    'aria-invalid': props.error ? true : props['aria-invalid'],
    'aria-describedby': [props['aria-describedby'], props.description && `${id}-description`, (props.error || props.success) && `${id}-message`].filter(Boolean).join(' ') || undefined,
  };
}
