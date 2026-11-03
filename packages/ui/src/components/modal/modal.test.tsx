import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Modal } from './modal';

// jsdom does not implement top-layer dialogs. Model only the platform methods;
// real focus trapping, inertness, and CSS transitions require a browser.
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    }),
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    }),
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Modal', () => {
  it('keeps the native dialog and scroll lock until its own exit fade finishes', () => {
    const onOpenChange = vi.fn();
    const props = {
      onOpenChange,
      title: 'Animated',
      style: { transitionDuration: '220ms', transitionDelay: '0s' },
    };
    const { rerender } = render(
      <Modal {...props} open>
        Content
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    rerender(
      <Modal {...props} open={false}>
        Content
      </Modal>,
    );
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAttribute('data-state', 'closing');
    expect(document.body.style.overflow).toBe('hidden');
    expect(dialog.querySelector('[data-slot="modal-panel"]')).toHaveAttribute('inert');
    const end = () =>
      Object.assign(new Event('transitionend', { bubbles: true }), {
        propertyName: 'opacity',
      });
    fireEvent(screen.getByText('Content'), end());
    expect(dialog).toHaveAttribute('open');
    fireEvent(dialog, end());
    expect(dialog).not.toHaveAttribute('open');
    expect(document.body.style.overflow).toBe('');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('finishes closing if a transition event never arrives', () => {
    vi.useFakeTimers();
    const props = {
      onOpenChange: vi.fn(),
      title: 'Fallback',
      style: { transitionDuration: '0.22s' },
    };
    const { rerender } = render(
      <Modal {...props} open>
        Content
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    rerender(
      <Modal {...props} open={false}>
        Content
      </Modal>,
    );
    act(() => vi.advanceTimersByTime(269));
    expect(dialog).toHaveAttribute('open');
    act(() => vi.advanceTimersByTime(1));
    expect(dialog).not.toHaveAttribute('open');
    expect(document.body.style.overflow).toBe('');
  });

  it('cancels a pending close when reopened without releasing its scroll lock', () => {
    vi.useFakeTimers();
    const props = {
      onOpenChange: vi.fn(),
      title: 'Reopen',
      style: { transitionDuration: '220ms' },
    };
    const { rerender } = render(
      <Modal {...props} open>
        Content
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    rerender(
      <Modal {...props} open={false}>
        Content
      </Modal>,
    );
    act(() => vi.advanceTimersByTime(100));
    rerender(
      <Modal {...props} open>
        Content
      </Modal>,
    );
    act(() => vi.advanceTimersByTime(1000));
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAttribute('data-state', 'open');
    expect(HTMLDialogElement.prototype.close).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes immediately when reduced motion is requested', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    const props = {
      onOpenChange: vi.fn(),
      title: 'Reduced motion',
      style: { transitionDuration: '220ms' },
    };
    const { rerender } = render(
      <Modal {...props} open>
        Content
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    rerender(
      <Modal {...props} open={false}>
        Content
      </Modal>,
    );
    expect(dialog).not.toHaveAttribute('open');
    expect(document.body.style.overflow).toBe('');
  });

  it('stays closed initially and opens with an accessible title and description', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Modal open={false} onOpenChange={onOpenChange} title="Visit details" description="Your next visit">
        Details
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(
      <Modal open onOpenChange={onOpenChange} title="Visit details" description="Your next visit">
        Details
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Visit details' })).toHaveAccessibleDescription('Your next visit');
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it('focuses a requested element inside the dialog', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Modal open onOpenChange={vi.fn()} title="Name" initialFocusRef={ref}>
        <input ref={ref} aria-label="Name input" />
      </Modal>,
    );
    expect(screen.getByLabelText('Name input')).toHaveFocus();
  });

  it('requests dismissal from close, Escape, and backdrop while ignoring content clicks', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Details">
        <button>Content action</button>
      </Modal>,
    );
    await user.click(screen.getByText('Content action'));
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    const dialog = screen.getByRole('dialog');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    expect(onOpenChange).toHaveBeenCalledTimes(3);
  });

  it('honors dismissal restrictions and ignores a drag from the content to the backdrop', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Modal open onOpenChange={onOpenChange} title="Confirm" closeOnEscape={false} closeOnBackdrop={false}>
        Content
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    expect(onOpenChange).not.toHaveBeenCalled();
    rerender(
      <Modal open onOpenChange={onOpenChange} title="Confirm">
        Content
      </Modal>,
    );
    fireEvent.pointerDown(screen.getByText('Content'));
    fireEvent.click(dialog);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('synchronizes controlled closure and native dialog closure', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Modal open onOpenChange={onOpenChange} title="Details">
        Content
      </Modal>,
    );
    rerender(
      <Modal open={false} onOpenChange={onOpenChange} title="Details">
        Content
      </Modal>,
    );
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    rerender(
      <Modal open onOpenChange={onOpenChange} title="Details">
        Content
      </Modal>,
    );
    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    dialog.close();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('preserves body scroll locking until the last dialog closes and restores the prior value', () => {
    document.body.style.overflow = 'scroll';
    const { rerender, unmount } = render(
      <>
        <Modal open onOpenChange={vi.fn()} title="Parent">
          Parent
        </Modal>
        <Modal open onOpenChange={vi.fn()} title="Child">
          Child
        </Modal>
      </>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(
      <>
        <Modal open onOpenChange={vi.fn()} title="Parent">
          Parent
        </Modal>
        <Modal open={false} onOpenChange={vi.fn()} title="Child">
          Child
        </Modal>
      </>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('scroll');
    document.body.style.overflow = '';
  });

  it('renders footer actions, animation options, and external descriptions', () => {
    render(
      <>
        <p id="hint">Extra context</p>
        <Modal open onOpenChange={vi.fn()} title="Details" description="More details" aria-describedby="hint" animation="slide-up" speed="slow" size="lg" footer={<button>Save</button>}>
          Content
        </Modal>
      </>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleDescription('Extra context More details');
    expect(dialog).toHaveAttribute('data-animation', 'slide-up');
    expect(dialog).toHaveAttribute('data-speed', 'slow');
    expect(screen.getByRole('button', { name: 'Save' })).toBeVisible();
  });
});
