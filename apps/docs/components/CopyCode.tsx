'use client';
import { useState } from 'react';
import { Button } from '@devvy-ui/react';
export function CopyCode({ code, label = 'Code sample' }: { code: string; label?: string }) {
  const [status, setStatus] = useState('');
  return (
    <div className="code-block">
      <pre tabIndex={0} role="region" aria-label={label}>
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Copy ${label.toLowerCase()}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setStatus('Copied');
          } catch {
            setStatus('Select and copy the code manually.');
          }
        }}
      >
        Copy
      </Button>
      <span role="status" className="copy-status">
        {status}
      </span>
    </div>
  );
}
