'use client';
import { forwardRef } from 'react';
import type { CheckableProps } from '../../types/input.types';
import { Input } from './input';
export const Checkbox = forwardRef<HTMLInputElement, CheckableProps>(function Checkbox(props, ref) {
  return <Input {...props} ref={ref} type="checkbox" />;
});
