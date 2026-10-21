'use client';

import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'role'> {
  /** A visual mixed state. Supply checked/defaultChecked independently for form submission. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, indeterminate = false, onChange, ...props },
  ref,
) {
  const input = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      {...props}
      type="checkbox"
      className={cx('dvy-checkbox', className)}
      onChange={(event) => {
        event.currentTarget.indeterminate = indeterminate;
        onChange?.(event);
      }}
      aria-checked={indeterminate ? 'mixed' : props['aria-checked']}
      ref={(element) => {
        input.current = element;
        if (typeof ref === 'function') ref(element);
        else if (ref) ref.current = element;
      }}
    />
  );
});
