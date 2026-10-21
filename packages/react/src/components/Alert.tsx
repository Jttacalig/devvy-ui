import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'neutral' | 'brand' | 'danger';
  variant?: 'soft' | 'outline';
  /** Decorative icon; put essential information in the message. */
  icon?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, tone = 'neutral', variant = 'soft', role = 'status', icon, children, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role={role}
      className={cx('dvy-alert', 'dvy-glass-surface', className)}
      data-tone={tone}
      data-variant={variant}
    >
      <span className="dvy-alert-icon" aria-hidden="true">
        {icon ?? (
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" focusable="false">
            <circle cx="10" cy="10" r="8" />
            <path d="M10 9v5m0-9v2" strokeWidth="1.5" />
          </svg>
        )}
      </span>
      <div className="dvy-alert-content">{children}</div>
    </div>
  );
});
