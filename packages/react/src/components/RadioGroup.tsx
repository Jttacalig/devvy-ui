import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface RadioItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}
export interface RadioGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'defaultValue'> {
  label: ReactNode;
  items: readonly RadioItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  required?: boolean;
}
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    label,
    items,
    value,
    defaultValue,
    onValueChange,
    name,
    orientation = 'vertical',
    required,
    disabled,
    form,
    className,
    ...props
  },
  ref,
) {
  const id = useId();
  if (new Set(items.map((item) => item.value)).size !== items.length)
    throw new Error('RadioGroup item values must be unique.');
  return (
    <fieldset
      {...props}
      ref={ref}
      name={name}
      form={form}
      disabled={disabled}
      className={cx('dvy-radio-group', className)}
      data-orientation={orientation}
    >
      <legend>{label}</legend>
      <div className="dvy-radio-items">
        {items.map((item, index) => (
          <label key={item.value} className="dvy-radio-option">
            <input
              type="radio"
              name={name ?? id}
              form={form}
              value={item.value}
              required={required}
              disabled={disabled || item.disabled}
              checked={value === undefined ? undefined : value === item.value}
              defaultChecked={value === undefined ? defaultValue === item.value : undefined}
              onChange={(event) => {
                if (event.target.checked) onValueChange?.(item.value);
              }}
              aria-describedby={item.description ? id + '-description-' + index : undefined}
            />
            <span>
              <span className="dvy-radio-label">{item.label}</span>
              {item.description && (
                <span className="dvy-radio-description" id={id + '-description-' + index}>
                  {item.description}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
});
