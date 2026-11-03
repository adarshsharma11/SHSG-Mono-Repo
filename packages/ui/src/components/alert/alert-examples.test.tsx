import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { AlertExamples } from '../../../../../apps/website/app/alert/alert-examples';

describe('website alert examples', () => {
  it('reviews, dismisses, restores, and returns focus to the restore action', async () => {
    const user = userEvent.setup();
    render(<AlertExamples />);
    await user.click(screen.getByRole('button', { name: 'Review instructions' }));
    expect(screen.getByText('Instructions reviewed')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Dismiss visit reminder' }));
    expect(screen.queryByText('Instructions reviewed')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restore reminder' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Restore reminder' }));
    expect(screen.getByText('Your visit needs a quick review')).toBeVisible();
  });
  it('changes feedback after saving and resets the example', async () => {
    const user = userEvent.setup();
    render(<AlertExamples />);
    await user.click(screen.getByRole('button', { name: 'Save demo preferences' }));
    expect(screen.getByText('Preferences saved')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save demo preferences' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Reset example' }));
    expect(screen.getByText('Ready to save')).toBeVisible();
  });
});
