'use client';

import { useRef, useState } from 'react';
import { Button, Dialog } from '@devvy-ui/react';
import { supportMessage, supportUrl, supportWidgetUrl } from '../lib/support';

/** Landing-only enhancement. No third-party request until the visitor opens it. */
export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        ref={trigger}
        className="dvy-support-float"
        aria-label="Support DEVVY UI on Buy Me a Coffee"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Support independent development"
        onClick={() => setOpen(true)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 8h12v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4ZM17 9h1a3 3 0 0 1 0 6h-1M3 22h17M8 2v2m4-2v2m4-2v2" />
        </svg>
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        returnFocusRef={trigger}
        title="Support independent development"
        description={supportMessage}
        closeLabel="Close support"
        className="dvy-support-dialog"
      >
        <a className="dvy-support-direct" href={supportUrl} target="_blank" rel="noreferrer">
          Open Buy Me a Coffee <span aria-hidden="true">↗</span>
        </a>
        <p className="dvy-support-host">Contributions are handled by Buy Me a Coffee.</p>
        {open && (
          <iframe
            className="dvy-support-checkout"
            src={supportWidgetUrl}
            title="Buy Me a Coffee checkout for Jttacalig"
            allow="payment; publickey-credentials-get"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </Dialog>
    </>
  );
}
