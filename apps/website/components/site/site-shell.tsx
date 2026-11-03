import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export function SiteShell({ children, appUrl, showDeveloperLinks = false }: { children: ReactNode; appUrl: string; showDeveloperLinks?: boolean }) {
  return (
    <div className="site-shell">
      <a href="#site-content" className="site-skip-link">
        Skip to content
      </a>
      <SiteHeader appUrl={appUrl} />
      <div id="site-content" tabIndex={-1} className="site-content">
        {children}
      </div>
      <SiteFooter appUrl={appUrl} showDeveloperLinks={showDeveloperLinks} />
    </div>
  );
}
