'use client';
import { forwardRef } from 'react';
import type { CheckableProps } from '../../types/input.types';
import { Input } from './input';
export const Radio = forwardRef<HTMLInputElement, CheckableProps>(function Radio(props, ref) {
  return <Input {...props} ref={ref} type="radio" />;
});
