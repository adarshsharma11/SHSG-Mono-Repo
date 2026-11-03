import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outline' | 'filled' | 'underline';
export interface FieldProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  success?: string;
  size?: InputSize;
  variant?: InputVariant;
}
export type InputProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;
export type TextareaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;
export type SelectProps = FieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
    visibleOptions?: number;
  };
export type CheckableProps = Omit<InputProps, 'type'>;
export type FileInputProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'>;
