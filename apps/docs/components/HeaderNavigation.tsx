'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@devvy-ui/react';

const links = [
  ['Docs', '/ui/docs'],
  ['Components', '/ui/components'],
  ['Playground', '/ui/playground'],
  ['Glass', '/ui/glass'],
  ['MCP', '/ui/mcp'],
] as const;

export function HeaderNavigation() {
  const pathname = usePathname();
  return (
    <Navbar
      key={pathname}
      label="Main navigation"
      brand={null}
      menuLabel="Menu"
      className="site-navigation"
    >
      {links.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </Navbar>
  );
}
