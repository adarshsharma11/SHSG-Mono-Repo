import Link from 'next/link';
import { Brand } from './brand';
import { AppLink } from './app-link';
import { footerGroups } from './navigation';

export function SiteFooter({ appUrl, showDeveloperLinks = false }: { appUrl: string; showDeveloperLinks?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <Brand />
            <p>
              Care for the home you have.
              <br />
              Possibilities for the home you imagine.
            </p>
            <AppLink href={appUrl} className="site-footer-login" />
          </div>
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="site-footer-bottom">
          <span>Southern Home Services Group</span>
          <span>Southern Home Handyman · Boxwood</span>
          {showDeveloperLinks && <Link href="/components">Component library ↗</Link>}
        </div>
      </div>
    </footer>
  );
}
