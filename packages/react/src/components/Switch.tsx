import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'children'>;

/** A native checkbox retains form submission, reset and keyboard behavior. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, ...props },
  ref,
) {
  return (
    <input
      {...props}
      type="checkbox"
      role="switch"
      ref={ref}
      className={cx('dvy-switch', className)}
    />
  );
});
