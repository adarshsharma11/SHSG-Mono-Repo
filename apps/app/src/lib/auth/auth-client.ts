import { ApiError } from '@shsg/api-client';
import { createApiClient } from '../../api';
import type { LoginValues, SignupValues } from '../../components/auth/auth-schema';
import { createSession, type AuthSession } from './auth-session';

const api = createApiClient({ baseUrl: '/api' });

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

function friendlyAuthError(error: unknown, mode: 'login' | 'signup'): AuthError {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return new AuthError('Email or password is incorrect.');
    }
    if (error.status === 409) {
      return new AuthError('An account with this email or phone already exists.');
    }
    if (error.status === 422) {
      return new AuthError('Check your details and try again.');
    }
    if (error.status === 502 || error.status === 504) {
      return new AuthError('The authentication service is temporarily unavailable.');
    }
  }
  return new AuthError(mode === 'signup' ? 'We couldn’t create your account. Please try again.' : 'We couldn’t sign you in. Please try again.');
}

export async function signIn(values: LoginValues): Promise<AuthSession> {
  try {
    const response = await api.auth.login({ email: values.email, password: values.password });
    if (!response.success || !response.data) {
      throw new AuthError('Email or password is incorrect.');
    }
    return createSession(response.data);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw friendlyAuthError(error, 'login');
  }
}

export async function signUp(values: SignupValues): Promise<AuthSession> {
  try {
    const response = await api.auth.signup({
      full_name: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
    if (!response.success || !response.data) {
      throw new AuthError('We couldn’t create your account. Please try again.');
    }
    return await signIn(values);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw friendlyAuthError(error, 'signup');
  }
}
