'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, FileInput, Input, InputField, Radio, Select, Switch, Textarea } from '@shsg/ui';
import { demoRules, submissionPreview, type DemoValues } from './validation';

export function ValidationForm({ today }: { today: string }) {
  const form = useForm<DemoValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      source: 'input-showcase',
      reference: 'SHSG-DEMO',
      color: '#123844',
      budget: 50,
      services: [],
      contact: 'email',
      updates: false,
      terms: false,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const [preview, setPreview] = useState<ReturnType<typeof submissionPreview> | null>(null);
  const rules = demoRules(today);
  return (
    <form noValidate onSubmit={handleSubmit((values) => setPreview(submissionPreview(values)))} onChange={() => setPreview(null)} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField form={form} name="fullName" label="Full name" autoComplete="name" required rules={rules.fullName} placeholder="Alex Morgan" />
        <Input label="Email" type="email" autoComplete="email" required error={errors.email?.message} {...register('email', rules.email)} />
        <InputField form={form} name="phone" type="tel" label="Phone number" autoComplete="tel" required rules={rules.phone} />
        <InputField form={form} name="age" type="number" label="Age" min={18} max={120} required rules={rules.age} />
        <InputField form={form} name="password" type="password" label="Password" autoComplete="new-password" minLength={8} required rules={rules.password} description="At least 8 characters." />
        <InputField form={form} name="confirmPassword" type="password" label="Confirm password" autoComplete="new-password" required rules={rules.confirmPassword} />
        <InputField form={form} name="website" type="url" label="Website" placeholder="https://example.com" rules={rules.website} description="Optional. Include http:// or https://." />
        <InputField form={form} name="birthDate" type="date" label="Date of birth" min="1900-01-01" max={today} required rules={rules.birthDate} />
        <Select label="Country" autoComplete="country" required error={errors.country?.message} {...register('country', rules.country)} defaultValue="">
          <option value="" disabled>
            Choose a country
          </option>
          <option value="IN">India</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
        </Select>
        <Input label="Search services" type="search" {...register('search')} />
        <Input label="Preferred time" type="time" {...register('visitTime')} />
        <Input label="Appointment" type="datetime-local" {...register('appointment')} />
        <Input label="Preferred month" type="month" {...register('month')} />
        <Input label="Preferred week" type="week" {...register('week')} />
        <Input label="Accent color" type="color" {...register('color')} />
        <Input label="Budget priority" type="range" min={0} max={100} description="0 (low) to 100 (high)." {...register('budget', { valueAsNumber: true })} />
        <Select label="Services" multiple visibleOptions={3} description="Use Ctrl or Command to select multiple." {...register('services')}>
          <option value="cleaning">Cleaning</option>
          <option value="repair">Repair</option>
          <option value="maintenance">Maintenance</option>
        </Select>
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium">Preferred contact</legend>
          <Radio label="Contact by email" value="email" {...register('contact')} />
          <Radio label="Contact by phone" value="phone" {...register('contact')} />
        </fieldset>
        <FileInput label="Supporting PDF" accept="application/pdf" description="Optional PDF, up to 2 MB." error={errors.attachment?.message} {...register('attachment', rules.attachment)} />
        <FileInput label="Property photos" multiple accept="image/png,image/jpeg" description="Optional PNG or JPEG files, up to 2 MB each." error={errors.photos?.message} {...register('photos', rules.photos)} />
        <Textarea
          label="Additional notes"
          maxLength={500}
          {...register('notes', {
            maxLength: { value: 500, message: 'Use 500 characters or fewer' },
          })}
          error={errors.notes?.message}
        />
        <Input label="Reference" readOnly {...register('reference')} />
      </div>
      <Input type="hidden" {...register('source')} />
      <Switch label="Send service updates" {...register('updates')} />
      <Checkbox label="I accept the terms" required error={errors.terms?.message} {...register('terms', rules.terms)} />
      <p className="text-shsg-muted text-sm">Demo only. Values stay on this page. Fields validate on blur; submitted errors update as you edit.</p>
      <Button type="submit" loading={isSubmitting}>
        Submit example
      </Button>
      {preview && (
        <div role="status" className="border-shsg-secondary-border space-y-3 border-t pt-6">
          <h3 className="font-semibold">Submitted values</h3>
          <pre className="bg-shsg-field-muted overflow-x-auto rounded-lg p-4 text-xs leading-6">{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
