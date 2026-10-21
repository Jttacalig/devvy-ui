import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, htmlFor, children, ...props },
  ref,
) {
  return (
    <label ref={ref} htmlFor={htmlFor} className={cx('dvy-label', className)} {...props}>
      {children}
    </label>
  );
});
