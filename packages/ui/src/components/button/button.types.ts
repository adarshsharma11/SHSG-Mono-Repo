import type { ReactNode } from 'react';

export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'link', 'danger', 'success', 'warning', 'soft'] as const;

export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'icon-sm', 'icon', 'icon-lg'] as const;

export const BUTTON_SHAPES = ['rounded', 'pill', 'square'] as const;

export const BUTTON_LOADING_POSITIONS = ['start', 'replace'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];
export type ButtonLoadingPosition = (typeof BUTTON_LOADING_POSITIONS)[number];

type ButtonOwnProps = {
  /** Visual treatment. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Controls height, padding, type size, icon size, and default radius. */
  size?: ButtonSize;
  /** Corner treatment. `rounded` uses the size's radius. */
  shape?: ButtonShape;
  /** Icon rendered before the label. Ignored when an icon-only button already has children. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label. Ignored when an icon-only button already has children. */
  rightIcon?: ReactNode;
  /** Shows a busy state, disables the button, and sets `aria-busy`. */
  loading?: boolean;
  /** Replaces the visible label while `loading` is true. */
  loadingText?: string;
  /** Where the spinner sits while loading. Defaults to `start`. */
  loadingPosition?: ButtonLoadingPosition;
  /** Replaces the built-in spinner. Decorative; the label carries the loading message. */
  loadingIndicator?: ReactNode;
  /** Stretches the button to the width of its container. */
  fullWidth?: boolean;
  /**
   * Lays the button out as an icon button. Pair with `aria-label` or
   * `aria-labelledby` when the children do not include visible text.
   */
  iconOnly?: boolean;
};

export type ButtonProps = React.ComponentProps<'button'> & ButtonOwnProps;
