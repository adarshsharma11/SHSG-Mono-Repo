'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@shsg/ui';
import { Brand } from './brand';
import { AppLink } from './app-link';
import { navigation } from './navigation';
import { NavigationIcon } from './navigation-icon';

export function SiteHeader({ appUrl }: { appUrl: string }) {
  const signupUrl = new URL('/signup', appUrl).toString();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const groupButtons = useRef(new Map<string, HTMLButtonElement>());
  const id = useId();

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setActiveGroup(null);
        setMobileOpen(false);
      }
    };
    const breakpoint = window.matchMedia?.('(max-width: 900px)');
    const resetMenus = () => {
      setActiveGroup(null);
      setMobileOpen(false);
    };
    breakpoint?.addEventListener('change', resetMenus);
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      breakpoint?.removeEventListener('change', resetMenus);
    };
  }, []);

  function closeNavigation() {
    setMobileOpen(false);
    setActiveGroup(null);
  }

  return (
    <header
      ref={header}
      className="site-header"
      onKeyDown={(event) => {
        if (event.key !== 'Escape') {
          return;
        }
        if (activeGroup) {
          groupButtons.current.get(activeGroup)?.focus();
        } else if (mobileOpen) {
          toggle.current?.focus();
        }
        closeNavigation();
      }}
    >
      <div className="site-container site-header-inner">
        <Brand light />
        <nav className="site-desktop-nav" aria-label="Main navigation">
          {navigation.map((item) =>
            'children' in item ? (
              <div
                key={item.label}
                className="site-nav-group"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setActiveGroup(null);
                  }
                }}
              >
                <button
                  type="button"
                  ref={(node) => {
                    if (node) {
                      groupButtons.current.set(item.label, node);
                    } else {
                      groupButtons.current.delete(item.label);
                    }
                  }}
                  aria-expanded={activeGroup === item.label}
                  aria-controls={`${id}-${item.label.replaceAll(' ', '-')}`}
                  onClick={() => setActiveGroup(activeGroup === item.label ? null : item.label)}
                >
                  {item.label}
                  <svg className="site-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div id={`${id}-${item.label.replaceAll(' ', '-')}`} className="site-dropdown" data-open={activeGroup === item.label} aria-hidden={activeGroup !== item.label} inert={activeGroup !== item.label}>
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href} onClick={closeNavigation} tabIndex={activeGroup === item.label ? undefined : -1}>
                      <NavigationIcon name={child.icon} />
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} onClick={closeNavigation}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="site-header-actions">
          <AppLink href={appUrl} className="site-login" />
          <a href={signupUrl} target="_blank" rel="noopener noreferrer" className="site-action site-header-cta" onClick={closeNavigation}>
            Sign up<span className="sr-only"> (opens the SHSG app in a new tab)</span>
          </a>
          <Button
            ref={toggle}
            variant="ghost"
            className="site-menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls={`${id}-mobile-navigation`}
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setActiveGroup(null);
            }}
          >
            {mobileOpen ? 'Close' : 'Menu'}
            <span className="site-menu-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </Button>
        </div>
      </div>
      <nav id={`${id}-mobile-navigation`} className="site-mobile-nav" aria-label="Mobile navigation" data-open={mobileOpen} aria-hidden={!mobileOpen} inert={!mobileOpen}>
        <div className="site-mobile-inner">
          <div className="site-mobile-links">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} onClick={closeNavigation} tabIndex={mobileOpen ? undefined : -1}>
                {item.label}
              </Link>
            ))}
            <a href={signupUrl} target="_blank" rel="noopener noreferrer" onClick={closeNavigation} tabIndex={mobileOpen ? undefined : -1}>
              Sign up<span className="sr-only"> (opens the SHSG app in a new tab)</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
