'use client';

import Link from 'next/link';
import { MockAuthError, DEMO_CREDENTIALS } from '../../lib/auth/mock-auth';
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: yupResolver(signup ? signupSchema : loginSchema),
    defaultValues: { email: '', password: '' },
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
        message: error instanceof MockAuthError ? error.message : signup ? 'We couldn’t create your account. Please try again.' : 'We couldn’t sign you in. Please try again.',
      });
    } finally {
      resetField('password');
    }
  });

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.045em] text-[#f4f7f4] sm:text-[38px]">{signup ? 'Make yourself at home.' : 'Welcome back.'}</h1>
      <p className="mt-4 text-sm leading-7 text-[#aeb8b1]">
        {signup ? 'Already have an account? ' : 'New to Southern Home? '}
        <Link href={signup ? '/login' : '/signup'} className="inline-block font-medium text-[#62dba1] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#62dba1]">
          {signup ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
      <div className="mt-6 rounded-xl border border-[#62dba1]/20 bg-[#62dba1]/5 px-4 py-3 text-xs leading-6 text-[#c3d6c9]">
        Demo workspace. Use sample details, not a real password.
        {!signup && (
          <button
            type="button"
            className="mt-1 block cursor-pointer font-medium text-[#62dba1] underline underline-offset-4"
            onClick={() => {
              setValue('email', DEMO_CREDENTIALS.email);
              setValue('password', DEMO_CREDENTIALS.password);
              clearErrors();
            }}
          >
            Use demo account
          </button>
        )}
      </div>
      <form className="mt-9 space-y-6" onSubmit={submit} noValidate aria-label={signup ? 'Create an account' : 'Sign in'} aria-busy={isSubmitting}>
        <Controller name="email" control={control} render={({ field, fieldState }) => <Input {...field} label="Email address" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" required size="lg" disabled={isSubmitting} error={fieldState.error?.message} className="min-h-[52px] rounded-xl" />} />
        <Controller name="password" control={control} render={({ field, fieldState }) => <Input {...field} label="Password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? 'Create your password' : 'Enter your password'} required size="lg" disabled={isSubmitting} description={signup ? 'Use 12–128 characters. A longer passphrase works well.' : undefined} error={fieldState.error?.message} className="min-h-[52px] rounded-xl" />} />
        {errors.root?.server?.message && (
          <p role="alert" className="rounded-xl border border-[#e4b46b]/30 bg-[#e4b46b]/10 px-4 py-3 text-sm leading-6 text-[#f4cf96]">
            {errors.root.server.message}
          </p>
        )}
        <Button type="submit" size="lg" shape="pill" fullWidth loading={isSubmitting} loadingText={signup ? 'Creating account…' : 'Signing in…'} className="min-h-[52px] text-base font-semibold">
          {signup ? 'Create account' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-7 text-center text-xs leading-6 text-[#aeb8b1]">
        Southern Home Handyman <span aria-hidden="true">·</span> Boxwood
        <br />
        Part of Southern Home Services Group.
      </p>
    </div>
  );
}
