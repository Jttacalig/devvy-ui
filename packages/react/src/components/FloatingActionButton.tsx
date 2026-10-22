import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from './IconButton';
export interface FloatingActionButtonProps extends IconButtonProps {
  position?: 'start' | 'end';
}
export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  function FloatingActionButton({ position = 'end', ...props }, ref) {
    return (
      <IconButton
        {...props}
        ref={ref}
        data-position={position}
        className={['dvy-fab', props.className].filter(Boolean).join(' ')}
      />
    );
  },
);
