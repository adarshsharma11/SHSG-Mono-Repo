import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TermsDocument } from './terms-document';

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '/');
});

describe('terms document', () => {
  it('connects every contents link to a uniquely labelled section and identifies draft copy', () => {
    render(<TermsDocument />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms of use');
    expect(screen.getByText(/working draft: this wording is pending review/i)).toBeInTheDocument();
    const contents = screen.getByRole('navigation', { name: 'Table of contents' });
    for (const link of within(contents).getAllByRole('link')) {
      const target = document.getElementById(link.getAttribute('href')?.slice(1) ?? '');
      expect(target).toBeInTheDocument();
      expect(target).toHaveAccessibleName(link.textContent ?? '');
    }
    expect(screen.getByRole('link', { name: /find the right southern home team/i })).toHaveAttribute('href', '/#our-family');
  });

  it('supports direct section links and hash changes without IntersectionObserver', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    window.history.replaceState(null, '', '/terms-of-use#privacy');
    render(<TermsDocument />);
    const contents = screen.getByRole('navigation', { name: 'Table of contents' });
    expect(within(contents).getByRole('link', { name: 'Privacy & personal information' })).toHaveAttribute('aria-current', 'location');
    await act(async () => {
      window.history.replaceState(null, '', '#contact');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(within(contents).getByRole('link', { name: 'Questions & contact' })).toHaveAttribute('aria-current', 'location');
    expect(within(contents).getByRole('link', { name: 'Privacy & personal information' })).not.toHaveAttribute('aria-current');
  });

  it('updates the current link on keyboard activation', async () => {
    const user = userEvent.setup();
    render(<TermsDocument />);
    const contents = screen.getByRole('navigation', { name: 'Table of contents' });
    const link = within(contents).getByRole('link', { name: 'Acceptable use' });
    link.focus();
    await user.keyboard('{Enter}');
    expect(link).toHaveAttribute('aria-current', 'location');
    expect(link).toHaveFocus();
  });

  it('tracks the reading position and disconnects its observer on unmount', () => {
    let update = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: () => void) {
          update = callback;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const { unmount } = render(<TermsDocument />);
    const sections = Array.from(document.querySelectorAll('article section'));
    sections.forEach((section, index) => {
      vi.spyOn(section, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, index < 2 ? -100 : 1000, 700, 300));
    });
    act(() => update());
    expect(screen.getByRole('link', { name: 'Our services' })).toHaveAttribute('aria-current', 'location');
    expect(observe).toHaveBeenCalledTimes(sections.length);
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
