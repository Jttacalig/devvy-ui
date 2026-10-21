'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['Documentation', '/ui/docs'],
  ['Components', '/ui/components'],
  ['Glass', '/ui/glass'],
  ['Playground', '/ui/playground'],
] as const;

export function HeaderNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation">
      {links.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
