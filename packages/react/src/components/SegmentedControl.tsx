import { forwardRef } from 'react';
import { RadioGroup, type RadioGroupProps } from './RadioGroup';
import { cx } from '../lib/cx';
export type SegmentedControlProps = Omit<RadioGroupProps, 'orientation'>;
export const SegmentedControl = forwardRef<HTMLFieldSetElement, SegmentedControlProps>(
  function SegmentedControl({ className, ...props }, ref) {
    return (
      <RadioGroup
        {...props}
        ref={ref}
        orientation="horizontal"
        className={cx('dvy-segmented-control', className)}
      />
    );
  },
);
