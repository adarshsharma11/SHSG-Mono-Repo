import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Button } from './button';
import { BUTTON_SIZES, BUTTON_VARIANTS } from './button.types';

describe('Button', () => {
  it('renders a default button with an accessible name', () => {
    render(<Button>Default action</Button>);

    const button = screen.getByRole('button', { name: 'Default action' });

    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).toHaveAttribute('data-shape', 'rounded');
    expect(button).toHaveClass('rounded-lg');
  });

  it.each(BUTTON_VARIANTS)('renders the %s variant', (variant) => {
    render(<Button variant={variant}>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('data-variant', variant);
  });

  it.each(BUTTON_SIZES)('renders the %s size', (size) => {
    render(<Button size={size}>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('data-size', size);
  });

  it('applies shape, full-width, and custom classes', () => {
    render(
      <Button shape="pill" fullWidth className="custom-class">
        Continue
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Continue' });

    expect(button).toHaveClass('rounded-full', 'w-full', 'custom-class');
    expect(button).not.toHaveClass('rounded-lg');
  });

  it('supports square corners', () => {
    render(<Button shape="square">Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('rounded-none');
  });

  it('forwards native attributes, style, and form semantics', () => {
    render(
      <form>
        <Button type="submit" name="action" value="save" form="project-form" aria-label="Save project" data-testid="save-button" style={{ marginTop: 4 }}>
          Save
        </Button>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Save project' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'action');
    expect(button).toHaveAttribute('value', 'save');
    expect(button).toHaveAttribute('form', 'project-form');
    expect(button).toHaveAttribute('data-testid', 'save-button');
    expect(button).toHaveStyle({ marginTop: '4px' });
  });

  it('keeps type=button by default inside a form', () => {
    render(
      <form>
        <Button>Default action</Button>
      </form>,
    );

    expect(screen.getByRole('button', { name: 'Default action' })).toHaveAttribute('type', 'button');
  });

  it('calls click and focus handlers', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onFocus = vi.fn();

    render(
      <Button onClick={onClick} onFocus={onFocus}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalled();
  });

  it('activates from the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save</Button>);

    screen.getByRole('button', { name: 'Save' }).focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call click handlers when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Delete account
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Delete account' });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:cursor-not-allowed');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes a busy, disabled state while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        Submitting
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submitting' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button.querySelector("[data-slot='loading-indicator']")).not.toBeNull();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('replaces the label with loading text', () => {
    render(
      <Button loading loadingText="Saving changes...">
        Save changes
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Saving changes...' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Save changes' })).not.toBeInTheDocument();
  });

  it('keeps the original accessible name when the label is replaced by a spinner', () => {
    render(
      <Button loading loadingPosition="replace">
        Submitting
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Submitting' })).toHaveAttribute('aria-busy', 'true');
  });

  it('renders a custom loading indicator', () => {
    render(
      <Button loading loadingIndicator={<span>Please wait</span>}>
        Save
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Save' })).toHaveTextContent('Please wait');
  });

  it('renders leading and trailing icons in order', () => {
    render(
      <Button leftIcon={<span data-testid="left">L</span>} rightIcon={<span data-testid="right">R</span>}>
        Search services
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Search services' });
    const left = screen.getByTestId('left');
    const right = screen.getByTestId('right');

    expect(button).toContainElement(left);
    expect(button).toContainElement(right);
    expect(left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('does not duplicate a child icon with side icons', () => {
    render(
      <Button size="icon" aria-label="Open settings" leftIcon={<span data-testid="left">L</span>}>
        <span data-testid="child">S</span>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Open settings' })).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('left')).not.toBeInTheDocument();
  });

  it('names an icon-only button from aria-label', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Button size="icon" aria-label="Open settings">
        <span>S</span>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveAttribute('data-icon-only', 'true');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('warns in development when an icon-only button has no accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <Button size="icon" title="Settings">
        <svg data-testid="icon" />
      </Button>,
    );

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('accessible name'));
    warn.mockRestore();
  });

  it('accepts aria-labelledby as the accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <>
        <span id="settings-label">Settings</span>
        <Button size="icon" aria-labelledby="settings-label">
          <span>S</span>
        </Button>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('forwards a ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Save</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Save');
  });

  it('uses an icon box when iconOnly is set', () => {
    render(
      <Button iconOnly aria-label="Add">
        <span>+</span>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Add' })).toHaveAttribute('data-size', 'icon');
  });
});
