import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { ButtonLoadingPosition, ButtonProps } from './button.types';
import { hasRenderableChild, hasTextContent, isIconSize, resolveButtonSize, warnIfMissingAccessibleName } from './button.utils';
import { buttonClassName, buttonGapClass } from './button.variants';

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="animate-spin motion-reduce:animate-none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function IconSlot({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0" aria-hidden="true">
      {children}
    </span>
  );
}

function LoadingMark({ indicator }: { indicator?: ReactNode }) {
  return (
    <span className="inline-flex shrink-0" data-slot="loading-indicator" aria-hidden="true">
      {indicator ?? <Spinner />}
    </span>
  );
}

function LoadingFace({ children, loadingIndicator, loadingPosition, loadingText }: { children: ReactNode; loadingIndicator?: ReactNode; loadingPosition: ButtonLoadingPosition; loadingText?: string }) {
  const mark = <LoadingMark indicator={loadingIndicator} />;

  if (loadingPosition === 'replace' && !loadingText) {
    return mark;
  }

  return (
    <>
      {mark}
      {loadingText ?? children}
    </>
  );
}

function ButtonBody({ children, gapClass, leftIcon, loading, loadingIndicator, loadingPosition, loadingText, rightIcon, showSideIcons }: { children: ReactNode; gapClass: string; leftIcon?: ReactNode; loading: boolean; loadingIndicator?: ReactNode; loadingPosition: ButtonLoadingPosition; loadingText?: string; rightIcon?: ReactNode; showSideIcons: boolean }) {
  const label = (
    <>
      {showSideIcons && leftIcon ? <IconSlot>{leftIcon}</IconSlot> : null}
      {children}
      {showSideIcons && rightIcon ? <IconSlot>{rightIcon}</IconSlot> : null}
    </>
  );

  if (!loading) {
    return <span className={cn('inline-flex items-center justify-center', gapClass)}>{label}</span>;
  }

  const showVisibleLabel = loadingPosition === 'start' || Boolean(loadingText);

  return (
    <span className="inline-grid justify-items-center">
      {/*
        The first row reserves the original width. `invisible` drops that copy
        from the accessibility tree; `opacity-0` keeps it available when the
        spinner replaces the label and would otherwise leave the button unnamed.
      */}
      <span className={cn('col-start-1 row-start-1 inline-flex items-center justify-center', gapClass, showVisibleLabel ? 'invisible' : 'opacity-0')} aria-hidden={showVisibleLabel ? true : undefined}>
        {label}
      </span>
      <span className={cn('col-start-1 row-start-1 inline-flex items-center justify-center', gapClass)} aria-hidden={showVisibleLabel ? undefined : true}>
        <LoadingFace loadingIndicator={loadingIndicator} loadingPosition={loadingPosition} loadingText={loadingText}>
          {children}
        </LoadingFace>
      </span>
    </span>
  );
}

export function Button({ ref, variant = 'primary', size = 'md', shape = 'rounded', leftIcon, rightIcon, loading = false, loadingText, loadingPosition = 'start', loadingIndicator, fullWidth = false, iconOnly = false, className, style, type = 'button', disabled = false, children, ...rest }: ButtonProps) {
  const resolvedSize = resolveButtonSize(size, iconOnly);
  const isDisabled = Boolean(disabled || loading);
  const showSideIcons = !(isIconSize(resolvedSize) && hasRenderableChild(children));

  warnIfMissingAccessibleName({
    hasText: hasTextContent(children) || hasTextContent(loading && loadingText ? loadingText : null),
    label: typeof rest['aria-label'] === 'string' ? rest['aria-label'] : undefined,
    labelledBy: typeof rest['aria-labelledby'] === 'string' ? rest['aria-labelledby'] : undefined,
  });

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      style={style}
      className={buttonClassName({
        variant,
        size: resolvedSize,
        shape,
        fullWidth,
        className,
      })}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      data-variant={variant}
      data-size={resolvedSize}
      data-shape={shape}
      data-loading={loading ? 'true' : undefined}
      data-icon-only={isIconSize(resolvedSize) ? 'true' : undefined}
    >
      <ButtonBody gapClass={buttonGapClass(resolvedSize)} leftIcon={leftIcon} rightIcon={rightIcon} loading={loading} loadingIndicator={loadingIndicator} loadingPosition={loadingPosition} loadingText={loadingText} showSideIcons={showSideIcons}>
        {children}
      </ButtonBody>
    </button>
  );
}
