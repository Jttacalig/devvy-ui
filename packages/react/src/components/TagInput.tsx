import { forwardRef, useRef, useState, type InputHTMLAttributes } from 'react';
import { useReset, useValue } from '../lib/widgets';
export interface TagInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (tags: string[]) => void;
  maxTags?: number;
}
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    label,
    value,
    defaultValue = [],
    onValueChange,
    maxTags = 20,
    name,
    disabled,
    readOnly,
    className,
    ...props
  },
  ref,
) {
  const [tags, setTags] = useValue<readonly string[]>(
      value,
      defaultValue,
      onValueChange ? (next) => onValueChange([...next]) : undefined,
    ),
    [draft, setDraft] = useState(''),
    [error, setError] = useState(''),
    node = useRef<HTMLInputElement>(null);
  useReset(node, () => {
    setTags(defaultValue);
    setDraft('');
    setError('');
  });
  const add = (text: string) => {
    const additions = text
      .split(/[,\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
    const next = [...new Set([...tags, ...additions])];
    if (next.length > maxTags) {
      setError('Use at most ' + maxTags + ' tags.');
      return;
    }
    setTags(next);
    setDraft('');
    setError('');
  };
  return (
    <div className="dvy-tag-input">
      <ul aria-label={label + ' tags'}>
        {tags.map((tag) => (
          <li key={tag}>
            <span>{tag}</span>
            <button
              type="button"
              disabled={disabled || readOnly}
              aria-label={'Remove ' + tag}
              onClick={() => setTags(tags.filter((v) => v !== tag))}
            >
              ×
            </button>
            {name && (
              <input type="hidden" name={name} form={props.form} value={tag} disabled={disabled} />
            )}
          </li>
        ))}
      </ul>
      <input
        {...props}
        ref={(el) => {
          node.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        aria-label={label}
        disabled={disabled}
        readOnly={readOnly}
        className={['dvy-input', className].filter(Boolean).join(' ')}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (event.defaultPrevented || event.nativeEvent.isComposing || readOnly) return;
          if ((event.key === 'Enter' || event.key === ',') && draft.trim()) {
            event.preventDefault();
            add(draft);
          } else if (event.key === 'Backspace' && !draft && tags.length) {
            event.preventDefault();
            setTags(tags.slice(0, -1));
          }
        }}
        onPaste={(event) => {
          props.onPaste?.(event);
          if (
            !event.defaultPrevented &&
            !readOnly &&
            /[,\n]/.test(event.clipboardData.getData('text'))
          ) {
            event.preventDefault();
            add(event.clipboardData.getData('text'));
          }
        }}
      />
      <p role="status" className="dvy-field-error">
        {error}
      </p>
    </div>
  );
});
