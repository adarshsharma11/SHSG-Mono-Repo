import type { ComponentPropsWithRef } from 'react';
import { cn } from '../../lib/cn';

export const SKELETON_ANIMATIONS = ['pulse', 'shimmer', 'none'] as const;
export type SkeletonProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'aria-hidden'> & {
  shape?: 'text' | 'rect' | 'circle';
  animation?: (typeof SKELETON_ANIMATIONS)[number];
};
export function Skeleton({ shape = 'text', animation = 'pulse', className, ...native }: SkeletonProps) {
  return (
    <div
      {...native}
      aria-hidden="true"
      data-shape={shape}
      data-animation={animation}
      className={cn(
        'shsg-skeleton bg-shsg-secondary relative overflow-hidden',
        {
          text: 'h-4 w-full rounded',
          rect: 'h-24 w-full rounded-xl',
          circle: 'size-10 shrink-0 rounded-full',
        }[shape],
        animation === 'pulse' && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
    />
  );
}
