import type { ComponentPropsWithRef, ReactNode } from 'react';
import { FEEDBACK_APPEARANCES, FEEDBACK_VARIANTS } from '../../lib/feedbackStyles';

export const ALERT_VARIANTS = FEEDBACK_VARIANTS;
export const ALERT_APPEARANCES = FEEDBACK_APPEARANCES;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];
export type AlertAppearance = (typeof ALERT_APPEARANCES)[number];
export type AlertProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  title?: ReactNode;
  variant?: AlertVariant;
  appearance?: AlertAppearance;
  /** Omit for the built-in status icon; false hides the icon. */
  icon?: ReactNode | false;
  actions?: ReactNode;
  /** Parent controls removal; providing this handler shows the dismiss button. */
  onDismiss?: () => void;
  dismissLabel?: string;
};
