import { forwardRef, useRef, type InputHTMLAttributes } from 'react';
import { useReset, useValue } from '../lib/widgets';
export interface OTPInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'maxLength'
  > {
  label: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}
export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(function OTPInput(
  { label, length = 6, value, defaultValue = '', onValueChange, onComplete, className, ...props },
  ref,
) {
  const count = Number.isFinite(length) ? Math.max(1, Math.min(12, Math.floor(length))) : 6;
  const [code, setCode] = useValue(value, defaultValue, onValueChange),
    input = useRef<HTMLInputElement>(null);
  useReset(input, () => setCode(defaultValue));
  return (
    <input
      {...props}
      ref={(node) => {
        input.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      aria-label={label}
      className={['dvy-input dvy-otp-input', className].filter(Boolean).join(' ')}
      pattern={'[0-9]{' + count + '}'}
      maxLength={count}
      value={code}
      onPaste={(event) => {
        props.onPaste?.(event);
        if (event.defaultPrevented || props.readOnly) return;
        event.preventDefault();
        const next = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, count);
        setCode(next);
        if (next.length === count && next !== code) onComplete?.(next);
      }}
      onChange={(event) => {
        const next = event.target.value.replace(/\D/g, '').slice(0, count);
        setCode(next);
        if (next.length === count && next !== code) onComplete?.(next);
      }}
    />
  );
});
