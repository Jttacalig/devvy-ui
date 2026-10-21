import { StrictMode, createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import { Button, Card, Dialog, Dock, Glass, Input } from '../index';

const originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
afterEach(() => {
  cleanup();
  for (const [name, descriptor] of [
    ['showModal', originalShow],
    ['close', originalClose],
  ] as const) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
  }
  vi.restoreAllMocks();
});
function mockDialog() {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    },
  });
}

describe('optional glass material', () => {
  it('is deterministic and opaque during SSR', () => {
    const html = renderToString(
      <Glass>
        <Card>Content</Card>
      </Glass>,
    );
    expect(html).toContain('data-devvy-quality="reduced"');
    expect(html).toContain('data-devvy-material="glass"');
  });
  it('keeps children mounted when disabled and accepts a manual quality', () => {
    const { container, rerender } = render(
      <Glass quality="reduced" theme="dark">
        <Input defaultValue="Keep me" />
      </Glass>,
    );
    const input = screen.getByRole('textbox');
    rerender(
      <Glass enabled={false} quality="full">
        <Input defaultValue="Keep me" />
      </Glass>,
    );
    expect(container.firstElementChild?.hasAttribute('data-devvy-material')).toBe(false);
    expect(screen.getByRole('textbox')).toBe(input);
  });
  it('reduces automatically when backdrop support is unavailable', async () => {
    const { container } = render(
      <Glass>
        <Card>Automatic</Card>
      </Glass>,
    );
    await waitFor(() =>
      expect(container.firstElementChild?.getAttribute('data-devvy-quality')).toBe('reduced'),
    );
  });
  it('keeps dock links and buttons native and named', () => {
    render(
      <Dock label="Workspace">
        <a href="/workspace" aria-current="page">
          Workspace
        </a>
        <button type="button">Settings</button>
      </Dock>,
    );
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeTruthy();
    expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page');
  });
});

describe('controlled dialog', () => {
  it('restores an explicit pointer invoker when the browser did not focus it', () => {
    mockDialog();
    const trigger = createRef<HTMLButtonElement>();
    const control = createRef<HTMLInputElement>();
    const renderDialog = (open: boolean) => (
      <>
        <Button ref={trigger}>Settings</Button>
        <Dialog
          open={open}
          onOpenChange={() => undefined}
          title="Return focus"
          initialFocusRef={control}
          returnFocusRef={trigger}
        >
          <Input ref={control} aria-label="Name" />
        </Dialog>
      </>
    );
    const { rerender } = render(renderDialog(true));
    expect(document.activeElement).toBe(control.current);
    rerender(renderDialog(false));
    expect(document.activeElement).toBe(trigger.current);
  });
  it('SSR renders closed markup with deterministic title references', () => {
    const html = renderToString(
      <Dialog open onOpenChange={() => undefined} title="Settings">
        Details
      </Dialog>,
    );
    expect(html).toContain('aria-labelledby=');
    expect(html).not.toMatch(/<dialog[^>]*\sopen(?:\s|=|>)/);
  });
  it('opens, focuses a requested control, names the dialog and closes once', async () => {
    mockDialog();
    const focus = createRef<HTMLInputElement>();
    const change = vi.fn();
    const { rerender } = render(
      <Dialog
        open
        onOpenChange={change}
        title="Settings"
        description="Workspace settings"
        initialFocusRef={focus}
      >
        <Input aria-label="Name" ref={focus} />
      </Dialog>,
    );
    expect(document.activeElement).toBe(screen.getByRole('textbox'));
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    rerender(
      <Dialog open={false} onOpenChange={change} title="Settings">
        Details
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(change).toHaveBeenCalledTimes(1);
  });
  it('requests Escape dismissal but respects a canceled cancel event', () => {
    mockDialog();
    const change = vi.fn();
    const { rerender } = render(
      <Dialog open onOpenChange={change} title="Settings">
        Details
      </Dialog>,
    );
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    change.mockClear();
    rerender(
      <Dialog
        open
        onOpenChange={change}
        title="Settings"
        onCancel={(event) => event.preventDefault()}
      >
        Details
      </Dialog>,
    );
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(change).not.toHaveBeenCalled();
  });
  it('survives StrictMode cleanup without requesting an unexpected close', () => {
    mockDialog();
    const change = vi.fn();
    render(
      <StrictMode>
        <Dialog open onOpenChange={change} title="Settings">
          Details
        </Dialog>
      </StrictMode>,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(change).not.toHaveBeenCalled();
  });
  it('cleans up a native modal on unmount', () => {
    mockDialog();
    const { unmount } = render(
      <Dialog open onOpenChange={() => undefined} title="Settings">
        Details
      </Dialog>,
    );
    const element = screen.getByRole('dialog');
    unmount();
    expect(element.hasAttribute('open')).toBe(false);
  });
  it('provides a nonmodal inline fallback when native dialogs are unavailable', async () => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: undefined,
    });
    function Fallback() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen} title="Settings">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </Dialog>
      );
    }
    render(<Fallback />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('region', { name: 'Settings' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('region')).toBeNull();
  });
});
