import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Dialog, type DialogProps } from './Dialog';
export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  onSelect: () => void;
}
export interface CommandPaletteProps extends Omit<DialogProps, 'children'> {
  items: readonly CommandItem[];
  placeholder?: string;
}
export const CommandPalette = forwardRef<HTMLDialogElement, CommandPaletteProps>(
  function CommandPalette({ items, placeholder = 'Search commands…', ...props }, ref) {
    const [query, setQuery] = useState(''),
      [active, setActive] = useState(0),
      input = useRef<HTMLInputElement>(null),
      id = useId(),
      filtered = items.filter((item) =>
        item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      );
    const enabled = filtered.flatMap((item, i) => (item.disabled ? [] : [i])),
      current = enabled.includes(active) ? active : enabled[0];
    useEffect(() => {
      if (!props.open) {
        setQuery('');
        setActive(0);
      }
    }, [props.open]);
    return (
      <Dialog
        {...props}
        ref={ref}
        initialFocusRef={input}
        className={['dvy-command-palette', props.className].filter(Boolean).join(' ')}
      >
        <input
          ref={input}
          className="dvy-input"
          aria-label="Search commands"
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={props.open}
          aria-controls={id}
          aria-activedescendant={current === undefined ? undefined : id + '-' + current}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              const at = enabled.indexOf(current);
              setActive(
                enabled[
                  (at + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length
                ] ?? 0,
              );
            } else if (event.key === 'Enter' && current !== undefined) {
              event.preventDefault();
              const action = filtered[current];
              if (action && !action.disabled) {
                props.onOpenChange(false);
                action.onSelect();
              }
            }
          }}
        />
        <div id={id} role="listbox" aria-label="Commands">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              id={id + '-' + i}
              role="option"
              aria-selected={i === current}
              aria-disabled={item.disabled || undefined}
              className="dvy-command-option"
              onPointerDown={(e) => {
                e.preventDefault();
                if (!item.disabled) {
                  props.onOpenChange(false);
                  item.onSelect();
                }
              }}
            >
              <strong>{item.label}</strong>
              {item.description && <small>{item.description}</small>}
            </div>
          ))}
          {!filtered.length && <p role="status">No matching commands.</p>}
        </div>
      </Dialog>
    );
  },
);
