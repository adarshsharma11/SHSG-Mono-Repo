import type { RegisterOptions } from 'react-hook-form';

export interface DemoValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  age: number;
  website: string;
  birthDate: string;
  country: string;
  terms: boolean;
  search: string;
  visitTime: string;
  appointment: string;
  month: string;
  week: string;
  color: string;
  budget: number;
  services: string[];
  contact: string;
  updates: boolean;
  notes: string;
  attachment: FileList;
  photos: FileList;
  source: string;
  reference: string;
}

export function validateWebsite(value: string) {
  if (!value) {
    return true;
  }
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol) || 'Use an HTTP or HTTPS URL';
  } catch {
    return 'Enter a valid website URL';
  }
}

export function validateFiles(files: FileList | undefined, allowed: readonly string[], maximum = 2 * 1024 * 1024) {
  for (const file of Array.from(files ?? [])) {
    if (!allowed.includes(file.type)) {
      return 'Choose a PDF, PNG, or JPEG of the allowed type';
    }
    if (file.size > maximum) {
      return 'Each file must be 2 MB or smaller';
    }
  }
  return true;
}

export function demoRules(today: string) {
  return {
    fullName: {
      required: 'Full name is required',
      validate: (value) => value.trim().split(/\s+/).length >= 2 || 'Enter your first and last name',
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Enter a valid email address',
      },
    },
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^\+?[\d\s()-]{7,20}$/,
        message: 'Enter a valid phone number (7–20 characters)',
      },
    },
    password: {
      required: 'Password is required',
      minLength: { value: 8, message: 'Use at least 8 characters' },
      deps: ['confirmPassword'],
    },
    confirmPassword: {
      required: 'Confirm your password',
      validate: (value, values) => value === values.password || 'Passwords must match',
    },
    age: {
      valueAsNumber: true,
      required: 'Age is required',
      min: { value: 18, message: 'You must be at least 18' },
      max: { value: 120, message: 'Enter an age of 120 or less' },
    },
    website: { validate: validateWebsite },
    birthDate: {
      required: 'Date of birth is required',
      min: { value: '1900-01-01', message: 'Choose a date from 1900 onward' },
      max: { value: today, message: 'Date of birth cannot be in the future' },
    },
    country: { required: 'Choose a country' },
    terms: { required: 'Accept the terms to continue' },
    attachment: {
      validate: (files) => validateFiles(files, ['application/pdf']),
    },
    photos: {
      validate: (files) => validateFiles(files, ['image/png', 'image/jpeg']),
    },
  } satisfies Partial<{
    [K in keyof DemoValues]: RegisterOptions<DemoValues, K>;
  }>;
}

export function submissionPreview(values: DemoValues) {
  // Explicit allowlist: passwords and file contents never enter preview state.
  return {
    fullName: values.fullName,
    email: values.email,
    phone: values.phone,
    age: values.age,
    website: values.website,
    birthDate: values.birthDate,
    country: values.country,
    terms: values.terms,
    search: values.search,
    visitTime: values.visitTime,
    appointment: values.appointment,
    month: values.month,
    week: values.week,
    color: values.color,
    budget: values.budget,
    services: values.services,
    contact: values.contact,
    updates: values.updates,
    notes: values.notes,
    attachmentCount: values.attachment?.length ?? 0,
    photoCount: values.photos?.length ?? 0,
    source: values.source,
    reference: values.reference,
  };
}
