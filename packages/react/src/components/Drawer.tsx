import { forwardRef } from 'react';
import { Dialog, type DialogProps } from './Dialog';
export interface DrawerProps extends DialogProps {
  side?: 'start' | 'end' | 'bottom';
}
export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer(
  { side = 'end', ...props },
  ref,
) {
  return (
    <Dialog
      {...props}
      ref={ref}
      data-side={side}
      className={['dvy-drawer', props.className].filter(Boolean).join(' ')}
    />
  );
});
