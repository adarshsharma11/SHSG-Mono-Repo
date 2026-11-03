import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';
import { connection } from 'next/server';
import { Checkbox, FileInput, Input, Radio, Select, Switch, Textarea } from '@shsg/ui';
import { ValidationForm } from './validation-form';

export const metadata: Metadata = {
  title: 'Inputs | SHSG',
  description: 'Shared native inputs and React Hook Form validation examples.',
};

export default function InputPage() {
  // The current date is supplied at request time to avoid stale date limits and hydration differences.
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto w-full max-w-4xl space-y-16 px-6 py-16 sm:px-10">
        <header className="max-w-xl space-y-4">
          <nav className="text-shsg-muted flex flex-wrap gap-5 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/button" className="hover:underline">
              Buttons
            </Link>
            <Link href="/typography" className="hover:underline">
              Typography
            </Link>
            <Link href="/modal" className="hover:underline">
              Modals
            </Link>
            <a href="#validation" className="hover:underline">
              Try validation ↓
            </a>
          </nav>
          <p className="text-shsg-muted text-sm font-medium tracking-wide uppercase">Southern Home Services</p>
          <h1 className="text-4xl font-semibold tracking-tight">Inputs</h1>
          <p className="text-shsg-muted text-lg leading-8">Native controls for every shared form. Explore the states, then try a complete validated example.</p>
        </header>
        <Section title="Basic inputs" description="Text and numeric controls with native browser behavior.">
          <Input label="Text" placeholder="Enter your name" />
          <Input label="Email address" type="email" placeholder="alex@example.com" />
          <Input label="Password example" type="password" autoComplete="new-password" />
          <Input label="Number" type="number" min={0} max={100} />
          <Input label="Telephone" type="tel" placeholder="+1 555 123 4567" />
          <Input label="URL" type="url" placeholder="https://example.com" />
          <Input label="Search" type="search" placeholder="Find a service" />
        </Section>
        <Section title="Date and time" description="Familiar browser pickers, keyboard entry, and native constraints.">
          <Input label="Date" type="date" />
          <Input label="Time" type="time" />
          <Input label="Date and time" type="datetime-local" />
          <Input label="Month" type="month" />
          <Input label="Week" type="week" />
        </Section>
        <Section title="Selection controls" description="Single choices, multiple choices, and adjustable values.">
          <Checkbox label="Include maintenance" />
          <Switch label="Enable reminders" />
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium">Visit type</legend>
            <Radio label="One-time visit" name="visit" value="once" defaultChecked />
            <Radio label="Recurring visit" name="visit" value="recurring" />
          </fieldset>
          <Select label="Service">
            <option>Cleaning</option>
            <option>Repairs</option>
          </Select>
          <Select label="Multiple services" multiple defaultValue={['cleaning']} visibleOptions={3} description="Use Ctrl or Command to select multiple.">
            <option value="cleaning">Cleaning</option>
            <option value="repair">Repair</option>
            <option value="maintenance">Maintenance</option>
          </Select>
          <Input label="Color" type="color" defaultValue="#123844" />
          <Input label="Range" type="range" min={0} max={100} defaultValue={50} />
        </Section>
        <Section title="Advanced inputs" description="Long-form text, native file selection, and form metadata.">
          <Textarea label="Notes" placeholder="Tell us about the property" />
          <FileInput label="Single file" />
          <FileInput label="Multiple files" multiple />
          <Input label="Read-only reference" readOnly defaultValue="SHSG-001" />
          <div className="text-shsg-muted text-sm">
            <Input type="hidden" name="exampleSource" value="showcase" />
            Hidden fields carry metadata without a visible control. The validated example includes a source field in its preview.
          </div>
        </Section>
        <Section title="Input states" description="Sizes, treatments, and feedback share the same design tokens.">
          <Input label="Default" placeholder="Enter text" />
          <Input label="Filled value" defaultValue="Southern Home Services" />
          <Input label="Disabled" disabled defaultValue="Unavailable" />
          <Input label="Required" required />
          <Input label="Error" defaultValue="invalid" error="Check this value and try again." />
          <Input label="Success" defaultValue="alex@example.com" success="Email verified." />
          <Input label="Read-only" readOnly defaultValue="SHSG-002" />
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Input key={size} size={size} label={`Size: ${size}`} placeholder={`Size ${size}`} />
          ))}
          {(['outline', 'filled', 'underline'] as const).map((variant) => (
            <Input key={variant} variant={variant} label={`Variant: ${variant}`} placeholder={variant} />
          ))}
        </Section>
        <section id="validation" className="border-shsg-secondary-border scroll-mt-8 space-y-6 border-t pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Form validation</h2>
            <p className="text-shsg-muted">Every input registered with React Hook Form. Required fields are marked with an asterisk.</p>
          </div>
          <DatedValidationForm />
        </section>
      </main>
    </div>
  );
}

function DatedValidationForm() {
  return (
    <Suspense fallback={<p>Loading form…</p>}>
      <CurrentValidationForm />
    </Suspense>
  );
}
async function CurrentValidationForm() {
  await connection();
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return <ValidationForm today={today} />;
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="border-shsg-secondary-border space-y-6 border-t pt-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-shsg-muted">{description}</p>
      </div>
      <div className="grid items-start gap-6 sm:grid-cols-2">{children}</div>
    </section>
  );
}
