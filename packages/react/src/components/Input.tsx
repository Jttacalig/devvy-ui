import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return <input ref={ref} type={type} className={cx('dvy-input', className)} {...props} />;
});
