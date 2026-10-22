import { forwardRef, type MeterHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface MeterProps
  extends Omit<
    MeterHTMLAttributes<HTMLMeterElement>,
    'value' | 'min' | 'max' | 'low' | 'high' | 'optimum'
  > {
  label: string;
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
}
export const Meter = forwardRef<HTMLMeterElement, MeterProps>(function Meter(
  { label, value, min = 0, max = 1, low, high, optimum, className, ...props },
  ref,
) {
  let lower = Number.isFinite(min) ? min : 0;
  let upper = Number.isFinite(max) && max > lower ? max : lower + 1;
  if (!Number.isFinite(upper) || upper <= lower) {
    lower = 0;
    upper = 1;
  }
  const clamp = (number: number) => Math.min(upper, Math.max(lower, number));
  const safeLow = low !== undefined && Number.isFinite(low) ? clamp(low) : lower;
  const safeHigh =
    high !== undefined && Number.isFinite(high) ? Math.max(safeLow, clamp(high)) : upper;
  return (
    <meter
      aria-label={label}
      {...props}
      ref={ref}
      className={cx('dvy-meter', className)}
      min={lower}
      max={upper}
      low={safeLow}
      high={safeHigh}
      optimum={optimum !== undefined && Number.isFinite(optimum) ? clamp(optimum) : undefined}
      value={Number.isFinite(value) ? clamp(value) : lower}
    />
  );
});
