'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Dialog, Input } from '@devvy-ui/react';
import { InterfaceIcon } from './InterfaceIcon';

export function SiteSearch({
  items,
}: {
  items: readonly { name: string; slug: string; description: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const id = useId();
  const router = useRouter();
  const commands = useMemo(
    () => [
      ...[
        ['Getting started', '/ui/getting-started', 'Installation and framework setup'],
        ['Components', '/ui/components', 'Explore all 100 components'],
        ['Playground', '/ui/playground', 'Customize CSS, HTML and source'],
        ['Themes', '/ui/themes', 'Colors, typography and density'],
        ['Font collection', '/ui/fonts', 'Preview modern, self-hosted typefaces'],
        ['DEVVY GLASS', '/ui/glass', 'The optional adaptive glass material'],
        ['MCP developer tools', '/ui/mcp', 'Version-matched context for your coding assistant'],
      ].map(([label, href, description]) => ({
        id: href,
        label,
        href,
        description,
        kind: 'Guide',
      })),
      ...items.map(({ name, slug, description }) => ({
        id: slug,
        label: name,
        href: `/ui/components/${slug}`,
        description,
        kind: 'Component',
      })),
    ],
    [items],
  );
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const normalized = query.toLowerCase().trim();
  const score = (label: string) =>
    label.toLowerCase() === normalized
      ? 0
      : label.toLowerCase().startsWith(normalized)
        ? 1
        : label.toLowerCase().includes(normalized)
          ? 2
          : 3;
  const matches = terms.length
    ? commands
        .filter((item) =>
          terms.every((term) =>
            `${item.label} ${item.href} ${item.description}`.toLowerCase().includes(term),
          ),
        )
        .sort((a, b) => score(a.label) - score(b.label))
    : commands.filter((item) => item.kind === 'Guide');
  const visible = matches.slice(0, 12);
  const current = visible.length ? Math.min(active, visible.length - 1) : undefined;
  function showSearch() {
    setActive(0);
    setOpen(true);
  }
  function choose(index: number) {
    const item = visible[index];
    if (item) {
      setOpen(false);
      router.push(item.href);
    }
  }
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest('input, textarea, select'))
      )
        return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setActive(0);
        setOpen(true);
      }
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    if (open) input.current?.select();
  }, [open]);
  useEffect(() => {
    if (open && current !== undefined)
      results.current
        ?.querySelector<HTMLElement>(`[data-search-index="${current}"]`)
        ?.scrollIntoView({ block: 'nearest' });
  }, [open, current, query]);
  return (
    <>
      <Button
        ref={trigger}
        variant="outline"
        className="site-search-trigger"
        aria-keyshortcuts="Control+K Meta+K"
        aria-label="Search documentation ⌘ / Ctrl K"
        aria-haspopup="dialog"
        onClick={showSearch}
      >
        <InterfaceIcon name="search" />
        <span>Search documentation</span>
        <kbd>⌘ / Ctrl K</kbd>
      </Button>
      <Dialog
        className="site-search-dialog"
        title={
          <span className="search-dialog-heading">
            <InterfaceIcon name="search" />
            Search DEVVY UI
          </span>
        }
        description="Find a component or guide."
        open={open}
        onOpenChange={setOpen}
        initialFocusRef={input}
        returnFocusRef={trigger}
        closeLabel="Close search"
      >
        <div className="search-input-row">
          <Input
            ref={input}
            id={`${id}-input`}
            role="combobox"
            aria-label="Search commands"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={`${id}-results`}
            aria-activedescendant={current === undefined ? undefined : `${id}-result-${current}`}
            aria-describedby={`${id}-help`}
            placeholder="What would you like to build?"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && visible.length) {
                event.preventDefault();
                setActive(
                  ((current ?? 0) + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) %
                    visible.length,
                );
              }
              if (event.key === 'Enter' && current !== undefined) {
                event.preventDefault();
                choose(current);
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                setOpen(false);
              }
            }}
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="search-clear"
              aria-label="Clear search"
              onClick={() => {
                setQuery('');
                setActive(0);
                input.current?.focus();
              }}
            >
              ×
            </Button>
          )}
        </div>
        <div className="search-results-heading">
          <span>{terms.length ? 'Search results' : 'Explore the documentation'}</span>
          <span>{terms.length ? `${matches.length} found` : `${items.length} components`}</span>
        </div>
        <div
          ref={results}
          id={`${id}-results`}
          className="site-search-results"
          role="listbox"
          aria-label="Commands"
        >
          {visible.map((item, index) => (
            <div
              key={item.id}
              id={`${id}-result-${index}`}
              role="option"
              tabIndex={-1}
              aria-selected={index === current}
              data-search-index={index}
              className="site-search-option"
              onPointerDown={(event) => {
                if (event.button === 0) event.preventDefault();
              }}
              onClick={() => choose(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  choose(index);
                }
              }}
            >
              <span className="search-result-icon" aria-hidden="true">
                <InterfaceIcon name={item.kind === 'Guide' ? 'navigation' : 'grid'} />
              </span>
              <span className="search-result-copy">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <span className="search-result-kind">{item.kind}</span>
              <span className="search-result-enter" aria-hidden="true">
                ↵
              </span>
            </div>
          ))}
          {!visible.length && (
            <div className="search-empty" role="status">
              <InterfaceIcon name="search" />
              <strong>No matching commands.</strong>
              <p>Try a component name or a task, such as “button” or “form”.</p>
            </div>
          )}
        </div>
        <div id={`${id}-help`} className="search-dialog-footer">
          <span>
            {matches.length > 12
              ? 'Showing the first 12. Refine your search.'
              : 'Built with DEVVY UI'}
          </span>
          <span>
            <kbd>↑ ↓</kbd> navigate <kbd>↵</kbd> open <kbd>esc</kbd> close
          </span>
        </div>
      </Dialog>
    </>
  );
}
