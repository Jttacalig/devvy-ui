import { forwardRef, type InputHTMLAttributes } from 'react';
export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { label, className, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      type="time"
      aria-label={label}
      className={['dvy-input dvy-time-picker', className].filter(Boolean).join(' ')}
    />
  );
});
