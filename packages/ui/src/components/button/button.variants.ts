import { cn } from '../../lib/cn';
import type { ButtonShape, ButtonSize, ButtonVariant } from './button.types';

const BASE_CLASS = [
  'box-border inline-flex shrink-0 select-none items-center justify-center',
  'whitespace-nowrap border-solid font-medium leading-none',
  'cursor-pointer transition-[color,background-color,border-color,box-shadow,transform]',
  'duration-150 ease-out motion-reduce:transition-none',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shsg-ring',
  'enabled:active:translate-y-px motion-reduce:enabled:active:translate-y-0',
  'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
].join(' ');

const VARIANT_CLASS = {
  primary: ['border border-shsg-primary bg-shsg-primary text-shsg-primary-foreground shadow-sm', 'enabled:hover:border-shsg-primary-hover enabled:hover:bg-shsg-primary-hover', 'enabled:active:border-shsg-primary-active enabled:active:bg-shsg-primary-active'].join(' '),
  secondary: ['border border-shsg-secondary-border bg-shsg-secondary text-shsg-secondary-foreground shadow-none', 'enabled:hover:border-shsg-secondary-border enabled:hover:bg-shsg-secondary-hover', 'enabled:active:bg-shsg-secondary-active'].join(' '),
  outline: ['border border-shsg-outline-border bg-transparent text-shsg-outline shadow-none', 'enabled:hover:bg-shsg-outline-hover', 'enabled:active:bg-shsg-outline-active'].join(' '),
  ghost: ['border border-transparent bg-transparent text-shsg-ghost shadow-none', 'enabled:hover:bg-shsg-ghost-hover', 'enabled:active:bg-shsg-ghost-active'].join(' '),
  link: ['border border-transparent bg-transparent text-shsg-link underline underline-offset-4 shadow-none', 'enabled:hover:text-shsg-link-hover'].join(' '),
  danger: ['border-2 border-shsg-danger-border bg-shsg-danger text-shsg-danger-foreground shadow-sm', 'enabled:hover:border-shsg-danger-hover enabled:hover:bg-shsg-danger-hover', 'enabled:active:border-shsg-danger-active enabled:active:bg-shsg-danger-active'].join(' '),
  success: ['border-2 border-shsg-success-border bg-shsg-success text-shsg-success-foreground shadow-sm', 'enabled:hover:border-shsg-success-hover enabled:hover:bg-shsg-success-hover', 'enabled:active:border-shsg-success-active enabled:active:bg-shsg-success-active'].join(' '),
  warning: ['border-2 border-shsg-warning-border bg-shsg-warning text-shsg-warning-foreground shadow-none', 'enabled:hover:bg-shsg-warning-hover', 'enabled:active:bg-shsg-warning-active'].join(' '),
  soft: ['border border-transparent bg-shsg-soft text-shsg-soft-foreground shadow-none', 'enabled:hover:bg-shsg-soft-hover', 'enabled:active:bg-shsg-soft-active'].join(' '),
} satisfies Record<ButtonVariant, string>;

const SIZE_CLASS = {
  xs: 'h-7 px-2.5 text-xs [&_svg]:size-3',
  sm: 'h-8 px-3 text-sm [&_svg]:size-3.5',
  md: 'h-10 px-4 text-sm [&_svg]:size-4',
  lg: 'h-11 px-5 text-base [&_svg]:size-5',
  xl: 'h-12 px-6 text-base [&_svg]:size-5',
  'icon-sm': 'size-8 p-0 text-sm [&_svg]:size-3.5',
  icon: 'size-10 p-0 text-sm [&_svg]:size-4',
  'icon-lg': 'size-12 p-0 text-base [&_svg]:size-5',
} satisfies Record<ButtonSize, string>;

const GAP_CLASS = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2',
  xl: 'gap-2.5',
  'icon-sm': 'gap-0',
  icon: 'gap-0',
  'icon-lg': 'gap-0',
} satisfies Record<ButtonSize, string>;

const RADIUS_CLASS = {
  xs: 'rounded-md',
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  'icon-sm': 'rounded-md',
  icon: 'rounded-lg',
  'icon-lg': 'rounded-xl',
} satisfies Record<ButtonSize, string>;

const SHAPE_CLASS = {
  rounded: '',
  pill: 'rounded-full',
  square: 'rounded-none',
} satisfies Record<ButtonShape, string>;

export function buttonGapClass(size: ButtonSize): string {
  return GAP_CLASS[size];
}

export function buttonClassName(options: { variant: ButtonVariant; size: ButtonSize; shape: ButtonShape; fullWidth: boolean; className?: string }): string {
  const radius = options.shape === 'rounded' ? RADIUS_CLASS[options.size] : SHAPE_CLASS[options.shape];

  return cn(BASE_CLASS, VARIANT_CLASS[options.variant], SIZE_CLASS[options.size], radius, options.fullWidth && 'w-full', options.className);
}
