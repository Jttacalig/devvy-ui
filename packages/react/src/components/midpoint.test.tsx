import { act, createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import axe from 'axe-core';
import * as UI from '../index';

const items = [
  { value: 'a', label: 'Solo' },
  { value: 'b', label: 'Team' },
  { value: 'c', label: 'Unavailable', disabled: true },
];
describe('midpoint behavior', () => {
  it('recovers failed avatar images and accepts a changed source', () => {
    const failed = vi.fn();
    const ref = createRef<HTMLSpanElement>();
    const { container, rerender } = render(
      <UI.Avatar ref={ref} name="Ada Rivera" src="/one.png" imageProps={{ onError: failed }} />,
    );
    fireEvent.error(container.querySelector('img')!);
    expect(screen.getByRole('img', { name: 'Ada Rivera' })).toBe(ref.current);
    expect(ref.current?.textContent).toBe('AR');
    expect(failed).toHaveBeenCalledOnce();
    rerender(<UI.Avatar name="Ada Rivera" src="/two.png" />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/two.png');
  });
  it('reports avatar overflow without mounting the hidden people', () => {
    render(
      <UI.AvatarGroup label="Contributors" max={1}>
        <UI.Avatar name="Ada Rivera" />
        <UI.Avatar name="Bea Cruz" />
        <UI.Avatar name="Cal Lee" />
      </UI.AvatarGroup>,
    );
    expect(screen.getByRole('group', { name: 'Contributors' })).toBeTruthy();
    expect(screen.getByRole('img', { name: '2 more people' })).toBeTruthy();
    expect(screen.queryByRole('img', { name: 'Bea Cruz' })).toBeNull();
  });
  it('keeps icon actions named, non-submit and disabled while loading', async () => {
    const action = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <UI.IconButton ref={ref} label="Star project" onClick={action}>
        <span>★</span>
      </UI.IconButton>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Star project' }));
    expect(action).toHaveBeenCalledOnce();
    expect(ref.current?.type).toBe('button');
    rerender(
      <UI.IconButton label="Star project" loading onClick={action}>
        ★
      </UI.IconButton>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Star project' }));
    expect(action).toHaveBeenCalledOnce();
  });
  it('supports single and controlled multiple accordion expansion without toggling disabled items', async () => {
    const options = [
      { value: 'one', title: 'First', content: <button>Inside first</button> },
      { value: 'two', title: 'Second', content: 'Two' },
      { value: 'off', title: 'Disabled', content: 'Off', disabled: true },
    ];
    const { container, rerender } = render(<UI.Accordion items={options} defaultValue={['one']} />);
    await userEvent.click(screen.getByText('Second'));
    expect([...container.querySelectorAll('details')].map((node) => node.open)).toEqual([
      false,
      true,
      false,
    ]);
    await userEvent.click(screen.getByText('Disabled'));
    expect(container.querySelectorAll('details')[2].open).toBe(false);
    const change = vi.fn();
    rerender(<UI.Accordion items={options} multiple value={['one']} onValueChange={change} />);
    await userEvent.click(screen.getByText('Second'));
    expect(change).toHaveBeenCalledWith(['one', 'two']);
    expect(container.querySelectorAll('details')[1].open).toBe(false);
  });
  it('renders bounded pagination for huge counts, supports links and handles no pages', async () => {
    const change = vi.fn();
    const { rerender } = render(
      <UI.Pagination page={500000} count={1000000} onPageChange={change} />,
    );
    expect(screen.getAllByRole('button').length).toBeLessThanOrEqual(9);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(change).toHaveBeenCalledWith(500001);
    rerender(<UI.Pagination page={1} count={4} getHref={(page) => '/projects?page=' + page} />);
    expect(screen.getByRole('link', { name: 'Page 2' }).getAttribute('href')).toBe(
      '/projects?page=2',
    );
    expect(screen.getByRole('link', { name: 'Page 1' }).getAttribute('aria-current')).toBe('page');
    rerender(<UI.Pagination page={1} count={0} onPageChange={change} />);
    expect(screen.getByText('No pages')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
  it.each([UI.RadioGroup, UI.SegmentedControl])(
    'preserves native radio form data, reset and disabled choices',
    async (Component) => {
      const { container } = render(
        <form>
          <Component label="Plan" name="plan" items={items} defaultValue="a" required />
          <button type="reset">Reset</button>
        </form>,
      );
      await userEvent.click(screen.getByRole('radio', { name: 'Team' }));
      expect(new FormData(container.querySelector('form')!).get('plan')).toBe('b');
      await userEvent.click(screen.getByRole('radio', { name: 'Unavailable' }));
      expect((screen.getByRole('radio', { name: 'Team' }) as HTMLInputElement).checked).toBe(true);
      await userEvent.click(screen.getByText('Reset'));
      expect((screen.getByRole('radio', { name: 'Solo' }) as HTMLInputElement).checked).toBe(true);
    },
  );
  it('associates external-form radios and reflects controlled values', async () => {
    function Controlled() {
      const [value, setValue] = useState('a');
      return (
        <UI.RadioGroup
          label="Plan"
          form="external"
          name="plan"
          items={items}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(
      <>
        <form id="external" />
        <Controlled />
      </>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Team' }));
    expect(new FormData(document.getElementById('external') as HTMLFormElement).get('plan')).toBe(
      'b',
    );
  });
  it('connects field labels, help and error text and preserves native fieldset disable/reset', async () => {
    const { container } = render(
      <UI.Form>
        <UI.Fieldset legend="Account">
          <UI.FormField
            label="Email"
            description="Workspace address"
            error="Enter an email"
            required
          >
            {(field) => <UI.Input {...field} type="email" name="email" />}
          </UI.FormField>
        </UI.Fieldset>
        <button type="reset">Reset</button>
      </UI.Form>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' }) as HTMLInputElement;
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(
      input
        .getAttribute('aria-describedby')
        ?.split(' ')
        .map((id) => document.getElementById(id)?.textContent),
    ).toEqual(['Workspace address', 'Enter an email']);
    expect(container.querySelector('form')?.checkValidity()).toBe(false);
    await userEvent.type(input, 'ada@example.com');
    expect(container.querySelector('form')?.checkValidity()).toBe(true);
    await userEvent.click(screen.getByText('Reset'));
    expect(input.value).toBe('');
  });
  it('preserves native numeric constraints, search events, color values and refs', async () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <UI.NumberInput ref={ref} aria-label="Seats" min={1} max={5} defaultValue={3} />
        <UI.SearchField label="Projects" defaultValue="Orbit" />
        <UI.ColorPicker label="Accent" defaultValue="#087565" />
        <UI.Slider label="Volume" defaultValue={35} />
      </>,
    );
    ref.current!.value = '8';
    expect(ref.current!.checkValidity()).toBe(false);
    await userEvent.clear(screen.getByRole('searchbox', { name: 'Projects' }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Projects' }), 'Studio');
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('Studio');
    expect((screen.getByLabelText('Accent') as HTMLInputElement).value).toBe('#087565');
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('35');
  });
  it('reveals passwords without submitting or changing the value and respects disabled', async () => {
    const ref = createRef<HTMLInputElement>();
    const submit = vi.fn((event) => event.preventDefault());
    const { rerender } = render(
      <form onSubmit={submit}>
        <UI.PasswordInput ref={ref} aria-label="Password" defaultValue="secret" />
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(ref.current?.type).toBe('text');
    expect(ref.current?.value).toBe('secret');
    expect(submit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(ref.current?.type).toBe('password');
    rerender(<UI.PasswordInput disabled aria-label="Password" />);
    expect(
      (screen.getByRole('button', { name: 'Show password' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
  it('normalizes meter and circular progress without nonfinite markup', () => {
    const { container } = render(
      <>
        <UI.Meter
          label="Storage"
          value={Infinity}
          min={Number.MAX_VALUE}
          max={NaN}
          low={Infinity}
          high={-3}
        />
        <UI.CircularProgress label="Export" value={150} max={100} showValue />
        <UI.CircularProgress label="Connecting" value={NaN} />
      </>,
    );
    const meter = screen.getByRole('meter') as HTMLMeterElement;
    expect(meter.value).toBe(0);
    expect(meter.max).toBe(1);
    expect(screen.getByRole('progressbar', { name: 'Export' }).getAttribute('aria-valuenow')).toBe(
      '100',
    );
    expect(
      screen.getByRole('progressbar', { name: 'Connecting' }).hasAttribute('aria-valuenow'),
    ).toBe(false);
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });
  it('keeps collapsibles controlled and disabled summaries closed', async () => {
    const change = vi.fn();
    const ref = createRef<HTMLDetailsElement>();
    const { rerender } = render(
      <UI.Collapsible ref={ref} summary="Advanced" open={false} onOpenChange={change}>
        <UI.Input aria-label="Alias" />
      </UI.Collapsible>,
    );
    await userEvent.click(screen.getByText('Advanced'));
    expect(change).toHaveBeenCalledWith(true);
    expect(ref.current?.open).toBe(false);
    rerender(
      <UI.Collapsible ref={ref} summary="Advanced" disabled>
        Content
      </UI.Collapsible>,
    );
    await userEvent.click(screen.getByText('Advanced'));
    expect(ref.current?.open).toBe(false);
  });
  it('provides table, description, empty and loading semantics independently of color', () => {
    render(
      <>
        <UI.Table caption="Activity">
          <tbody>
            <tr>
              <th scope="row">Orbit</th>
              <td>Ready</td>
            </tr>
          </tbody>
        </UI.Table>
        <UI.DescriptionList items={[{ term: 'Plan', description: 'Team' }]} />
        <UI.EmptyState title="No projects" headingLevel={2} description="Create one to begin.">
          <button>Create</button>
        </UI.EmptyState>
        <UI.StatusIndicator label="Connected" tone="brand" />
        <UI.Spinner label="Loading data" />
      </>,
    );
    expect(
      within(screen.getByRole('table', { name: 'Activity' })).getByRole('rowheader', {
        name: 'Orbit',
      }),
    ).toBeTruthy();
    expect(screen.getByRole('term').textContent).toBe('Plan');
    expect(screen.getByRole('definition').textContent).toBe('Team');
    expect(screen.getByRole('region', { name: 'No projects' })).toBeTruthy();
    expect(screen.getByText('Connected')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Loading data');
  });
  it('copies exactly once, honors cancellation and exposes selected manual text on failure', async () => {
    const user = userEvent.setup();
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    const result = vi.fn();
    const { rerender } = render(<UI.CopyButton text="my token" onCopyResult={result} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(write).toHaveBeenCalledWith('my token');
    expect(result).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy();
    rerender(<UI.CopyButton text="new token" onClick={(event) => event.preventDefault()} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(write).toHaveBeenCalledOnce();
    write.mockRejectedValueOnce(new Error('Permission denied'));
    rerender(<UI.CopyButton text="manual token" onCopyResult={result} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    const manual = screen.getByRole('textbox', {
      name: 'Copy this text manually',
    }) as HTMLTextAreaElement;
    expect(document.activeElement).toBe(manual);
    expect(manual.selectionEnd - manual.selectionStart).toBe('manual token'.length);
    expect(result).toHaveBeenLastCalledWith(false);
    write.mockRestore();
  });
  it('ignores a clipboard completion after unmount', async () => {
    const user = userEvent.setup();
    let complete!: () => void;
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        }),
    );
    const result = vi.fn();
    const { unmount } = render(<UI.CopyButton text="pending" onCopyResult={result} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    unmount();
    await act(async () => complete());
    expect(result).not.toHaveBeenCalled();
    write.mockRestore();
  });
});

export function MidpointFixture() {
  return (
    <main>
      <h1>Midpoint</h1>
      <h2>Preview</h2>
      <UI.Container>
        <UI.Stack>
          <UI.Grid>
            <UI.Avatar name="Ada Rivera" />
            <UI.AvatarGroup label="Team">
              <UI.Avatar name="Bea Cruz" />
            </UI.AvatarGroup>
            <UI.AspectRatio>
              <span>Media area</span>
            </UI.AspectRatio>
          </UI.Grid>
          <UI.Typography as="h3" variant="heading">
            Workspace
          </UI.Typography>
          <UI.IconButton label="Star">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"
                fill="none"
                stroke="currentColor"
              />
            </svg>
          </UI.IconButton>
        </UI.Stack>
      </UI.Container>
      <UI.Accordion items={[{ value: 'one', title: 'Ownership', content: 'Your code.' }]} />
      <UI.Pagination page={1} count={3} getHref={(page) => '?page=' + page} />
      <UI.Form>
        <UI.Fieldset legend="Profile">
          <UI.FormField label="Email" description="Workspace address">
            {(field) => <UI.Input {...field} type="email" />}
          </UI.FormField>
          <UI.NumberInput aria-label="Seats" />
          <UI.PasswordInput aria-label="Password" />
          <UI.SearchField label="Projects" />
          <UI.ColorPicker label="Accent" />
          <UI.Slider label="Volume" />
          <UI.RadioGroup label="Plan" name="plan" items={items} />
          <UI.SegmentedControl label="Billing" name="billing" items={items} />
        </UI.Fieldset>
      </UI.Form>
      <UI.Table caption="Activity">
        <tbody>
          <tr>
            <th scope="row">Orbit</th>
            <td>Ready</td>
          </tr>
        </tbody>
      </UI.Table>
      <UI.CircularProgress label="Export" value={35} />
      <UI.Spinner label="Loading profile" />
      <UI.EmptyState title="Nothing here" />
      <UI.StatusIndicator label="Connected" />
      <UI.Collapsible summary="Advanced">More settings</UI.Collapsible>
      <UI.DescriptionList items={[{ term: 'Plan', description: 'Team' }]} />
      <UI.Meter label="Storage" value={0.4} />
      <UI.CopyButton text="theme token" />
    </main>
  );
}
it('renders and hydrates all 29 additions with stable IDs and structural axe coverage', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  host.innerHTML = renderToString(<MidpointFixture />);
  const ids = [...host.querySelectorAll('[id]')].map((element) => element.id);
  const errors = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  try {
    await act(async () => {
      root = hydrateRoot(host, <MidpointFixture />, { onRecoverableError: errors });
    });
    expect(errors).not.toHaveBeenCalled();
    expect([...host.querySelectorAll('[id]')].map((element) => element.id)).toEqual(ids);
    expect(
      (await axe.run(host, { rules: { 'color-contrast': { enabled: false } } })).violations,
    ).toEqual([]);
  } finally {
    await act(async () => root?.unmount());
    host.remove();
  }
});
