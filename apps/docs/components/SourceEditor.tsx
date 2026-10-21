'use client';

import { useEffect, useId, useState } from 'react';
import { Button } from '@devvy-ui/react/button';
import { downloadText } from '../lib/download';

export function SourceEditor({
  source,
  filename,
  license,
}: {
  source: string;
  filename: string;
  license: string;
}) {
  const id = useId();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [code, setCode] = useState(source);
  const [status, setStatus] = useState('');
  return (
    <div className="source-editor">
      <div className="editor-heading">
        <span>{filename}</span>
        <span className="editor-language">REACT / TSX</span>
      </div>
      <label className="sr-only" htmlFor={id}>
        Edit {filename} source
      </label>
      <textarea
        id={id}
        aria-describedby={`${id}-help`}
        className="code-input"
        disabled={!ready}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
      <p id={`${id}-help`} className="editor-help">
        Edit your own copy. Downloaded source uses your changes; the component preview above uses
        the shipped version. Run the source installer first to include shared helpers.
      </p>
      <div className="editor-actions">
        <Button
          size="sm"
          disabled={!ready}
          onClick={() => downloadText(filename, `/*\n${license}*/\n${code}`, 'text/typescript')}
        >
          Download TSX
        </Button>
        <Button
          size="sm"
          disabled={!ready}
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`/*\n${license}*/\n${code}`);
              setStatus('Source copied.');
            } catch {
              setStatus('Select the source and copy it manually.');
            }
          }}
        >
          Copy source
        </Button>
        <Button
          size="sm"
          disabled={!ready}
          variant="ghost"
          onClick={() => {
            setCode(source);
            setStatus('Original source restored.');
          }}
        >
          Restore original
        </Button>
        <span role="status">{status}</span>
      </div>
    </div>
  );
}
