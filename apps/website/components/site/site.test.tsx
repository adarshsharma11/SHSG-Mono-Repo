import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader } from './site-header';
import { SiteShell } from './site-shell';
import { parseAppUrl } from '../../lib/site-config';

const appUrl = 'https://app.example.com/login';

describe('common website shell', () => {
  it('renders one header and footer around page content, with safe new-tab app links', () => {
    render(
      <SiteShell appUrl={appUrl}>
        <main>
          <h1>Another website page</h1>
        </main>
      </SiteShell>,
    );
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Another website page');
    for (const link of screen.getAllByRole('link', { name: /login/i })) {
      expect(link).toHaveAttribute('href', appUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAccessibleName(/new tab/i);
    }
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Our services' })).toHaveAttribute('href', '/#services');
    expect(screen.queryByRole('link', { name: /component library/i })).not.toBeInTheDocument();
  });

  it('supports dropdown focus, Escape, and outside dismissal', async () => {
    const user = userEvent.setup();
    render(<SiteHeader appUrl={appUrl} />);
    const services = screen.getByRole('button', { name: /our services/i });
    await user.click(services);
    expect(services).toHaveAttribute('aria-expanded', 'true');
    await user.tab();
    expect(screen.getByRole('link', { name: /repairs & maintenance/i })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(services).toHaveAttribute('aria-expanded', 'false');
    expect(services).toHaveFocus();
    await user.click(services);
    await user.click(document.body);
    expect(services).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps closing dropdowns mounted but removes their focus and accessibility access', async () => {
    const user = userEvent.setup();
    render(<SiteHeader appUrl={appUrl} />);
    const trigger = screen.getByRole('button', { name: /our services/i });
    await user.click(trigger);
    const link = screen.getByRole('link', { name: /repairs & maintenance/i });
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!)!;
    expect(panel).toHaveAttribute('data-open', 'true');
    expect(panel).not.toHaveAttribute('inert');
    await user.click(trigger);
    expect(panel).toHaveAttribute('data-open', 'false');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveAttribute('inert');
    expect(panel).not.toHaveAttribute('hidden');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('link', { name: /repairs & maintenance/i })).not.toBeInTheDocument();
  });

  it('closes a previously open group when another disclosure opens', async () => {
    const user = userEvent.setup();
    render(<SiteHeader appUrl={appUrl} />);
    const services = screen.getByRole('button', { name: /our services/i });
    const family = screen.getByRole('button', { name: /our family/i });
    await user.click(services);
    await user.click(family);
    expect(services).toHaveAttribute('aria-expanded', 'false');
    expect(family).toHaveAttribute('aria-expanded', 'true');
  });

  it('resets the mobile disclosure at a breakpoint change and cleans up its listener', async () => {
    const media = new EventTarget() as MediaQueryList;
    const remove = vi.spyOn(media, 'removeEventListener');
    vi.stubGlobal('matchMedia', () => media);
    try {
      const user = userEvent.setup();
      const { unmount } = render(<SiteHeader appUrl={appUrl} />);
      const toggle = screen.getByRole('button', { name: /menu/i });
      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      // Dispatch inside act because this event represents an external viewport update.
      await act(async () => {
        media.dispatchEvent(new Event('change'));
      });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      unmount();
      expect(remove).toHaveBeenCalledWith('change', expect.any(Function));
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('shows developer links only when explicitly enabled', () => {
    render(
      <SiteShell appUrl={appUrl} showDeveloperLinks>
        <main>Content</main>
      </SiteShell>,
    );
    expect(screen.getByRole('link', { name: /component library/i })).toHaveAttribute('href', '/components');
  });
});

describe('application destination', () => {
  it('uses the local app by default and preserves a configured login path', () => {
    expect(parseAppUrl()).toBe('http://localhost:9002/');
    expect(parseAppUrl(appUrl)).toBe(appUrl);
  });
  it.each(['javascript:alert(1)', 'ftp://example.com', 'https://user:secret@example.com', '/login', 'https://app.example.com/?secret=value', 'https://app.example.com/#login'])('rejects an invalid destination %s', (value) => {
    expect(() => parseAppUrl(value)).toThrow();
  });
});
