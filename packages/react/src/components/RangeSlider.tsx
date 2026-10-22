import { forwardRef, useRef, type FieldsetHTMLAttributes } from 'react';
import { useReset, useValue } from '../lib/widgets';
export interface RangeSliderProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  value?: readonly [number, number];
  defaultValue?: readonly [number, number];
  onValueChange?: (value: readonly [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}
export const RangeSlider = forwardRef<HTMLFieldSetElement, RangeSliderProps>(function RangeSlider(
  {
    label,
    value,
    defaultValue = [0, 100],
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    name,
    disabled,
    className,
    ...props
  },
  ref,
) {
  const low = Number.isFinite(min) ? min : 0,
    high = Number.isFinite(max) && max > low ? max : low + 100;
  const [range, setRange] = useValue(value, defaultValue, onValueChange),
    node = useRef<HTMLFieldSetElement>(null);
  const a = Math.max(low, Math.min(high, Number.isFinite(range[0]) ? range[0] : low)),
    b = Math.max(a, Math.min(high, Number.isFinite(range[1]) ? range[1] : high));
  useReset(node, () => setRange(defaultValue));
  return (
    <fieldset
      {...props}
      ref={(el) => {
        node.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      disabled={disabled}
      className={['dvy-range-slider', className].filter(Boolean).join(' ')}
    >
      <legend>{label}</legend>
      <label>
        Minimum <output>{a}</output>
        <input
          type="range"
          className="dvy-slider"
          aria-label={label + ' minimum'}
          name={name ? name + '-min' : undefined}
          form={props.form}
          min={low}
          max={high}
          step={step > 0 ? step : 1}
          value={a}
          onChange={(e) => setRange([Math.min(b, e.target.valueAsNumber), b])}
        />
      </label>
      <label>
        Maximum <output>{b}</output>
        <input
          type="range"
          className="dvy-slider"
          aria-label={label + ' maximum'}
          name={name ? name + '-max' : undefined}
          form={props.form}
          min={low}
          max={high}
          step={step > 0 ? step : 1}
          value={b}
          onChange={(e) => setRange([a, Math.max(a, e.target.valueAsNumber)])}
        />
      </label>
    </fieldset>
  );
});
