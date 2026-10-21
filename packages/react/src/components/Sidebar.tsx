import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
  label: string;
}
/** Composable route navigation; use aria-current="page" on the active native link. */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { label, className, ...props },
  ref,
) {
  return <nav {...props} ref={ref} aria-label={label} className={cx('dvy-sidebar', className)} />;
});
