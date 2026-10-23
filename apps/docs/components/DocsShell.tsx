'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Navigation } from './Navigation';

export function DocsShell({
  items,
  children,
}: {
  items: readonly { name: string; slug: string; description: string }[];
  children: ReactNode;
}) {
  const path = usePathname();
  const landing = path === '/ui';
  const playground = path === '/ui/playground';
  return (
    <div
      className="docs-shell"
      data-layout={landing ? 'landing' : playground ? 'playground' : 'documentation'}
    >
      {!landing && !playground && <Navigation items={items} />}
      <main id="content" className="main-content">
        {children}
      </main>
    </div>
  );
}
