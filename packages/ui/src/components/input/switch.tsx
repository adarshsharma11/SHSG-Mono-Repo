'use client';
import { forwardRef } from 'react';
import type { CheckableProps } from '../../types/input.types';
import { Input } from './input';
export const Switch = forwardRef<HTMLInputElement, CheckableProps>(function Switch(props, ref) {
  return <Input {...props} ref={ref} type="checkbox" role="switch" />;
});
