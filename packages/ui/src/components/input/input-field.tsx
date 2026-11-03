'use client';
import type { FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import type { InputProps } from '../../types/input.types';
import { Input } from './input';

export type InputFieldProps<T extends FieldValues, TName extends FieldPath<T> = FieldPath<T>> = Omit<InputProps, 'form' | 'name' | 'error' | 'onChange' | 'onBlur'> & {
  name: TName;
  form: Pick<UseFormReturn<T>, 'register' | 'getFieldState' | 'formState'>;
  rules?: RegisterOptions<T, TName>;
};

export function InputField<T extends FieldValues, TName extends FieldPath<T>>({ name, form, rules, ...props }: InputFieldProps<T, TName>) {
  const { error } = form.getFieldState(name, form.formState);
  return <Input {...props} {...form.register(name, rules)} error={error?.message} />;
}
