'use client';
import { useRef, useState } from 'react';
import { Button, Input, Modal, MODAL_ANIMATIONS, MODAL_SIZES, Select, Switch, Typography, type ModalAnimation, type ModalSize } from '@shsg/ui';

export function ModalShowcase() {
  const [animation, setAnimation] = useState<ModalAnimation>('scale');
  const [size, setSize] = useState<ModalSize>('md');
  const [speed, setSpeed] = useState<'fast' | 'normal' | 'slow'>('normal');
  const [backdrop, setBackdrop] = useState(true);
  const [active, setActive] = useState<'preview' | 'form' | 'confirm' | 'long' | null>(null);
  const [nested, setNested] = useState(false);
  const [message, setMessage] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const close = (open: boolean) => {
    if (!open) setActive(null);
  };
  return (
    <>
      <section aria-labelledby="motion-title" className="border-shsg-secondary-border space-y-6 border-t pt-8">
        <Typography as="h2" variant="h3" id="motion-title">
          Animation playground
        </Typography>
        <Typography tone="muted">Choose a treatment, then open the preview. Each effect runs when the dialog opens and closes.</Typography>
        <div className="grid gap-5 sm:grid-cols-3">
          <Select label="Animation" value={animation} onChange={(event) => setAnimation(event.target.value as ModalAnimation)}>
            {MODAL_ANIMATIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
          <Select label="Modal size" value={size} onChange={(event) => setSize(event.target.value as ModalSize)}>
            {MODAL_SIZES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
          <Select label="Animation speed" value={speed} onChange={(event) => setSpeed(event.target.value as typeof speed)}>
            <option value="fast">Fast · 160 ms</option>
            <option value="normal">Normal · 280 ms</option>
            <option value="slow">Slow · 450 ms</option>
          </Select>
        </div>
        <Switch label="Close when clicking the backdrop" checked={backdrop} onChange={(event) => setBackdrop(event.target.checked)} />
        <Button onClick={() => setActive('preview')}>Open preview</Button>
        <div className="flex flex-wrap gap-3">
          {MODAL_ANIMATIONS.filter((value) => value !== 'none').map((value) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => {
                setAnimation(value);
                setActive('preview');
              }}
            >
              {value}
            </Button>
          ))}
        </div>
      </section>
      <section aria-labelledby="examples-title" className="border-shsg-secondary-border space-y-6 border-t pt-8">
        <Typography as="h2" variant="h3" id="examples-title">
          Working examples
        </Typography>
        {(
          [
            ['form', 'A small form', 'Focus starts in the name field. Submit to see a confirmation.'],
            ['confirm', 'Confirm an action', 'Backdrop dismissal is disabled; focus starts on the safe action.'],
            ['long', 'Scrollable content', 'The content scrolls while the title and actions stay visible.'],
          ] as const
        ).map(([id, title, description]) => (
          <div key={id} className="border-shsg-secondary-border flex flex-wrap items-center justify-between gap-5 border-t py-6">
            <div className="max-w-lg space-y-1">
              <Typography as="h3" variant="h5">
                {title}
              </Typography>
              <Typography variant="small" tone="muted">
                {description}
              </Typography>
            </div>
            <Button variant="secondary" onClick={() => setActive(id)}>
              Try {id === 'long' ? 'scrolling' : id}
            </Button>
          </div>
        ))}
        <Typography variant="small" tone="muted">
          Use Tab to move within the dialog, Shift+Tab to move back, and Escape to close. Focus returns to the trigger. Motion follows your system preference.
        </Typography>
        <p role="status" className="text-shsg-success text-sm">
          {message}
        </p>
      </section>
      <Modal
        open={active === 'preview'}
        onOpenChange={close}
        title="Make room for the important things"
        description="Your selected animation and size, using the shared UI components."
        animation={animation}
        size={size}
        speed={speed}
        closeOnBackdrop={backdrop}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActive(null)}>
              Close preview
            </Button>
            <Button onClick={() => setNested(true)}>Open nested dialog</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Typography variant="lead">A little space to focus.</Typography>
          <Typography tone="muted">Use this dialog for service details, a quick decision, or a short task. The rest of the page waits while you work.</Typography>
          <Typography variant="small">
            Current settings: {animation} / {size} / {speed}
          </Typography>
        </div>
      </Modal>
      <Modal open={nested} onOpenChange={setNested} title="One more detail" description="A second dialog stays above its parent." animation="slide-up" size="sm" footer={<Button onClick={() => setNested(false)}>Back to preview</Button>}>
        <Typography>Close this dialog to return to the preview. The page stays locked until both dialogs close.</Typography>
      </Modal>
      <Modal open={active === 'form'} onOpenChange={close} title="Request a service visit" description="Demo only. Nothing is sent to a server." animation="slide-up" initialFocusRef={nameRef}>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage('Your demo visit request is ready.');
            setActive(null);
          }}
        >
          <Input ref={nameRef} name="name" label="Your name" autoComplete="name" required />
          <Input type="email" name="email" label="Email address" autoComplete="email" required />
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={() => setActive(null)}>
              Cancel
            </Button>
            <Button type="submit">Request visit</Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={active === 'confirm'}
        onOpenChange={close}
        title="Cancel this visit?"
        description="This demo does not change any bookings."
        animation="scale"
        size="sm"
        closeOnBackdrop={false}
        initialFocusRef={cancelRef}
        footer={
          <>
            <Button ref={cancelRef} variant="secondary" onClick={() => setActive(null)}>
              Keep visit
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setMessage('The demo visit was cancelled.');
                setActive(null);
              }}
            >
              Cancel visit
            </Button>
          </>
        }
      >
        <Typography>You can schedule another visit whenever you are ready.</Typography>
      </Modal>
      <Modal open={active === 'long'} onOpenChange={close} title="What to expect at your visit" description="A longer dialog keeps its actions within reach." animation="slide-left" size="lg" footer={<Button onClick={() => setActive(null)}>Done reading</Button>}>
        <div className="space-y-8">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Typography as="h3" variant="h5">
                {index + 1}. Looking after your home
              </Typography>
              <Typography tone="muted">Your service professional will review the work with you, check the details, and answer any questions before getting started. Keep access clear and let us know about any special requirements.</Typography>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
