import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ValidationForm } from '../../../../../apps/website/app/input/validation-form';
import { validateFiles, validateWebsite } from '../../../../../apps/website/app/input/validation';

const today = '2026-11-02';
function field(label: string) {
  return screen.getByLabelText(new RegExp(`^${label}\\s*\\*?$`));
}

describe('React Hook Form showcase', () => {
  it('shows required errors on submission and focuses an invalid field', async () => {
    const user = userEvent.setup();
    render(<ValidationForm today={today} />);
    await user.click(screen.getByRole('button', { name: 'Submit example' }));
    expect(await screen.findByText('Full name is required')).toBeVisible();
    expect(field('Email')).toHaveFocus();
    expect(screen.getByText('Accept the terms to continue')).toBeVisible();
    expect(screen.queryByText('Submitted values')).not.toBeInTheDocument();
  });

  it('validates on blur, checks confirmation, and revalidates when password changes', async () => {
    const user = userEvent.setup();
    render(<ValidationForm today={today} />);
    await user.type(field('Email'), 'invalid');
    expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument();
    await user.tab();
    expect(await screen.findByText('Enter a valid email address')).toBeVisible();
    await user.type(screen.getByLabelText(/^Password/), 'short');
    await user.tab();
    expect(await screen.findByText('Use at least 8 characters')).toBeVisible();
    await user.type(field('Confirm password'), 'different');
    await user.tab();
    expect(await screen.findByText('Passwords must match')).toBeVisible();
    await user.clear(screen.getByLabelText(/^Password/));
    await user.type(screen.getByLabelText(/^Password/), 'different');
    await user.tab();
    await waitFor(() => expect(screen.queryByText('Passwords must match')).not.toBeInTheDocument());
  });

  it('checks numeric boundaries, future dates, and URL protocols', async () => {
    const user = userEvent.setup();
    render(<ValidationForm today={today} />);
    await user.type(field('Age'), '17');
    await user.tab();
    expect(await screen.findByText('You must be at least 18')).toBeVisible();
    await user.clear(field('Age'));
    await user.type(field('Age'), '121');
    await user.tab();
    expect(await screen.findByText('Enter an age of 120 or less')).toBeVisible();
    fireEvent.change(field('Date of birth'), {
      target: { value: '2027-01-01' },
    });
    fireEvent.blur(field('Date of birth'));
    expect(await screen.findByText('Date of birth cannot be in the future')).toBeVisible();
    expect(validateWebsite('javascript:alert(1)')).not.toBe(true);
    expect(validateWebsite('https://example.com')).toBe(true);
  });

  it('rejects invalid file types and oversized files', async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<ValidationForm today={today} />);
    await user.upload(field('Supporting PDF'), new File(['text'], 'bad.txt', { type: 'text/plain' }));
    fireEvent.blur(field('Supporting PDF'));
    expect(await screen.findByText('Choose a PDF, PNG, or JPEG of the allowed type')).toBeVisible();
    const oversized = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' });
    await user.upload(field('Supporting PDF'), oversized);
    fireEvent.blur(field('Supporting PDF'));
    expect(await screen.findByText('Each file must be 2 MB or smaller')).toBeVisible();
    expect(validateFiles(undefined, ['application/pdf'])).toBe(true);
  });

  it('submits all control families and excludes passwords from the preview', async () => {
    const user = userEvent.setup();
    render(<ValidationForm today={today} />);
    await user.type(field('Full name'), 'Alex Morgan');
    await user.type(field('Email'), 'alex@example.com');
    await user.type(field('Phone number'), '+1 555 123 4567');
    await user.type(screen.getByLabelText(/^Password/), 'secret-password');
    await user.type(field('Confirm password'), 'secret-password');
    await user.type(field('Age'), '30');
    fireEvent.change(field('Date of birth'), {
      target: { value: '1996-01-01' },
    });
    await user.selectOptions(field('Country'), 'IN');
    await user.selectOptions(screen.getByLabelText('Services'), ['cleaning', 'repair']);
    await user.click(screen.getByRole('switch'));
    await user.click(field('Contact by phone'));
    await user.upload(field('Property photos'), new File(['photo'], 'home.png', { type: 'image/png' }));
    await user.click(field('I accept the terms'));
    await user.click(screen.getByRole('button', { name: 'Submit example' }));
    expect(await screen.findByText('Submitted values')).toBeVisible();
    const preview = screen.getByRole('status');
    expect(preview).toHaveTextContent('"source": "input-showcase"');
    expect(preview).toHaveTextContent('"contact": "phone"');
    expect(preview).toHaveTextContent('"photoCount": 1');
    expect(preview).not.toHaveTextContent('secret-password');
    expect(preview).not.toHaveTextContent('confirmPassword');
    await user.type(field('Full name'), ' edit');
    expect(screen.queryByText('Submitted values')).not.toBeInTheDocument();
  });
});
