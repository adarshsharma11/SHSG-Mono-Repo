import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Checkbox, FileInput, Input, Radio, Select, Switch, Textarea } from './index';

describe('shared inputs', () => {
  it('associates labels, help, external descriptions, and errors', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <p id="external">Extra context</p>
        <Input ref={ref} label="Email" description="Work email" error="Invalid email" aria-describedby="external" required />
      </>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Extra context Work email Invalid email');
    expect(input).toBeRequired();
  });

  it('updates uncontrolled fields and supports controlled changes', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return <Input label="Controlled" value={value} onChange={(event) => setValue(event.target.value)} />;
    }
    render(
      <>
        <Input label="Uncontrolled" defaultValue="Hello" />
        <Controlled />
      </>,
    );
    await user.type(screen.getByLabelText('Uncontrolled'), ' world');
    await user.type(screen.getByLabelText('Controlled'), 'Updated');
    expect(screen.getByLabelText('Uncontrolled')).toHaveValue('Hello world');
    expect(screen.getByLabelText('Controlled')).toHaveValue('Updated');
  });

  it('prevents disabled edits and preserves readonly values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <Input label="Disabled" disabled onChange={onChange} />
        <Input label="Reference" readOnly defaultValue="SHSG" />
      </>,
    );
    await user.type(screen.getByLabelText('Disabled'), 'No');
    await user.type(screen.getByLabelText('Reference'), 'No');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Reference')).toHaveValue('SHSG');
  });

  it('supports native selection, textarea, radio, and keyboard switch behavior', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Select label="Services" multiple>
          <option value="repair">Repair</option>
          <option value="clean">Clean</option>
        </Select>
        <Textarea label="Notes" />
        <Checkbox label="Terms" />
        <Radio label="Email" name="contact" value="email" />
        <Radio label="Phone" name="contact" value="phone" />
        <Switch label="Updates" />
      </>,
    );
    await user.selectOptions(screen.getByLabelText('Services'), ['repair', 'clean']);
    expect(screen.getByLabelText('Services')).toHaveValue(['repair', 'clean']);
    await user.type(screen.getByLabelText('Notes'), 'Details');
    expect(screen.getByLabelText('Notes')).toHaveValue('Details');
    await user.click(screen.getByLabelText('Terms'));
    expect(screen.getByLabelText('Terms')).toBeChecked();
    await user.click(screen.getByLabelText('Email'));
    await user.click(screen.getByLabelText('Phone'));
    expect(screen.getByLabelText('Email')).not.toBeChecked();
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('forwards refs and multiple file selections without setting file values', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(<FileInput label="Photos" multiple ref={ref} />);
    const files = [new File(['one'], 'one.png', { type: 'image/png' }), new File(['two'], 'two.png', { type: 'image/png' })];
    await user.upload(screen.getByLabelText('Photos'), files);
    expect(Array.from(ref.current?.files ?? [])).toEqual(files);
  });

  it('keeps hidden inputs free of visible field content', () => {
    const { container } = render(<Input type="hidden" name="source" value="demo" label="Hidden label" description="Invisible" />);
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('demo');
    expect(screen.queryByText('Hidden label')).not.toBeInTheDocument();
  });
});
