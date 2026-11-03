import type { ComponentPropsWithRef, ReactNode } from 'react';
import { FEEDBACK_APPEARANCES, FEEDBACK_VARIANTS } from '../../lib/feedbackStyles';

export const BADGE_VARIANTS = FEEDBACK_VARIANTS;
export const BADGE_APPEARANCES = FEEDBACK_APPEARANCES;
export const BADGE_SIZES = ['sm', 'md', 'lg'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeAppearance = (typeof BADGE_APPEARANCES)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];
export type BadgeProps = ComponentPropsWithRef<'span'> & {
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  shape?: 'pill' | 'rounded';
  dot?: boolean;
  /** Decorative. Keep a visible text label to communicate meaning. */
  icon?: ReactNode;
};
