import { forwardRef, useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { useReset } from '../lib/widgets';
export interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onReject?: (message: string) => void;
}
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    label,
    maxSize = 10 * 1024 * 1024,
    maxFiles = 10,
    onFilesChange,
    onReject,
    className,
    ...props
  },
  ref,
) {
  const [files, setFiles] = useState<File[]>([]),
    [error, setError] = useState(''),
    id = useId(),
    input = useRef<HTMLInputElement>(null);
  useReset(input, () => {
    setFiles([]);
    setError('');
    onFilesChange?.([]);
  });
  return (
    <div className="dvy-file-upload">
      <label htmlFor={props.id ?? id}>{label}</label>
      <input
        {...props}
        id={props.id ?? id}
        ref={(node) => {
          input.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="file"
        className={['dvy-file-input', className].filter(Boolean).join(' ')}
        aria-describedby={
          [props['aria-describedby'], error ? id + '-error' : undefined]
            .filter(Boolean)
            .join(' ') || undefined
        }
        aria-invalid={!!error || undefined}
        onChange={(event) => {
          const chosen = Array.from(event.target.files ?? []),
            types =
              props.accept
                ?.split(',')
                .map((v) => v.trim().toLowerCase())
                .filter(Boolean) ?? [];
          const invalid =
            chosen.length > (props.multiple ? maxFiles : 1) ||
            chosen.some(
              (file) =>
                file.size > maxSize ||
                (types.length &&
                  !types.some((type) =>
                    type.startsWith('.')
                      ? file.name.toLowerCase().endsWith(type)
                      : type.endsWith('/*')
                        ? file.type.startsWith(type.slice(0, -1))
                        : file.type === type,
                  )),
            );
          if (invalid) {
            const message =
              'Choose ' +
              (props.multiple ? 'up to ' + maxFiles + ' files' : 'one file') +
              ' matching the allowed types, each under ' +
              Math.round(maxSize / 1024) +
              ' KB.';
            setError(message);
            setFiles([]);
            event.target.value = '';
            onFilesChange?.([]);
            onReject?.(message);
            return;
          }
          setFiles(chosen);
          setError('');
          onFilesChange?.(chosen);
        }}
      />
      <p role="status" id={id + '-error'} className="dvy-field-error">
        {error}
      </p>
      {!!files.length && (
        <ul aria-label="Selected files">
          {files.map((file, i) => (
            <li key={file.name + '-' + i}>
              {file.name} · {Math.ceil(file.size / 1024)} KB
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
