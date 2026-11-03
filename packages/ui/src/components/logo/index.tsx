import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '../../lib/cn';

export type LogoProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children'> & {
  /** Destination when the logo is selected. */
  url: string;
  /** Pass your router's Link component; defaults to a native anchor. */
  as?: ElementType;
  variant?: 'default' | 'light';
  /** Optional brand image; the SVG mark is used when omitted. */
  src?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Pass an optimized Image component when your framework provides one. */
  imageAs?: ElementType;
  /** Mark only, with the full brand name kept accessible. */
  compact?: boolean;
};

export function Logo({ url, as: LinkComponent = 'a', variant = 'default', compact = false, src, imageWidth = 40, imageHeight = 42, imageAs: ImageComponent = 'img', className, 'aria-label': label = 'Southern Home Services Group home', ...props }: LogoProps) {
  return (
    <LinkComponent {...props} href={url} aria-label={label} className={cn('inline-flex shrink-0 items-center gap-2.5 rounded-sm no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current', variant === 'light' ? 'text-white' : 'text-[#1b2951]', className)}>
      {src ? (
        <ImageComponent src={src} alt="" width={imageWidth} height={imageHeight} sizes={compact ? '48px' : '64px'} className={cn('shsg-logo__mark block shrink-0 object-contain', compact ? 'h-8 w-auto' : 'h-11 w-auto')} />
      ) : (
        <svg viewBox="0 0 40 42" fill="none" aria-hidden="true" className={cn('shsg-logo__mark h-10 w-9 shrink-0', variant === 'light' && 'text-[#b3c3f0]')}>
          <path d="M3 21 20 5l17 16M9 18v19h22V18M16 37V25h8v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 7V3h6v10" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )}
      {!compact && (
        <span className="shsg-logo__wordmark">
          <strong className="block text-[23px] leading-tight font-semibold tracking-[-0.05em]">Southern Home</strong>
          <span className="mt-1.5 block text-[8px] leading-tight font-medium tracking-[0.2em] uppercase">Services Group</span>
        </span>
      )}
    </LinkComponent>
  );
}
