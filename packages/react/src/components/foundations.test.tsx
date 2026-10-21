import { describe, it, expect, vi } from 'vitest';
import { act, createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import axe from 'axe-core';
import { Select, Alert, Progress, Skeleton } from '../index';

describe('native selection', () => {
  it('preserves required validation, form data, reset and the select ref', async () => {
    const ref = createRef<HTMLSelectElement>();
    const { container } = render(
      <form>
        <label htmlFor="project">Project</label>
        <Select ref={ref} id="project" name="project" required defaultValue="">
          <option value="">Choose a project</option>
          <optgroup label="Active">
            <option value="orbit">Orbit</option>
          </optgroup>
        </Select>
        <button type="reset">Reset</button>
      </form>,
    );
    expect(ref.current?.checkValidity()).toBe(false);
    await userEvent.selectOptions(screen.getByLabelText('Project'), 'orbit');
    expect(new FormData(container.querySelector('form')!).get('project')).toBe('orbit');
    expect(ref.current?.checkValidity()).toBe(true);
    await userEvent.click(screen.getByText('Reset'));
    expect(ref.current?.value).toBe('');
  });
  it('supports controlled changes, disabled options and native multiple/size', async () => {
    function Controlled() {
      const [value, setValue] = useState(['a']);
      return (
        <Select
          aria-label="Members"
          multiple
          size={4}
          value={value}
          onChange={(event) =>
            setValue(Array.from(event.target.selectedOptions, (option) => option.value))
          }
        >
          <option value="a">Ada</option>
          <option value="b">Bea</option>
          <option value="c" disabled>
            Cal
          </option>
        </Select>
      );
    }
    const { container } = render(<Controlled />);
    const select = screen.getByRole('listbox') as HTMLSelectElement;
    await userEvent.selectOptions(select, ['b', 'c']);
    expect(Array.from(select.selectedOptions, (option) => option.value)).toEqual(['a', 'b']);
    expect(select.size).toBe(4);
    expect(container.querySelector('svg')).toBeNull();
  });
  it('forwards native attributes and does not activate when disabled', async () => {
    const change = vi.fn();
    render(
      <Select
        aria-label="Plan"
        disabled
        onChange={change}
        aria-invalid="true"
        className="custom"
        style={{ width: 200 }}
      >
        <option>Basic</option>
        <option>Team</option>
      </Select>,
    );
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await userEvent.selectOptions(select, 'Team');
    expect(change).not.toHaveBeenCalled();
    expect(select.value).toBe('Basic');
    expect(select.classList.contains('custom')).toBe(true);
    expect(select.style.width).toBe('200px');
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });
});

describe('feedback', () => {
  it('defaults to polite status, allows urgent alerts and composes actions', async () => {
    const action = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <Alert ref={ref}>
        Saved <button onClick={action}>Undo</button>
      </Alert>,
    );
    expect(screen.getByRole('status')).toBe(ref.current);
    await userEvent.click(screen.getByText('Undo'));
    expect(action).toHaveBeenCalledOnce();
    rerender(
      <Alert role="alert" tone="danger">
        Connection lost
      </Alert>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Connection lost');
  });
  it.each([
    [-5, 100, 0, 100],
    [200, 100, 100, 100],
    [3, 10, 3, 10],
    [20, 0, 20, 100],
    [20, Infinity, 20, 100],
    [20, NaN, 20, 100],
  ])('normalizes value %s and max %s', (value, max, expectedValue, expectedMax) => {
    const ref = createRef<HTMLProgressElement>();
    render(<Progress ref={ref} label="Upload" value={value} max={max} />);
    expect(ref.current?.value).toBe(expectedValue);
    expect(ref.current?.max).toBe(expectedMax);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBe(ref.current);
  });
  it.each([undefined, NaN, Infinity])(
    'omits invalid or absent values for indeterminate progress: %s',
    (value) => {
      render(<Progress label="Connecting" value={value} />);
      const progress = screen.getByRole('progressbar') as HTMLProgressElement;
      expect(progress.hasAttribute('value')).toBe(false);
      expect(progress.position).toBe(-1);
    },
  );
  it('keeps loading shapes decorative and customizable', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Skeleton
        ref={ref}
        variant="circle"
        animated={false}
        width={48}
        height="3rem"
        style={{ width: 56 }}
      />,
    );
    expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
    expect(ref.current?.getAttribute('data-animated')).toBe('false');
    expect(ref.current?.tabIndex).toBe(-1);
    expect(ref.current?.style.width).toBe('56px');
    expect(ref.current?.style.height).toBe('3rem');
  });
});

it('hydrates all four components without recoverable errors and passes structural axe checks', async () => {
  const tree = (
    <main>
      <h1>Foundations</h1>
      <Select aria-label="Team" defaultValue="a">
        <option value="a">Ada</option>
      </Select>
      <Alert>Ready to continue</Alert>
      <Progress label="Upload" value={42} />
      <Progress label="Connecting" />
      <section aria-busy="true" aria-label="Loading profile">
        <Skeleton />
      </section>
    </main>
  );
  const host = document.createElement('div');
  document.body.append(host);
  host.innerHTML = renderToString(tree);
  const errors = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(host, tree, { onRecoverableError: errors });
  });
  expect(errors).not.toHaveBeenCalled();
  expect(
    (await axe.run(host, { rules: { 'color-contrast': { enabled: false } } })).violations,
  ).toEqual([]);
  await act(async () => root.unmount());
  host.remove();
});
