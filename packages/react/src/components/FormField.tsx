import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
}
export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  controlId?: string;
  children: (props: FieldControlProps) => ReactNode;
}
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, description, error, required, controlId, children, className, ...props },
  ref,
) {
  const generated = useId();
  const id = controlId ?? generated + '-control';
  const describedBy =
    [description ? id + '-help' : '', error ? id + '-error' : ''].filter(Boolean).join(' ') ||
    undefined;
  return (
    <div {...props} ref={ref} className={cx('dvy-form-field', className)} data-invalid={!!error}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {description && (
        <p id={id + '-help'} className="dvy-field-description">
          {description}
        </p>
      )}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        required,
      })}
      {error && (
        <p id={id + '-error'} className="dvy-field-error">
          {error}
        </p>
      )}
    </div>
  );
});
