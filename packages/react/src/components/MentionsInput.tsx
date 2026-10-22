import { forwardRef, useId, useRef, useState, type TextareaHTMLAttributes } from 'react';
import { useReset, useValue } from '../lib/widgets';
export interface MentionOption {
  id: string;
  label: string;
  handle: string;
  disabled?: boolean;
}
export interface MentionsInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  options: readonly MentionOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (text: string) => void;
}
export const MentionsInput = forwardRef<HTMLTextAreaElement, MentionsInputProps>(
  function MentionsInput(
    { label, options, value, defaultValue = '', onValueChange, className, ...props },
    ref,
  ) {
    const [text, setText] = useValue(value, defaultValue, onValueChange),
      [caret, setCaret] = useState(0),
      [active, setActive] = useState(0),
      [dismissed, setDismissed] = useState(false),
      input = useRef<HTMLTextAreaElement>(null),
      id = useId();
    useReset(input, () => {
      setText(defaultValue);
      setCaret(0);
      setDismissed(true);
    });
    const match = /(?:^|\s)@([\w-]*)$/.exec(text.slice(0, caret)),
      filtered = match
        ? options.filter(
            (o) =>
              /^[\w-]+$/.test(o.handle) &&
              o.label.toLocaleLowerCase().includes(match[1].toLocaleLowerCase()),
          )
        : [],
      open = !!match && !dismissed && !props.disabled && !props.readOnly,
      enabled = filtered.flatMap((o, i) => (o.disabled ? [] : [i])),
      current = enabled.includes(active) ? active : enabled[0];
    const choose = (option: MentionOption) => {
      if (!match || option.disabled) return;
      const start = caret - match[1].length - 1,
        next = text.slice(0, start) + '@' + option.handle + ' ' + text.slice(caret),
        end = start + option.handle.length + 2;
      setText(next);
      setCaret(end);
      setDismissed(true);
      requestAnimationFrame(() => {
        input.current?.focus();
        input.current?.setSelectionRange(end, end);
      });
    };
    return (
      <div className="dvy-mentions">
        <textarea
          {...props}
          ref={(node) => {
            input.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          aria-label={label}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls={open ? id : undefined}
          aria-activedescendant={open && current !== undefined ? id + '-' + current : undefined}
          className={['dvy-textarea', className].filter(Boolean).join(' ')}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setCaret(e.target.selectionStart);
            setDismissed(false);
            setActive(0);
          }}
          onSelect={(event) => {
            props.onSelect?.(event);
            setCaret(event.currentTarget.selectionStart);
          }}
          onKeyDown={(event) => {
            props.onKeyDown?.(event);
            if (event.defaultPrevented || event.nativeEvent.isComposing || !open) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setActive(
                enabled[
                  (enabled.indexOf(current) +
                    (event.key === 'ArrowDown' ? 1 : -1) +
                    enabled.length) %
                    enabled.length
                ] ?? 0,
              );
            } else if (event.key === 'Enter' && current !== undefined) {
              event.preventDefault();
              choose(filtered[current]);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setDismissed(true);
            }
          }}
          onBlur={(event) => {
            props.onBlur?.(event);
            setDismissed(true);
          }}
        />
        <span role="status" className="dvy-sr-only">
          {open
            ? filtered.length + ' suggestions. Use arrow keys and Enter to insert a mention.'
            : ''}
        </span>
        {open && (
          <div role="listbox" id={id} aria-label="Mention suggestions">
            {filtered.map((option, i) => (
              <div
                role="option"
                key={option.id}
                id={id + '-' + i}
                aria-selected={i === current}
                aria-disabled={option.disabled || undefined}
                className="dvy-combobox-option"
                onPointerDown={(event) => {
                  event.preventDefault();
                  choose(option);
                }}
              >
                {option.label} <small>@{option.handle}</small>
              </div>
            ))}
            {!filtered.length && <p role="status">No matching people.</p>}
          </div>
        )}
      </div>
    );
  },
);
