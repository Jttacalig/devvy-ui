import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: ReactNode;
  description?: ReactNode;
}
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, description, children, className, 'aria-describedby': describedBy, ...props },
  ref,
) {
  const id = useId();
  return (
    <fieldset
      {...props}
      ref={ref}
      className={cx('dvy-fieldset', className)}
      aria-describedby={[describedBy, description ? id : ''].filter(Boolean).join(' ') || undefined}
    >
      <legend>{legend}</legend>
      {description && (
        <p id={id} className="dvy-field-description">
          {description}
        </p>
      )}
      <div className="dvy-fieldset-content">{children}</div>
    </fieldset>
  );
});
