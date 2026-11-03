import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ComponentPropsWithoutRef } from 'react';
import { Logo } from './index';

describe('Logo', () => {
  it('links the full accessible brand to the supplied destination', () => {
    render(<Logo url="/dashboard" />);
    expect(screen.getByRole('link', { name: 'Southern Home Services Group home' }).getAttribute('href')).toBe('/dashboard');
    expect(screen.getByText('Southern Home')).toBeTruthy();
    expect(screen.getByText('Services Group')).toBeTruthy();
  });
  it('keeps a usable accessible name in compact mode and forwards link attributes', () => {
    render(<Logo url="https://example.com" compact aria-label="Open SHSG app" target="_blank" rel="noopener noreferrer" />);
    const link = screen.getByRole('link', { name: 'Open SHSG app' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.queryByText('Southern Home')).toBeNull();
    expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
  it('uses the supplied artwork with explicit dimensions and no duplicate image label', () => {
    render(<Logo url="/" src="/images/brand/logo.webp" imageWidth={486} imageHeight={374} />);
    const link = screen.getByRole('link', { name: 'Southern Home Services Group home' });
    const image = link.querySelector('img');
    expect(image?.getAttribute('src')).toBe('/images/brand/logo.webp');
    expect(image?.getAttribute('width')).toBe('486');
    expect(image?.getAttribute('height')).toBe('374');
    expect(image?.getAttribute('alt')).toBe('');
    expect(link.querySelector('svg')).toBeNull();
  });
  it('supports a router link component without depending on Next.js', () => {
    function RouterLink(props: ComponentPropsWithoutRef<'a'>) {
      return <a {...props} data-router-link="true" />;
    }
    render(<Logo as={RouterLink} url="/login" variant="light" />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('data-router-link')).toBe('true');
    expect(link.getAttribute('href')).toBe('/login');
  });
});
