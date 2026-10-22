import { forwardRef, useEffect, useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
import { useReset, useValue } from '../lib/widgets';
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface ComboboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'children'
  > {
  label: string;
  options: readonly ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  allowCustom?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    options,
    value,
    defaultValue = '',
    onValueChange,
    allowCustom = false,
    loading = false,
    emptyMessage = 'No matching options',
    name,
    required,
    disabled,
    className,
    ...props
  },
  ref,
) {
  const [selected, setSelected] = useValue(value, defaultValue, onValueChange);
  const selectedLabel = allowCustom
    ? selected
    : (options.find((o) => o.value === selected)?.label ?? '');
  const [query, setQuery] = useState(selectedLabel),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(-1);
  const internal = useRef(false);
  const id = useId(),
    input = useRef<HTMLInputElement>(null),
    root = useRef<HTMLDivElement>(null);
  const matches = options.filter((o) =>
    o.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  useEffect(() => {
    if (internal.current) {
      internal.current = false;
      return;
    }
    setQuery(selectedLabel);
  }, [selectedLabel]);
  useReset(input, () => {
    setSelected(defaultValue);
    setQuery(
      allowCustom ? defaultValue : (options.find((o) => o.value === defaultValue)?.label ?? ''),
    );
    setOpen(false);
  });
  useEffect(() => {
    input.current?.setCustomValidity(
      required && !allowCustom && !options.some((o) => o.value === selected && !o.disabled)
        ? 'Choose an available option.'
        : '',
    );
  }, [required, allowCustom, options, selected]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setSelected(option.value);
    setQuery(option.label);
    setOpen(false);
    setActive(-1);
    input.current?.focus();
  };
  return (
    <div className="dvy-combobox" ref={root}>
      <input
        {...props}
        ref={(node) => {
          input.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="combobox"
        aria-label={label}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-activedescendant={
          open && active >= 0 && matches[active] ? id + '-' + active : undefined
        }
        className={cx('dvy-input', className)}
        disabled={disabled}
        required={required}
        value={query}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          setActive(-1);
          if (allowCustom) setSelected(next);
          else if (selected) {
            internal.current = true;
            setSelected('');
          }
        }}
        onFocus={(event) => {
          props.onFocus?.(event);
          if (!props.readOnly) setOpen(true);
        }}
        onBlur={(event) => {
          props.onBlur?.(event);
          if (!root.current?.contains(event.relatedTarget as Node)) {
            setOpen(false);
            if (!allowCustom) setQuery(selectedLabel);
          }
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (event.defaultPrevented || event.nativeEvent.isComposing || props.readOnly) return;
          const enabled = matches.flatMap((o, i) => (o.disabled ? [] : [i]));
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
            const index = enabled.indexOf(active);
            setActive(
              enabled[
                index < 0
                  ? event.key === 'ArrowDown'
                    ? 0
                    : enabled.length - 1
                  : (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length
              ] ?? -1,
            );
          } else if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            setQuery(selectedLabel);
          } else if (event.key === 'Enter' && open && active >= 0 && matches[active]) {
            event.preventDefault();
            choose(matches[active]);
          }
        }}
      />
      {name && (
        <input type="hidden" name={name} value={selected} disabled={disabled} form={props.form} />
      )}
      {open && !props.readOnly && (
        <div
          className="dvy-combobox-options"
          id={id}
          role="listbox"
          aria-label={label}
          aria-busy={loading}
        >
          {matches.map((option, index) => (
            <div
              key={option.value}
              role="option"
              aria-selected={selected === option.value}
              aria-disabled={option.disabled || undefined}
              id={id + '-' + index}
              data-active={active === index}
              className="dvy-combobox-option"
              onPointerDown={(event) => {
                event.preventDefault();
                choose(option);
              }}
            >
              {option.label}
            </div>
          ))}
          {(loading || !matches.length) && (
            <p role="status">{loading ? 'Loading options…' : emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
});
