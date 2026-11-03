import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { DropdownMenu } from './index';

describe('DropdownMenu', () => {
  it('opens with keyboard focus, skips disabled actions, and restores focus after selection', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <DropdownMenu
        label="Visit actions"
        items={[
          { id: 'view', label: 'View', onSelect: select },
          { id: 'off', label: 'Unavailable', disabled: true },
          { id: 'sep', type: 'separator' },
          { id: 'archive', label: 'Archive' },
        ]}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Visit actions' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{Home}{Enter}');
    expect(select).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it('supports last-item opening, typeahead, and Escape', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        label="Actions"
        items={[
          { id: 'one', label: 'Archive' },
          { id: 'two', label: 'Review' },
          { id: 'three', label: 'View' },
        ]}
      />,
    );
    const trigger = screen.getByRole('button');
    trigger.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
    await user.keyboard('r');
    expect(screen.getByRole('menuitem', { name: 'Review' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('dismisses on outside click and lets Tab continue after the trigger', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DropdownMenu label="Actions" items={[{ id: 'one', label: 'Review' }]} />
        <button>Next control</button>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next control' })).toHaveFocus();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('button', { name: 'Next control' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next control' })).toHaveFocus();
  });
  it('portals inside an enclosing native dialog and exposes link semantics', async () => {
    render(
      <dialog open>
        <DropdownMenu label="Links" items={[{ id: 'table', label: 'Tables', href: '/table' }]} />
      </dialog>,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Links' }));
    expect(screen.getByRole('dialog')).toContainElement(screen.getByRole('menu'));
    expect(screen.getByRole('menuitem')).toHaveAttribute('href', '/table');
  });
});
