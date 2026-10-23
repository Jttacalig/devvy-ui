'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type DialogHTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { Button } from './Button';
import { cx } from '../lib/cx';

export interface DialogProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title' | 'onClose' | 'children'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Explicit invoker for browsers that do not focus pointer-clicked buttons. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  closeLabel?: string;
}

/** Native modal behavior; unsupported browsers receive an explicitly nonmodal inline panel. */
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    initialFocusRef,
    returnFocusRef,
    closeLabel = 'Close dialog',
    className,
    onCancel,
    ...props
  },
  ref,
) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const returnOverride = useRef(returnFocusRef);
  const previouslyOpen = useRef(false);
  const programmaticCloses = useRef(0);
  const [nativeRevision, setNativeRevision] = useState(0);
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    returnOverride.current = returnFocusRef;
  }, [returnFocusRef]);
  function restoreFocus() {
    const target = returnOverride.current?.current ?? returnFocus.current;
    if (target?.isConnected) target.focus();
  }

  useEffect(() => {
    const wasOpen = previouslyOpen.current;
    if (open && !previouslyOpen.current)
      returnFocus.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previouslyOpen.current = open;
    if (!supported) {
      if (open) initialFocusRef?.current?.focus();
      else if (wasOpen) restoreFocus();
      return;
    }
    const element = dialog.current;
    if (!element) return;
    if (!open) {
      if (element.open) {
        programmaticCloses.current++;
        element.close();
      }
      if (wasOpen) restoreFocus();
      return;
    }
    if (typeof element.showModal !== 'function') {
      setSupported(false);
      return;
    }
    if (!element.open) {
      element.showModal();
      initialFocusRef?.current?.focus();
    }
  }, [open, supported, initialFocusRef, nativeRevision]);

  useEffect(() => {
    const element = dialog.current;
    return () => {
      if (element?.open) {
        programmaticCloses.current++;
        element.close();
        restoreFocus();
      }
    };
  }, []);

  const content = (
    <>
      <div className="dvy-dialog-header">
        <div>
          <h2 id={`${id}-title`} className="dvy-dialog-title">
            {title}
          </h2>
          {description && (
            <p id={`${id}-description`} className="dvy-dialog-description">
              {description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-label={closeLabel}
          onClick={() => onOpenChange(false)}
        >
          ×
        </Button>
      </div>
      <div className="dvy-dialog-content">{children}</div>
    </>
  );

  if (!supported)
    return open ? (
      <section
        aria-labelledby={`${id}-title`}
        className={cx('dvy-dialog dvy-dialog-inline', className)}
      >
        <p className="dvy-dialog-fallback-note">This browser displays this panel inline.</p>
        {content}
      </section>
    ) : null;

  return (
    <dialog
      {...props}
      className={cx('dvy-dialog', className)}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onCancel={(event) => {
        onCancel?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        if (programmaticCloses.current) {
          programmaticCloses.current--;
          return;
        }
        if (open) {
          onOpenChange(false);
          setNativeRevision((previous) => previous + 1);
        }
      }}
      ref={(element) => {
        dialog.current = element;
        if (typeof ref === 'function') ref(element);
        else if (ref) ref.current = element;
      }}
    >
      {content}
    </dialog>
  );
});
