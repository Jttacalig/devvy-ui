import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, min = 0, max = 100, step = 1, className, ...props },
  ref,
) {
  return (
    <input
      aria-label={label}
      {...props}
      type="range"
      ref={ref}
      min={min}
      max={max}
      step={step}
      className={cx('dvy-slider', className)}
    />
  );
});
