'use client';
import { forwardRef, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'aria-label'> {
  label: string;
  brand: ReactNode;
  actions?: ReactNode;
  menuLabel?: string;
}
/** Responsive disclosure navigation. Links keep native Tab and browser navigation behavior. */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { label, brand, actions, menuLabel = 'Menu', children, className, onKeyDown, ...props },
  ref,
) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    // Escape bubbles from links and buttons; the nav itself is never made focusable.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      className={cx('dvy-navbar', className)}
      data-open={open || undefined}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && event.key === 'Escape' && open) {
          event.preventDefault();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <div className="dvy-navbar-brand">{brand}</div>
      <button
        ref={trigger}
        type="button"
        className="dvy-navbar-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d={open ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'} />
        </svg>
        {menuLabel}
      </button>
      <div id={id} className="dvy-navbar-content">
        <div className="dvy-navbar-links">{children}</div>
        {actions && <div className="dvy-navbar-actions">{actions}</div>}
      </div>
    </nav>
  );
});
