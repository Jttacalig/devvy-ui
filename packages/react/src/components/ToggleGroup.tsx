import { forwardRef, useRef, type FieldsetHTMLAttributes } from 'react';
import { useReset, useValue } from '../lib/widgets';
export interface ToggleGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  items: readonly { value: string; label: string; disabled?: boolean }[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
}
export const ToggleGroup = forwardRef<HTMLFieldSetElement, ToggleGroupProps>(function ToggleGroup(
  {
    label,
    items,
    value,
    defaultValue = [],
    onValueChange,
    multiple = false,
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
    node = useRef<HTMLFieldSetElement>(null);
  useReset(node, () => setSelected(defaultValue));
  return (
    <fieldset
      {...props}
      disabled={disabled}
      ref={(el) => {
        node.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      className={['dvy-toggle-group', className].filter(Boolean).join(' ')}
    >
      <legend>{label}</legend>
      <div>
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={disabled || item.disabled}
            aria-pressed={selected.includes(item.value)}
            onClick={() =>
              setSelected(
                selected.includes(item.value)
                  ? selected.filter((v) => v !== item.value)
                  : multiple
                    ? [...selected, item.value]
                    : [item.value],
              )
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      {selected.map((v) => (
        <input key={v} type="hidden" name={name} value={v} disabled={disabled} form={props.form} />
      ))}
    </fieldset>
  );
});
