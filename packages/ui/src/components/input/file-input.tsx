'use client';
import { forwardRef } from 'react';
import type { FileInputProps } from '../../types/input.types';
import { Input } from './input';
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(props, ref) {
  return <Input {...props} ref={ref} type="file" />;
});
