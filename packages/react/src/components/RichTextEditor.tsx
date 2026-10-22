import { forwardRef, useId, useRef, type TextareaHTMLAttributes } from 'react';
import { MarkdownViewer } from './MarkdownViewer';
import { useReset, useValue } from '../lib/widgets';
export interface RichTextEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange'> {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (source: string) => void;
  preview?: boolean;
}
export const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  function RichTextEditor(
    { label, value, defaultValue = '', onValueChange, preview = true, className, ...props },
    ref,
  ) {
    const [text, setText] = useValue(value, defaultValue, onValueChange),
      input = useRef<HTMLTextAreaElement>(null),
      id = useId();
    useReset(input, () => setText(defaultValue));
    const format = (before: string, after: string) => {
      const node = input.current;
      if (!node) return;
      const start = node.selectionStart,
        end = node.selectionEnd;
      setText(text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end));
      requestAnimationFrame(() => {
        node.focus();
        node.setSelectionRange(start + before.length, end + before.length);
      });
    };
    return (
      <div className="dvy-rich-editor">
        <label htmlFor={props.id ?? id}>{label}</label>
        <div role="group" aria-label="Formatting" className="dvy-editor-toolbar">
          {[
            ['Bold', '**', '**'],
            ['Italic', '_', '_'],
            ['Heading', '## ', ''],
            ['List item', '- ', ''],
            ['Code', '`', '`'],
          ].map(([name, before, after]) => (
            <button
              type="button"
              key={name}
              disabled={props.disabled || props.readOnly}
              onClick={() => format(before, after)}
            >
              {name}
            </button>
          ))}
        </div>
        <textarea
          {...props}
          id={props.id ?? id}
          ref={(node) => {
            input.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className={['dvy-textarea', className].filter(Boolean).join(' ')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {preview && (
          <section aria-label="Formatted preview" className="dvy-editor-preview">
            <MarkdownViewer source={text} />
          </section>
        )}
      </div>
    );
  },
);
