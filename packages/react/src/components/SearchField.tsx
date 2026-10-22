import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { label, className, enterKeyHint = 'search', ...props },
  ref,
) {
  return (
    <input
      aria-label={label}
      {...props}
      ref={ref}
      type="search"
      enterKeyHint={enterKeyHint}
      className={cx('dvy-input', 'dvy-search-field', className)}
    />
  );
});
