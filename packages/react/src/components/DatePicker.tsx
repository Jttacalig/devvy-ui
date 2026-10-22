import { forwardRef, type InputHTMLAttributes } from 'react';
export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  { label, className, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      type="date"
      aria-label={label}
      className={['dvy-input dvy-date-picker', className].filter(Boolean).join(' ')}
    />
  );
});
