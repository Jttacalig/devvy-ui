import { createRef, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Checkbox, Switch, Tabs, Label, Textarea, Input } from '../index';

const items = [
  { value: 'one', label: 'Overview', content: <Input aria-label="Draft" /> },
  { value: 'two', label: 'Unavailable', disabled: true, content: 'Unavailable content' },
  { value: 'three', label: 'Settings', content: 'Settings content' },
];

describe('forms', () => {
  it('keeps a loading button named and blocks repeated actions', async () => {
    const click = vi.fn();
    render(
      <Button loading onClick={click}>
        Save project
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save project' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    await userEvent.click(button);
    expect(click).not.toHaveBeenCalled();
  });
  it('associates label and textarea, forwards a ref, and accepts native props', async () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <>
        <Label htmlFor="notes">Notes</Label>
        <Textarea ref={ref} id="notes" required aria-describedby="hint" />
        <p id="hint">Describe the project.</p>
      </>,
    );
    await userEvent.type(screen.getByLabelText('Notes'), 'Ready');
    expect(ref.current?.value).toBe('Ready');
    expect(ref.current?.required).toBe(true);
  });
  it('submits checkbox and switch values, and restores defaults on reset', async () => {
    render(
      <form aria-label="Preferences">
        <Label>
          <Checkbox name="terms" defaultChecked />
          Terms
        </Label>
        <Label>
          <Switch name="updates" />
          Updates
        </Label>
        <Button type="reset">Reset</Button>
      </form>,
    );
    const form = screen.getByRole('form', { name: 'Preferences' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
    await userEvent.click(screen.getByRole('switch', { name: 'Updates' }));
    expect(new FormData(form).get('updates')).toBe('on');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(new FormData(form).get('updates')).toBeNull();
    expect(new FormData(form).get('terms')).toBe('on');
  });
  it('supports Space, disabled state and mixed checkbox state', async () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Checkbox ref={ref} aria-label="All items" indeterminate />);
    expect(ref.current?.indeterminate).toBe(true);
    expect(ref.current?.getAttribute('aria-checked')).toBe('mixed');
    ref.current?.focus();
    await userEvent.keyboard(' ');
    expect(ref.current?.checked).toBe(true);
    expect(ref.current?.indeterminate).toBe(true);
    rerender(<Checkbox ref={ref} aria-label="All items" disabled indeterminate={false} />);
    expect(ref.current?.indeterminate).toBe(false);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(ref.current?.checked).toBe(true);
  });
  it('supports controlled switch changes', async () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <Switch
          aria-label="Notifications"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      );
    }
    render(<Controlled />);
    const control = screen.getByRole('switch');
    control.focus();
    await userEvent.keyboard(' ');
    expect(control.matches(':checked')).toBe(true);
  });
});

describe('tabs', () => {
  it('links tabs and panels with unique IDs across instances', () => {
    render(
      <>
        <Tabs label="First" items={items} />
        <Tabs label="Second" items={items} />
      </>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(new Set(tabs.map((tab) => tab.id)).size).toBe(6);
    for (const tab of tabs) {
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
      expect(panel?.getAttribute('aria-labelledby')).toBe(tab.id);
    }
  });
  it('uses arrows, Home and End, skips disabled tabs and wraps', async () => {
    render(<Tabs label="Project" items={items} />);
    act(() => screen.getByRole('tab', { name: 'Overview' }).focus());
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.getByRole('tabpanel').textContent).toBe('Settings content');
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Overview' }));
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Settings' }));
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Overview' }));
  });
  it('allows manual activation without changing panels on focus', async () => {
    render(<Tabs label="Project" items={items} activationMode="manual" />);
    act(() => screen.getByRole('tab', { name: 'Overview' }).focus());
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: 'Settings' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });
  it('supports RTL and vertical orientation without capturing unrelated keys', async () => {
    const { rerender } = render(<Tabs label="Project" items={items} dir="rtl" />);
    act(() => screen.getByRole('tab', { name: 'Overview' }).focus());
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Settings' }));
    rerender(<Tabs label="Project" items={items} orientation="vertical" />);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Overview' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Overview' }));
  });
  it('notifies a controlled parent without changing its value', async () => {
    const change = vi.fn();
    render(<Tabs label="Project" items={items} value="one" onValueChange={change} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(change).toHaveBeenCalledWith('three');
    expect(change).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });
  it('preserves hidden panel input state and handles removed selections', async () => {
    const { rerender } = render(<Tabs label="Project" items={items} />);
    await userEvent.type(screen.getByLabelText('Draft'), 'Keep me');
    await userEvent.click(screen.getByRole('tab', { name: 'Settings' }));
    await userEvent.click(screen.getByRole('tab', { name: 'Overview' }));
    expect(screen.getByLabelText('Draft').getAttribute('value')).toBeNull();
    const input = screen.getByLabelText('Draft');
    expect(input instanceof HTMLInputElement && input.value).toBe('Keep me');
    rerender(<Tabs label="Project" items={items.slice(2)} />);
    expect(screen.getByRole('tab').getAttribute('aria-selected')).toBe('true');
  });
  it('handles no items or all-disabled items safely', () => {
    const { rerender } = render(<Tabs label="Empty" items={[]} />);
    expect(screen.queryByRole('tab')).toBeNull();
    rerender(<Tabs label="Empty" items={items.map((item) => ({ ...item, disabled: true }))} />);
    expect(screen.queryByRole('tabpanel')).toBeNull();
    fireEvent.keyDown(screen.getAllByRole('tab')[0], { key: 'ArrowRight' });
    expect(screen.getAllByRole('tab').every((tab) => tab.tabIndex === -1)).toBe(true);
  });
});
