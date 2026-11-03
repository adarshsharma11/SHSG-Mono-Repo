'use client';

import Link from 'next/link';
import { AuthError } from '../../lib/auth/auth-client';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@shsg/ui';
import { loginSchema, signupSchema, type AuthMode, type AuthValues } from './auth-schema';

interface AuthFormProps {
  mode: AuthMode;
  /** Supply the real authentication operation once the backend supports it. */
  onSubmit?: (values: AuthValues) => Promise<void>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const signup = mode === 'signup';
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: yupResolver(signup ? signupSchema : loginSchema),
    defaultValues: { fullName: '', phone: '', email: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const submit = handleSubmit(async (values) => {
    clearErrors('root');
    try {
      if (!onSubmit) {
        setError('root.server', {
          message: `${signup ? 'Registration' : 'Sign-in'} is not available yet. No credentials were sent.`,
        });
        return;
      }
      await onSubmit(values);
    } catch (error) {
      setError('root.server', {
        message: error instanceof AuthError ? error.message : signup ? 'We couldn’t create your account. Please try again.' : 'We couldn’t sign you in. Please try again.',
      });
    } finally {
      resetField('password');
    }
  });

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-app-on-brand text-[32px] leading-tight font-semibold tracking-[-0.045em] sm:text-[38px]">{signup ? 'Make yourself at home.' : 'Welcome back.'}</h1>
      <p className="text-app-on-brand-muted mt-4 text-sm leading-7">
        {signup ? 'Already have an account? ' : 'New to Southern Home? '}
        <Link href={signup ? '/login' : '/signup'} className="text-app-accent focus-visible:outline-app-accent inline-block font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4">
          {signup ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
      <form className="mt-9 space-y-6" onSubmit={submit} noValidate aria-label={signup ? 'Create an account' : 'Sign in'} aria-busy={isSubmitting}>
        {signup && <Controller name="fullName" control={control} render={({ field, fieldState }) => <Input {...field} label="Full name" autoComplete="name" placeholder="Your full name" required size="lg" disabled={isSubmitting} error={fieldState.error?.message} className="min-h-[52px] rounded-xl" />} />}
        {signup && <Controller name="phone" control={control} render={({ field, fieldState }) => <Input {...field} label="Phone number" type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 123 4567" required size="lg" disabled={isSubmitting} error={fieldState.error?.message} className="min-h-[52px] rounded-xl" />} />}
        <Controller name="email" control={control} render={({ field, fieldState }) => <Input {...field} label="Email address" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" required size="lg" disabled={isSubmitting} error={fieldState.error?.message} className="min-h-[52px] rounded-xl" />} />
        <Controller name="password" control={control} render={({ field, fieldState }) => <Input {...field} label="Password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? 'Create your password' : 'Enter your password'} required size="lg" disabled={isSubmitting} description={signup ? 'Use 8–128 characters. A longer passphrase works well.' : undefined} error={fieldState.error?.message} className="min-h-[52px] rounded-xl" />} />
        {errors.root?.server?.message && (
          <p role="alert" className="rounded-xl border border-[#e4b46b]/30 bg-[#e4b46b]/10 px-4 py-3 text-sm leading-6 text-[#f4cf96]">
            {errors.root.server.message}
          </p>
        )}
        <Button type="submit" size="lg" shape="pill" fullWidth loading={isSubmitting} loadingText={signup ? 'Creating account…' : 'Signing in…'} className="min-h-[52px] text-base font-semibold">
          {signup ? 'Create account' : 'Sign in'}
        </Button>
      </form>
      <p className="text-app-on-brand-muted mt-7 text-center text-xs leading-6">
        Southern Home Handyman <span aria-hidden="true">·</span> Boxwood
        <br />
        Part of Southern Home Services Group.
      </p>
    </div>
  );
}
