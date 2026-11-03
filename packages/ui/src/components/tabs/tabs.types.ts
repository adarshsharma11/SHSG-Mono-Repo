import type { ComponentPropsWithRef, ReactNode } from 'react';

export const TABS_ANIMATIONS = ['fade', 'slide-up', 'slide-left', 'scale', 'blur', 'none'] as const;
export const TABS_VARIANTS = ['underline', 'pills', 'enclosed'] as const;
export type TabsAnimation = (typeof TABS_ANIMATIONS)[number];
export type TabsVariant = (typeof TABS_VARIANTS)[number];
export interface TabItem {
  /** Unique and stable within this Tabs instance. */
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
export type TabsProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'defaultValue' | 'onChange'> & {
  items: readonly TabItem[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  animation?: TabsAnimation;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  /** Preserves form/local state in inactive panels. Defaults to true. */
  keepMounted?: boolean;
};
