import { forwardRef, useId, useRef, useState, type FieldsetHTMLAttributes } from 'react';
import { useReset, useValue } from '../lib/widgets';
import type { ComboboxOption } from './Combobox';
export interface MultiSelectProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  options: readonly ComboboxOption[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  searchable?: boolean;
}
export const MultiSelect = forwardRef<HTMLFieldSetElement, MultiSelectProps>(function MultiSelect(
  {
    label,
    options,
    value,
    defaultValue = [],
    onValueChange,
    searchable = true,
    name,
    disabled,
    className,
    ...props
  },
  ref,
) {
  const [selected, setSelected] = useValue<readonly string[]>(
      value,
      defaultValue,
      onValueChange ? (next) => onValueChange([...next]) : undefined,
    ),
    [query, setQuery] = useState(''),
    id = useId(),
    node = useRef<HTMLFieldSetElement>(null);
  useReset(node, () => {
    setSelected(defaultValue);
    setQuery('');
  });
  return (
    <fieldset
      {...props}
      ref={(el) => {
        node.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      disabled={disabled}
      className={['dvy-multi-select', className].filter(Boolean).join(' ')}
    >
      <legend>{label}</legend>
      <details>
        <summary>{selected.length ? selected.length + ' selected' : 'Choose options'}</summary>
        {searchable && (
          <input
            type="search"
            className="dvy-input"
            aria-label={'Filter ' + label}
            value={query}
            disabled={disabled}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        <div className="dvy-multi-options">
          {options.map((option, index) => (
            <label
              key={option.value}
              hidden={!option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())}
              htmlFor={id + '-' + index}
            >
              <input
                id={id + '-' + index}
                type="checkbox"
                name={name}
                form={props.form}
                disabled={disabled || option.disabled}
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={(e) =>
                  setSelected(
                    e.target.checked
                      ? [...selected, option.value]
                      : selected.filter((v) => v !== option.value),
                  )
                }
              />
              {option.label}
            </label>
          ))}
        </div>
        {!options.some((o) => o.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())) && (
          <p role="status">No matching options.</p>
        )}
      </details>
    </fieldset>
  );
});
