import { act, createElement, useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import axe from 'axe-core';
import * as UI from '../index';
import { createCompletionFixture } from './completion-fixture.mjs';
import { dateShift, moveItem, safeURL, validDate } from '../lib/widgets';

describe('completion primitives', () => {
  it('preserves owned values when an application cancels a native form reset', async () => {
    const { container } = render(
      <form onReset={(event) => event.preventDefault()}>
        <UI.TagInput label="Tags" name="tags" defaultValue={['design']} />
        <button type="reset">Cancel reset</button>
      </form>,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Tags' }), 'build{Enter}');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel reset' }));
    expect(new FormData(container.querySelector('form')!).getAll('tags')).toEqual([
      'design',
      'build',
    ]);
  });
  it('hydrates all 50 additions with stable ids and structural accessibility', async () => {
    const tree = createCompletionFixture(UI, createElement),
      host = document.createElement('div');
    host.innerHTML = renderToString(tree);
    document.body.append(host);
    const before = [...host.querySelectorAll('[id]')].map((node) => node.id);
    const recover = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(host, tree, { onRecoverableError: recover });
    });
    expect(host.querySelectorAll('[data-fixture]').length).toBe(50);
    expect([...host.querySelectorAll('[id]')].map((node) => node.id)).toEqual(before);
    expect(new Set(before).size).toBe(before.length);
    expect(recover).not.toHaveBeenCalled();
    const result = await axe.run(host, { rules: { 'color-contrast': { enabled: false } } });
    expect(
      result.violations.map((v) => v.id + ': ' + v.nodes.map((n) => n.html).join('\n')),
    ).toEqual([]);
    await act(async () => root!.unmount());
    host.remove();
  });
  it('uses safe URL schemes and deterministic civil-date/reorder helpers', () => {
    expect(safeURL('java\nscript:alert(1)')).toBeUndefined();
    expect(safeURL('data:text/html,script')).toBeUndefined();
    expect(safeURL('https://example.com/image.svg', true)).toBe('https://example.com/image.svg');
    expect(safeURL('/ui/docs')).toBe('/ui/docs');
    expect(safeURL('mailto:hello@example.com')).toBeTruthy();
    expect(validDate('2024-02-29')).toBe(true);
    expect(validDate('2025-02-29')).toBe(false);
    expect(dateShift('2024-02-28', 1)).toBe('2024-02-29');
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveItem(['a'], -1, 0)).toEqual(['a']);
  });
  it('filters and selects combobox options without submitting uncommitted text', async () => {
    const change = vi.fn();
    const { container } = render(
      <form>
        <UI.Combobox
          label="Framework"
          name="framework"
          defaultValue="react"
          options={[
            { value: 'react', label: 'React' },
            { value: 'next', label: 'Next.js' },
            { value: 'locked', label: 'Locked', disabled: true },
          ]}
          onValueChange={change}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Framework' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Next');
    expect(input).toHaveProperty('value', 'Next');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(new FormData(container.querySelector('form')!).get('framework')).toBe('next');
    await userEvent.click(screen.getByText('Reset'));
    expect(input).toHaveProperty('value', 'React');
  });
  it('allows autocomplete free text and preserves IME Enter', async () => {
    const change = vi.fn();
    render(<UI.Autocomplete label="City" options={[]} onValueChange={change} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'Manila');
    expect(input).toHaveProperty('value', 'Manila');
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(change).toHaveBeenLastCalledWith('Manila');
  });
  it('submits native multi-selection, retains filtered choices and resets', async () => {
    const { container } = render(
      <form>
        <UI.MultiSelect
          label="Tools"
          name="tools"
          defaultValue={['react']}
          options={[
            { value: 'react', label: 'React' },
            { value: 'vite', label: 'Vite' },
            { value: 'off', label: 'Locked', disabled: true },
          ]}
        />
        <button type="reset">Reset</button>
      </form>,
    );
    await userEvent.click(screen.getByText('1 selected'));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Vite' }));
    await userEvent.type(screen.getByRole('searchbox'), 'React');
    expect(new FormData(container.querySelector('form')!).getAll('tools')).toEqual([
      'react',
      'vite',
    ]);
    await userEvent.click(screen.getByText('Reset'));
    expect(new FormData(container.querySelector('form')!).getAll('tools')).toEqual(['react']);
  });
  it('normalizes formatted OTP paste and resets the code', async () => {
    const complete = vi.fn();
    render(
      <form>
        <UI.OTPInput label="Code" name="code" onComplete={complete} />
        <button type="reset">Reset</button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: 'Code' });
    await userEvent.click(input);
    await userEvent.paste('123-456');
    expect(input).toHaveProperty('value', '123456');
    expect(complete).toHaveBeenCalledWith('123456');
    await userEvent.click(screen.getByText('Reset'));
    expect(input).toHaveProperty('value', '');
  });
  it('prevents slider crossing and validates a reversed date interval', () => {
    render(
      <>
        <UI.RangeSlider label="Budget" defaultValue={[20, 80]} />
        <UI.DateRangePicker label="Trip" defaultValue={['2026-10-23', '2026-10-20']} />
      </>,
    );
    fireEvent.change(screen.getByRole('slider', { name: 'Budget minimum' }), {
      target: { value: '95' },
    });
    expect(screen.getByRole('slider', { name: 'Budget minimum' })).toHaveProperty('value', '80');
    expect((screen.getByLabelText('Trip end date') as HTMLInputElement).validity.customError).toBe(
      true,
    );
  });
  it('adds pasted tags, removes them and preserves form values/reset', async () => {
    const { container } = render(
      <form>
        <UI.TagInput label="Tags" name="tags" defaultValue={['design']} maxTags={3} />
        <button type="reset">Reset</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('textbox', { name: 'Tags' }));
    await userEvent.paste('react,css');
    expect(new FormData(container.querySelector('form')!).getAll('tags')).toEqual([
      'design',
      'react',
      'css',
    ]);
    await userEvent.click(screen.getByRole('button', { name: 'Remove react' }));
    expect(screen.queryByRole('button', { name: 'Remove react' })).toBeNull();
    await userEvent.click(screen.getByText('Reset'));
    expect(new FormData(container.querySelector('form')!).getAll('tags')).toEqual(['design']);
  });
  it('uses pressed toggles and native rating choices', async () => {
    render(
      <>
        <UI.ToggleGroup
          label="Formatting"
          multiple
          items={[
            { value: 'bold', label: 'Bold' },
            { value: 'italic', label: 'Italic' },
          ]}
        />
        <UI.Rating label="Rating" />
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
    await userEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(screen.getByRole('button', { name: 'Bold' }).getAttribute('aria-pressed')).toBe('true');
    await userEvent.click(screen.getByRole('radio', { name: '3 of 5 stars' }));
    expect(screen.getByRole('radio', { name: '3 of 5 stars' })).toHaveProperty('checked', true);
  });
  it('rejects invalid files and clears the native input', async () => {
    const accepted = vi.fn(),
      rejected = vi.fn();
    render(
      <UI.FileUpload
        label="Files"
        accept=".txt"
        maxSize={4}
        onFilesChange={accepted}
        onReject={rejected}
      />,
    );
    const input = screen.getByLabelText('Files') as HTMLInputElement;
    await userEvent.upload(input, new File(['ok'], 'notes.txt', { type: 'text/plain' }));
    expect(accepted.mock.lastCall?.[0][0].name).toBe('notes.txt');
    await userEvent.upload(input, new File(['too large'], 'notes.txt', { type: 'text/plain' }));
    expect(rejected).toHaveBeenCalled();
    expect(input.value).toBe('');
  });
  it('navigates a calendar and respects disabled bounds', async () => {
    function Demo() {
      const [month, setMonth] = useState('2026-10');
      return (
        <UI.Calendar
          label="Release"
          month={month}
          onMonthChange={setMonth}
          min="2026-10-10"
          max="2026-11-20"
        />
      );
    }
    render(<Demo />);
    expect(screen.getByRole('button', { name: 'Friday, October 9, 2026' })).toHaveProperty(
      'disabled',
      true,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('November 2026')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next month' })).toHaveProperty('disabled', true);
  });
  it('expands a tree, selects children and skips disabled nodes', async () => {
    const change = vi.fn();
    render(
      <UI.TreeView
        label="Files"
        onValueChange={change}
        items={[
          { id: 'src', label: 'Source', children: [{ id: 'app', label: 'App.tsx' }] },
          { id: 'off', label: 'Locked', disabled: true },
          { id: 'readme', label: 'README.md' },
        ]}
      />,
    );
    const tree = screen.getByRole('tree');
    const source = within(tree).getByRole('treeitem', { name: 'Source' });
    await act(async () => source.focus());
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{Enter}');
    expect(change).toHaveBeenCalledWith('app');
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('treeitem', { name: 'README.md' }));
  });
  it('resizes panels with the keyboard within bounds', async () => {
    render(
      <UI.ResizablePanels label="Split" min={30} max={70}>
        {[<p key="a">Files</p>, <p key="b">Editor</p>]}
      </UI.ResizablePanels>,
    );
    const handle = screen.getByRole('separator', { name: 'Split' });
    handle.focus();
    await userEvent.keyboard('{End}');
    expect(handle.getAttribute('aria-valuenow')).toBe('70');
    await userEvent.keyboard('{Home}');
    expect(handle.getAttribute('aria-valuenow')).toBe('30');
  });
  it('sorts, filters and pages native table records', async () => {
    render(
      <UI.DataTable
        label="Projects"
        rows={[
          { id: 'b', name: 'Beta' },
          { id: 'a', name: 'Alpha' },
          { id: 'c', name: 'Charlie' },
        ]}
        getRowId={(r) => r.id}
        columns={[{ key: 'name', label: 'Name', render: (r) => r.name, sortValue: (r) => r.name }]}
        filterText={(r) => r.name}
        pageSize={2}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Name/ }));
    expect(screen.getAllByRole('cell').map((n) => n.textContent)).toEqual(['Alpha', 'Beta']);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getAllByRole('cell')[0].textContent).toBe('Charlie');
    await userEvent.type(screen.getByRole('searchbox'), 'missing');
    expect(screen.getByText('No matching records.')).toBeTruthy();
  });
  it('keeps Markdown HTML inert and unsafe links non-navigable', () => {
    const { container } = render(
      <UI.MarkdownViewer
        source={
          '## Notes\n<script>alert(1)</script>\n[bad](javascript:alert)\n**bold** _italic_ `code`'
        }
      />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(screen.queryByRole('link', { name: 'bad' })).toBeNull();
    expect(container.querySelector('strong')?.textContent).toBe('bold');
  });
  it('formats selected Markdown and restores the editor on native reset', async () => {
    render(
      <form>
        <UI.RichTextEditor label="Notes" name="notes" defaultValue="Orbit" />
        <button type="reset">Reset</button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: 'Notes' }) as HTMLTextAreaElement;
    input.focus();
    input.setSelectionRange(0, 5);
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(input.value).toBe('**Orbit**');
    await userEvent.click(screen.getByText('Reset'));
    expect(input.value).toBe('Orbit');
  });
  it('navigates manual slides and exposes the virtual-list full view', async () => {
    render(
      <>
        <UI.Carousel
          label="Studies"
          slides={[
            <button key="a">Slide one action</button>,
            <button key="b">Slide two action</button>,
          ]}
        />
        <UI.VirtualList
          label="Records"
          items={Array.from({ length: 100 }, (_, i) => ({ id: String(i) }))}
          getKey={(r) => r.id}
          renderItem={(r) => 'Record ' + r.id}
          height={96}
        />
      </>,
    );
    expect(screen.queryByRole('button', { name: 'Slide two action' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(screen.getByRole('button', { name: 'Slide two action' })).toBeTruthy();
    expect(screen.getAllByRole('listitem').length).toBeLessThan(20);
    await userEvent.click(screen.getByRole('button', { name: 'Show all items' }));
    expect(screen.getAllByRole('listitem').length).toBe(100);
  });
  it('retries load-more errors and suppresses concurrent requests', async () => {
    let reject: (error: Error) => void = () => {};
    const load = vi.fn(
      () =>
        new Promise<void>((_, no) => {
          reject = no;
        }),
    );
    render(
      <UI.InfiniteScroll label="Feed" hasMore onLoadMore={load}>
        <p>First record</p>
      </UI.InfiniteScroll>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(load).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Loading…' })).toHaveProperty('disabled', true);
    await act(async () => reject(new Error('offline')));
    expect(screen.getByRole('button', { name: 'Retry loading' })).toBeTruthy();
  });
  it('moves sortable items and kanban cards using native controls', async () => {
    const sort = vi.fn(),
      board = vi.fn();
    render(
      <>
        <UI.SortableList
          label="Order"
          items={[
            { id: 'a', label: 'Design' },
            { id: 'b', label: 'Build' },
          ]}
          onItemsChange={sort}
        />
        <UI.KanbanBoard
          label="Board"
          columns={[
            { id: 'todo', label: 'To do' },
            { id: 'done', label: 'Done' },
          ]}
          items={[{ id: 'a', title: 'Review', columnId: 'todo' }]}
          onItemsChange={board}
        />
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Move Design down' }));
    expect(sort.mock.lastCall?.[0].map((v: UI.SortableItem) => v.id)).toEqual(['b', 'a']);
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Move Review to column' }),
      'done',
    );
    expect(board.mock.lastCall?.[0][0].columnId).toBe('done');
  });
  it('inserts plain-text mentions at the caret and dismisses suggestions', async () => {
    render(
      <UI.MentionsInput
        label="Comment"
        options={[{ id: 'ada', label: 'Ada Rivera', handle: 'ada' }]}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Comment' });
    await userEvent.type(input, 'Hello @a');
    await userEvent.keyboard('{Enter}');
    expect(input).toHaveProperty('value', 'Hello @ada ');
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
