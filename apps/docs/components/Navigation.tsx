'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';
import { Input, Badge } from '@devvy-ui/react';
import { catalog } from '../lib/catalog';
import { InterfaceIcon } from './InterfaceIcon';

export function Navigation() {
  const path = usePathname();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const navigationId = useId();
  const guides = [
    ['Introduction', '/ui/docs'],
    ['Getting started', '/ui/getting-started'],
    ['Themes & tokens', '/ui/themes'],
    ['DEVVY GLASS', '/ui/glass'],
    ['Playground', '/ui/playground'],
    ['Changelog', '/ui/changelog'],
    ['Contributing', '/ui/contributing'],
  ];
  return (
    <aside className="sidebar" data-expanded={expanded}>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={navigationId}
        onClick={() => setExpanded(!expanded)}
      >
        <span>Browse documentation</span>
        <InterfaceIcon name="chevron" />
      </button>
      <div id={navigationId} className="sidebar-content">
        <div className="sidebar-search">
          <InterfaceIcon name="search" />
          <Input
            type="search"
            aria-label="Search documentation"
            placeholder="Find a component…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <nav aria-label="Documentation">
          <p className="nav-heading">START BUILDING</p>
          {guides
            .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
            .map(([name, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? 'page' : undefined}
                onClick={() => setExpanded(false)}
              >
                {name}
                {href === '/ui/glass' ? (
                  <Badge tone="brand" className="nav-new">
                    New
                  </Badge>
                ) : null}
              </Link>
            ))}
          <p className="nav-heading nav-component-heading">
            <span>COMPONENTS</span>{' '}
            <Badge tone="neutral" className="nav-count-badge">
              {catalog.length}
            </Badge>
          </p>
          {catalog
            .filter((item) =>
              (item.name + item.description).toLowerCase().includes(search.toLowerCase()),
            )
            .map((item) => (
              <Link
                key={item.slug}
                href={`/ui/components/${item.slug}`}
                aria-current={path === `/ui/components/${item.slug}` ? 'page' : undefined}
                onClick={() => setExpanded(false)}
              >
                <span>{item.name}</span>
                {['glass', 'dialog', 'dock'].includes(item.slug) ? (
                  <span className="nav-enhancement-indicator" aria-hidden="true">
                    ★
                  </span>
                ) : null}
              </Link>
            ))}
          {search &&
            !catalog.some((item) =>
              (item.name + item.description).toLowerCase().includes(search.toLowerCase()),
            ) &&
            !guides.some(([name]) => name.toLowerCase().includes(search.toLowerCase())) && (
              <p role="status">No matching documentation.</p>
            )}
        </nav>
        <div className="sidebar-note">
          <div className="sidebar-status-pill">
            <span className="status-dot" />
            <span>Independent MIT Foundation</span>
          </div>
          <span className="sidebar-version-tag">v0.1.0-alpha.0 · DEV STATION</span>
        </div>
      </div>
    </aside>
  );
}
