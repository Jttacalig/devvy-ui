import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { className, inputMode = 'decimal', ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      type="number"
      inputMode={inputMode}
      className={cx('dvy-input', 'dvy-number-input', className)}
    />
  );
});
