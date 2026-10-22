import { forwardRef } from 'react';
import { Button, type ButtonProps } from './Button';
import { cx } from '../lib/cx';
export interface IconButtonProps extends ButtonProps {
  label: string;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, children, ...props },
  ref,
) {
  return (
    <Button aria-label={label} {...props} ref={ref} className={cx('dvy-icon-button', className)}>
      <span aria-hidden="true">{children}</span>
    </Button>
  );
});
