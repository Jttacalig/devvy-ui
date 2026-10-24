'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@devvy-ui/react';
import { SupportButton } from './SupportButton';

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
      <SupportButton className="dvy-support-menu" />
      <a
        className="dvy-header-mobile-resource"
        href="https://www.npmjs.com/package/@devvy-ui/react"
        target="_blank"
        rel="noreferrer"
      >
        npm <span aria-hidden="true">↗</span>
      </a>
      <a
        className="dvy-header-mobile-resource"
        href="https://github.com/Jttacalig/devvy-ui"
        target="_blank"
        rel="noreferrer"
      >
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </Navbar>
  );
}
