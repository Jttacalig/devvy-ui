import { forwardRef, useEffect, useRef, useState } from 'react';
import { Button, type ButtonProps } from './Button';
import { cx } from '../lib/cx';
export interface CopyButtonProps extends ButtonProps {
  text: string;
  onCopyResult?: (success: boolean) => void;
}
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { text, onCopyResult, onClick, children = 'Copy', loading, className, ...props },
  ref,
) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ text: string; success: boolean }>();
  const pending = useRef(false);
  const alive = useRef(true);
  const manual = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (result && !result.success) {
      manual.current?.focus();
      manual.current?.select();
    }
  }, [result]);
  const current = result?.text === text ? result : undefined;
  return (
    <span className="dvy-copy-control">
      <Button
        {...props}
        ref={ref}
        loading={loading || busy}
        className={cx('dvy-copy-button', className)}
        onClick={async (event) => {
          onClick?.(event);
          if (event.defaultPrevented || pending.current) return;
          pending.current = true;
          setBusy(true);
          let success = false;
          try {
            await navigator.clipboard.writeText(text);
            success = true;
          } catch {
            /* Expose a keyboard-accessible manual copy path. */
          }
          pending.current = false;
          if (!alive.current) return;
          setBusy(false);
          setResult({ text, success });
          onCopyResult?.(success);
        }}
      >
        {current?.success ? 'Copied' : children}
      </Button>
      <span className="dvy-sr-only" role="status">
        {current
          ? current.success
            ? 'Text copied.'
            : 'Copy unavailable. Select the text below and copy manually.'
          : ''}
      </span>
      {current && !current.success && (
        <textarea
          ref={manual}
          className="dvy-input dvy-copy-fallback"
          aria-label="Copy this text manually"
          readOnly
          value={text}
        />
      )}
    </span>
  );
});
