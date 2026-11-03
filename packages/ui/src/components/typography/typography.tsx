import { createElement, type ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';

export const TYPOGRAPHY_VARIANTS = ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'lead', 'body', 'small', 'caption', 'overline', 'code', 'quote'] as const;
export const TYPOGRAPHY_ANIMATIONS = ['none', 'fade', 'slide-up', 'blur-in'] as const;
export type TypographyVariant = (typeof TYPOGRAPHY_VARIANTS)[number];
export type TypographyAnimation = (typeof TYPOGRAPHY_ANIMATIONS)[number];
export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'small' | 'blockquote' | 'code';
export type TypographyTone = 'default' | 'muted' | 'primary' | 'success' | 'danger' | 'inherit';

type OwnProps<E extends TypographyElement> = {
  as?: E;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  animation?: TypographyAnimation;
};
export type TypographyProps<E extends TypographyElement = 'p'> = OwnProps<E> & Omit<ComponentPropsWithRef<E>, keyof OwnProps<E>>;

const defaultElement: Record<TypographyVariant, TypographyElement> = {
  display: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  lead: 'p',
  body: 'p',
  small: 'p',
  caption: 'p',
  overline: 'p',
  code: 'code',
  quote: 'blockquote',
};
const variantClasses: Record<TypographyVariant, string> = {
  display: 'text-5xl font-semibold leading-[1.08] tracking-tight sm:text-7xl',
  h1: 'text-4xl font-semibold leading-tight tracking-tight sm:text-5xl',
  h2: 'text-3xl font-semibold leading-tight tracking-tight sm:text-4xl',
  h3: 'text-2xl font-semibold leading-snug tracking-tight sm:text-3xl',
  h4: 'text-xl font-semibold leading-snug tracking-tight sm:text-2xl',
  h5: 'text-lg font-semibold leading-snug',
  h6: 'text-base font-semibold leading-snug',
  lead: 'text-lg leading-8 sm:text-xl',
  body: 'text-base leading-7',
  small: 'text-sm leading-6',
  caption: 'text-xs leading-5',
  overline: 'text-xs font-medium leading-5 tracking-widest uppercase',
  code: 'rounded bg-shsg-field-muted px-1.5 py-0.5 font-mono text-sm leading-6',
  quote: 'border-l-2 border-shsg-primary pl-5 text-xl leading-8 italic',
};
const toneClasses: Record<TypographyTone, string> = {
  default: 'text-shsg-ghost',
  muted: 'text-shsg-muted',
  primary: 'text-shsg-primary',
  success: 'text-shsg-success',
  danger: 'text-shsg-danger',
  inherit: 'text-inherit',
};

export function Typography<E extends TypographyElement = 'p'>({ as, variant = 'body', tone = 'default', weight, align, truncate = false, animation = 'none', className, children, ...native }: TypographyProps<E>) {
  return createElement(
    as ?? defaultElement[variant],
    {
      ...native,
      'data-variant': variant,
      'data-animation': animation,
      className: cn(
        variantClasses[variant],
        toneClasses[tone],
        weight &&
          {
            normal: 'font-normal!',
            medium: 'font-medium!',
            semibold: 'font-semibold!',
            bold: 'font-bold!',
          }[weight],
        align && { left: 'text-left', center: 'text-center', right: 'text-right' }[align],
        truncate && 'truncate',
        animation !== 'none' && 'shsg-type-motion',
        className,
      ),
    },
    children,
  );
}
