import { forwardRef, type FormHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  errorSummary?: ReactNode;
}
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, errorSummary, children, ...props },
  ref,
) {
  return (
    <form {...props} ref={ref} className={cx('dvy-form', className)}>
      {errorSummary && (
        <div role="alert" className="dvy-form-errors">
          {errorSummary}
        </div>
      )}
      {children}
    </form>
  );
});
