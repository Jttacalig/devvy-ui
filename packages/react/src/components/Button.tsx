import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  tone?: 'brand' | 'neutral' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Disables activation while preserving the button's accessible name. */
  loading?: boolean;
}

/** Accessible native button. Defaults to type="button" to avoid accidental form submissions. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'solid',
    tone = 'brand',
    size = 'md',
    type = 'button',
    loading = false,
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('dvy-button', className)}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <span className="dvy-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});
