import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().trim().email('Enter a valid email address.').required('Enter your email address.'),
  password: yup.string().required('Enter your password.'),
});

export const signupSchema = loginSchema.shape({
  password: yup.string().required('Create a password.').min(12, 'Use at least 12 characters.').max(128, 'Use no more than 128 characters.'),
});

export type AuthValues = yup.InferType<typeof loginSchema>;
export type AuthMode = 'login' | 'signup';
