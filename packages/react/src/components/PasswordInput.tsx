import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showLabel?: string;
  hideLabel?: string;
}
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { id, className, disabled, showLabel = 'Show password', hideLabel = 'Hide password', ...props },
    ref,
  ) {
    const generated = useId();
    const controlId = id ?? generated;
    const [revealed, setRevealed] = useState(false);
    return (
      <span className="dvy-password-control">
        <input
          {...props}
          ref={ref}
          id={controlId}
          disabled={disabled}
          type={revealed ? 'text' : 'password'}
          className={cx('dvy-input', 'dvy-password-input', className)}
        />
        <button
          className="dvy-password-toggle"
          type="button"
          disabled={disabled}
          aria-controls={controlId}
          aria-pressed={revealed}
          aria-label={revealed ? hideLabel : showLabel}
          onClick={() => setRevealed((value) => !value)}
        >
          {revealed ? 'Hide' : 'Show'}
        </button>
      </span>
    );
  },
);
