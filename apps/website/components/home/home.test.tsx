import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader } from '../site/site-header';
import { ProjectPlanner } from './project-planner';

describe('home navigation', () => {
  it('closes the mobile menu after a selection and returns focus on Escape', async () => {
    const user = userEvent.setup();
    render(<SiteHeader appUrl="http://localhost:9002/" />);
    const toggle = screen.getByRole('button', { name: /menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    const nav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    await user.click(within(nav).getByRole('link', { name: /our services/i }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
});

describe('local project planner', () => {
  it('requires a project description without opening a brief', async () => {
    const user = userEvent.setup();
    render(<ProjectPlanner />);
    await user.click(screen.getByRole('button', { name: /create my project brief/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /tell us a little/i })).toBeInvalid();
  });
  it.each([
    ['repair', 'Southern Home Handyman', 'https://southernhomehandyman.com'],
    ['renovation', 'Boxwood', 'https://boxwoodtn.com'],
  ])('routes %s projects and downloads a brief without sending a request', async (project, brand, href) => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const createUrl = vi.fn(() => 'blob:project-brief');
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createUrl,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<ProjectPlanner />);
    await user.selectOptions(screen.getByRole('combobox'), project);
    await user.type(screen.getByRole('textbox'), 'Repair the cabinet doors in our kitchen.');
    await user.click(screen.getByRole('button', { name: /create my project brief/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Repair the cabinet doors in our kitchen.')).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: `Visit ${brand}` })).toHaveAttribute('href', href);
    await user.click(within(dialog).getByRole('button', { name: /download project brief/i }));
    expect(createUrl).toHaveBeenCalledWith(expect.any(Blob));
    expect(download).toHaveBeenCalledOnce();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
