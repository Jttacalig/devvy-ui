import { forwardRef, type FieldsetHTMLAttributes } from 'react';
import { RadioGroup } from './RadioGroup';
export interface RatingProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  required?: boolean;
}
export const Rating = forwardRef<HTMLFieldSetElement, RatingProps>(function Rating(
  { label, max = 5, value, defaultValue, onValueChange, ...props },
  ref,
) {
  const count = Number.isFinite(max) ? Math.max(1, Math.min(10, Math.floor(max))) : 5;
  return (
    <RadioGroup
      {...props}
      ref={ref}
      label={label}
      className={['dvy-rating', props.className].filter(Boolean).join(' ')}
      orientation="horizontal"
      value={value === undefined ? undefined : String(value)}
      defaultValue={defaultValue === undefined ? undefined : String(defaultValue)}
      onValueChange={(v) => onValueChange?.(Number(v))}
      items={Array.from({ length: count }, (_, i) => ({
        value: String(i + 1),
        label: (
          <>
            <span aria-hidden="true">{'★'.repeat(i + 1)}</span>
            <span className="dvy-sr-only">
              {i + 1} of {count} stars
            </span>
          </>
        ),
      }))}
    />
  );
});
