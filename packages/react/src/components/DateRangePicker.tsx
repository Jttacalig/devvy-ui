import { forwardRef, useId, useEffect, useRef, type FieldsetHTMLAttributes } from 'react';
import { DatePicker } from './DatePicker';
import { useReset, useValue } from '../lib/widgets';
export interface DateRangePickerProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  value?: readonly [string, string];
  defaultValue?: readonly [string, string];
  onValueChange?: (range: readonly [string, string]) => void;
  min?: string;
  max?: string;
  required?: boolean;
}
export const DateRangePicker = forwardRef<HTMLFieldSetElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      label,
      value,
      defaultValue = ['', ''],
      onValueChange,
      min,
      max,
      required,
      name,
      disabled,
      className,
      ...props
    },
    ref,
  ) {
    const id = useId();
    const [range, setRange] = useValue(value, defaultValue, onValueChange),
      start = useRef<HTMLInputElement>(null),
      end = useRef<HTMLInputElement>(null),
      node = useRef<HTMLFieldSetElement>(null);
    useReset(node, () => setRange(defaultValue));
    useEffect(() => {
      end.current?.setCustomValidity(
        range[0] && range[1] && range[1] < range[0] ? 'End date must follow the start date.' : '',
      );
    }, [range]);
    return (
      <fieldset
        {...props}
        disabled={disabled}
        ref={(el) => {
          node.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        className={['dvy-date-range', className].filter(Boolean).join(' ')}
      >
        <legend>{label}</legend>
        <label htmlFor={id + '-start'}>
          Start date
          <DatePicker
            id={id + '-start'}
            ref={start}
            label={label + ' start date'}
            value={range[0]}
            min={min}
            max={max}
            required={required}
            name={name ? name + '-start' : undefined}
            form={props.form}
            onChange={(e) => setRange([e.target.value, range[1]])}
          />
        </label>
        <label htmlFor={id + '-end'}>
          End date
          <DatePicker
            id={id + '-end'}
            ref={end}
            label={label + ' end date'}
            value={range[1]}
            min={range[0] || min}
            max={max}
            required={required}
            name={name ? name + '-end' : undefined}
            form={props.form}
            onChange={(e) => setRange([range[0], e.target.value])}
          />
        </label>
      </fieldset>
    );
  },
);
