import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface ColorPickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue'> {
  label: string;
  value?: string;
  defaultValue?: string;
}
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(function ColorPicker(
  { label, className, ...props },
  ref,
) {
  return (
    <input
      aria-label={label}
      {...props}
      ref={ref}
      type="color"
      className={cx('dvy-color-picker', className)}
    />
  );
});
