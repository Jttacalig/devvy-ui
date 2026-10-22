import { forwardRef, useRef, useState, type DragEvent } from 'react';
import { FileUpload, type FileUploadProps } from './FileUpload';
export interface DropzoneProps extends FileUploadProps {
  description?: string;
}
export const Dropzone = forwardRef<HTMLInputElement, DropzoneProps>(function Dropzone(
  { description = 'Drop files here, or choose files below.', disabled, className, ...props },
  ref,
) {
  const input = useRef<HTMLInputElement>(null),
    [active, setActive] = useState(false),
    [error, setError] = useState('');
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActive(false);
    if (disabled || !input.current) return;
    try {
      const transfer = new DataTransfer();
      for (const file of Array.from(event.dataTransfer.files)) transfer.items.add(file);
      input.current.files = transfer.files;
      input.current.dispatchEvent(new Event('change', { bubbles: true }));
      setError('');
    } catch {
      setError('Use the file chooser to select these files.');
    }
  };
  return (
    <div
      className={['dvy-dropzone', className].filter(Boolean).join(' ')}
      data-active={active}
      data-disabled={disabled}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={drop}
    >
      <p>{description}</p>
      <FileUpload
        {...props}
        disabled={disabled}
        ref={(node) => {
          input.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
      />
      <p role="status">{error}</p>
    </div>
  );
});
