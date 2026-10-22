import { forwardRef, type HTMLAttributes } from 'react';
import { CopyButton } from './CopyButton';
export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  code: string;
  label?: string;
  language?: string;
  copyable?: boolean;
  lineNumbers?: boolean;
}
export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(function CodeBlock(
  {
    code,
    label = 'Code example',
    language = 'text',
    copyable = true,
    lineNumbers = false,
    className,
    ...props
  },
  ref,
) {
  return (
    <figure
      {...props}
      ref={ref}
      className={['dvy-code-block', className].filter(Boolean).join(' ')}
    >
      <figcaption>
        <span>
          {label} · {language}
        </span>
        {copyable && (
          <CopyButton text={code} size="sm" variant="outline" aria-label={'Copy ' + label}>
            Copy
          </CopyButton>
        )}
      </figcaption>
      <pre role="region" tabIndex={0} aria-label={label}>
        <code>
          {lineNumbers
            ? code.split('\n').map((line, i) => (
                <span className="dvy-code-line" key={i}>
                  <span aria-hidden="true" className="dvy-code-number">
                    {i + 1}
                  </span>
                  {line}
                  {'\n'}
                </span>
              ))
            : code}
        </code>
      </pre>
    </figure>
  );
});
