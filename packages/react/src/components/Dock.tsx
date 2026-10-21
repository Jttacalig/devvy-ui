import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface DockProps extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
  label: string;
  /** Reserve content space when pinning a dock to the viewport. */
  floating?: boolean;
}

/** Native navigation, with ordinary links or buttons. No custom keyboard model to learn. */
export const Dock = forwardRef<HTMLElement, DockProps>(function Dock(
  { label, floating = false, className, ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      data-floating={floating || undefined}
      className={cx('dvy-dock', className)}
    />
  );
});
