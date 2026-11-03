'use client';
import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

export type PopupSide = 'top' | 'bottom' | 'left' | 'right';
export function useAnchoredPopup(open: boolean, anchor: RefObject<HTMLElement | null>, popup: RefObject<HTMLElement | null>, side: PopupSide = 'bottom', align: 'start' | 'end' = 'start') {
  const [position, setPosition] = useState<CSSProperties>({
    position: 'fixed',
    left: 0,
    top: 0,
  });
  useLayoutEffect(() => {
    if (!open || !anchor.current || !popup.current) return;
    const update = () => {
      if (!anchor.current || !popup.current) return;
      const a = anchor.current.getBoundingClientRect();
      const p = popup.current.getBoundingClientRect();
      const gap = 8;
      const width = window.innerWidth;
      const height = window.innerHeight;
      let actual = side;
      if (side === 'bottom' && a.bottom + gap + p.height > height && a.top > height - a.bottom) actual = 'top';
      if (side === 'top' && a.top - gap - p.height < 0 && height - a.bottom > a.top) actual = 'bottom';
      if (side === 'right' && a.right + gap + p.width > width) actual = 'left';
      if (side === 'left' && a.left - gap - p.width < 0) actual = 'right';
      let left = align === 'end' ? a.right - p.width : a.left;
      let top = actual === 'top' ? a.top - gap - p.height : a.bottom + gap;
      if (actual === 'left' || actual === 'right') {
        left = actual === 'left' ? a.left - gap - p.width : a.right + gap;
        top = a.top + (a.height - p.height) / 2;
      }
      setPosition({
        position: 'fixed',
        left: Math.max(gap, Math.min(left, width - p.width - gap)),
        top: Math.max(gap, Math.min(top, height - p.height - gap)),
      });
    };
    update();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(anchor.current);
    observer?.observe(popup.current);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchor, popup, side, align]);
  return position;
}
