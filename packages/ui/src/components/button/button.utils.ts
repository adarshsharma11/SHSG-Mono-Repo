import { isValidElement, type ReactNode } from 'react';
import type { ButtonSize } from './button.types';

const ICON_SIZES = new Set<ButtonSize>(['icon-sm', 'icon', 'icon-lg']);

export function isIconSize(size: ButtonSize): boolean {
  return ICON_SIZES.has(size);
}

/** Maps a labeled size to the matching square icon size when `iconOnly` is set. */
export function resolveButtonSize(size: ButtonSize, iconOnly: boolean): ButtonSize {
  if (!iconOnly || isIconSize(size)) {
    return size;
  }

  if (size === 'xs' || size === 'sm') {
    return 'icon-sm';
  }

  if (size === 'lg' || size === 'xl') {
    return 'icon-lg';
  }

  return 'icon';
}

export function hasTextContent(node: ReactNode): boolean {
  if (node == null || typeof node === 'boolean') {
    return false;
  }

  if (typeof node === 'string') {
    return node.trim().length > 0;
  }

  if (typeof node === 'number') {
    return true;
  }

  if (Array.isArray(node)) {
    return node.some((child) => hasTextContent(child));
  }

  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return hasTextContent(props.children);
  }

  return false;
}

export function hasRenderableChild(node: ReactNode): boolean {
  if (node == null || typeof node === 'boolean') {
    return false;
  }

  if (typeof node === 'string') {
    return node.trim().length > 0;
  }

  if (Array.isArray(node)) {
    return node.some((child) => hasRenderableChild(child));
  }

  return true;
}

export function warnIfMissingAccessibleName(input: { hasText: boolean; label: string | undefined; labelledBy: string | undefined }): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const hasName = input.hasText || Boolean(input.label?.trim()) || Boolean(input.labelledBy?.trim());

  if (hasName) {
    return;
  }

  console.warn('[@shsg/ui] Button is missing an accessible name. Use visible text, aria-label, or aria-labelledby. The title attribute is not an accessible name.');
}
