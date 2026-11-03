export const FEEDBACK_VARIANTS = ['neutral', 'primary', 'info', 'success', 'warning', 'danger'] as const;
export const FEEDBACK_APPEARANCES = ['soft', 'solid', 'outline'] as const;
export type FeedbackVariant = (typeof FEEDBACK_VARIANTS)[number];
export type FeedbackAppearance = (typeof FEEDBACK_APPEARANCES)[number];

// Badge and Alert share status colors, including their dark-theme token values.
const styles: Record<FeedbackVariant, Record<FeedbackAppearance, string>> = {
  neutral: {
    soft: 'border-shsg-secondary-border bg-shsg-secondary text-shsg-secondary-foreground',
    solid: 'border-shsg-ghost bg-shsg-ghost text-shsg-field',
    outline: 'border-shsg-secondary-border bg-transparent text-shsg-ghost',
  },
  primary: {
    soft: 'border-shsg-primary/25 bg-shsg-primary/10 text-shsg-primary',
    solid: 'border-shsg-primary bg-shsg-primary text-shsg-primary-foreground',
    outline: 'border-shsg-primary bg-transparent text-shsg-primary',
  },
  info: {
    soft: 'border-shsg-outline-border/25 bg-shsg-soft text-shsg-soft-foreground',
    solid: 'border-shsg-soft-foreground bg-shsg-soft-foreground text-shsg-soft',
    outline: 'border-shsg-outline-border bg-transparent text-shsg-outline',
  },
  success: {
    soft: 'border-shsg-success/25 bg-shsg-success/10 text-shsg-success',
    solid: 'border-shsg-success bg-shsg-success text-shsg-success-foreground',
    outline: 'border-shsg-success bg-transparent text-shsg-success',
  },
  warning: {
    soft: 'border-shsg-warning-border/35 bg-shsg-warning/15 text-shsg-warning-border',
    solid: 'border-shsg-warning-border bg-shsg-warning text-shsg-warning-foreground',
    outline: 'border-shsg-warning-border bg-transparent text-shsg-warning-border',
  },
  danger: {
    soft: 'border-shsg-danger/25 bg-shsg-danger/10 text-shsg-danger',
    solid: 'border-shsg-danger bg-shsg-danger text-shsg-danger-foreground',
    outline: 'border-shsg-danger bg-transparent text-shsg-danger',
  },
};

export function feedbackStyles(variant: FeedbackVariant, appearance: FeedbackAppearance) {
  return styles[variant][appearance];
}
