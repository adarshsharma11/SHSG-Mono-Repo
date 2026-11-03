import type { ComponentPropsWithoutRef, ReactNode, RefObject } from 'react';

export const MODAL_ANIMATIONS = ['fade', 'scale', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'blur', 'none'] as const;
export const MODAL_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;
export type ModalAnimation = (typeof MODAL_ANIMATIONS)[number];
export type ModalSize = (typeof MODAL_SIZES)[number];

export type ModalProps = Omit<ComponentPropsWithoutRef<'dialog'>, 'open' | 'title' | 'onCancel' | 'onClose' | 'className' | 'aria-label' | 'aria-labelledby'> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Required visible title also supplies the dialog's accessible name. */
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  animation?: ModalAnimation;
  speed?: 'fast' | 'normal' | 'slow';
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Applied to the visible panel. */
  className?: string;
  /** Applied to the full-screen dialog container. */
  overlayClassName?: string;
};
