import * as yup from 'yup';

export interface AuthValues {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export type LoginValues = Pick<AuthValues, 'email' | 'password'>;
export type SignupValues = AuthValues;

export const loginSchema: yup.ObjectSchema<AuthValues> = yup.object({
  fullName: yup.string().defined(),
  phone: yup.string().defined(),
  email: yup.string().trim().email('Enter a valid email address.').required('Enter your email address.'),
  password: yup.string().required('Enter your password.'),
});

export const signupSchema = loginSchema.shape({
  fullName: yup
    .string()
    .transform((value: string) => value.trim().replace(/\s+/g, ' '))
    .required('Enter your full name.')
    .min(2, 'Use at least 2 characters.')
    .max(120, 'Use no more than 120 characters.'),
  phone: yup
    .string()
    .transform((value: string) => value.replace(/[\s().-]/g, ''))
    .required('Enter your phone number.')
    .matches(/^\+?[1-9]\d{6,14}$/, 'Use 7–15 digits with an optional leading +.'),
  password: yup.string().required('Create a password.').min(8, 'Use at least 8 characters.').max(128, 'Use no more than 128 characters.'),
});

export type AuthMode = 'login' | 'signup';
