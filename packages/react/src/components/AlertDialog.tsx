import { forwardRef, type ReactNode } from 'react';
import { Dialog, type DialogProps } from './Dialog';
export interface AlertDialogProps extends DialogProps {
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  pending?: boolean;
  children?: ReactNode;
}
export const AlertDialog = forwardRef<HTMLDialogElement, AlertDialogProps>(function AlertDialog(
  { confirmLabel, onConfirm, cancelLabel = 'Cancel', pending = false, children, ...props },
  ref,
) {
  return (
    <Dialog
      {...props}
      ref={ref}
      role="alertdialog"
      className={['dvy-alert-dialog', props.className].filter(Boolean).join(' ')}
    >
      {children}
      <div className="dvy-dialog-actions">
        <button
          type="button"
          className="dvy-button"
          data-variant="outline"
          disabled={pending}
          onClick={() => props.onOpenChange(false)}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="dvy-button"
          data-tone="danger"
          disabled={pending}
          aria-busy={pending || undefined}
          onClick={onConfirm}
        >
          {pending ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
});
