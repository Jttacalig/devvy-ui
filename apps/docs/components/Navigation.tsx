'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';
import { Input, Badge } from '@devvy-ui/react';
import { InterfaceIcon } from './InterfaceIcon';

export function Navigation({
  items: catalog,
  releaseLabel,
}: {
  items: readonly { name: string; slug: string; description: string }[];
  releaseLabel: string;
}) {
  const path = usePathname();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const isComponentPage = path.startsWith('/ui/components/');
  const [showAll, setShowAll] = useState(isComponentPage);
  const navigationId = useId();

  const gettingStartedLinks = [
    { label: 'Installation', href: '/ui/getting-started', icon: 'download' as const },
    { label: 'Components', href: '/ui/components', icon: 'grid' as const },
    { label: 'MCP tools', href: '/ui/mcp', icon: 'sparkles' as const },
  ];

  const foundationLinks = [
    { label: 'Layout', href: '/ui/docs', icon: 'layout' as const },
    { label: 'Typography & fonts', href: '/ui/fonts', icon: 'type' as const },
    { label: 'Colors', href: '/ui/themes', icon: 'palette' as const },
    { label: 'DEVVY GLASS', href: '/ui/glass', icon: 'sparkles' as const, badge: 'New' },
  ];

  const componentCategoryLinks = [
    { label: 'Actions', href: '/ui/components/button', icon: 'cursor' as const },
    { label: 'Forms', href: '/ui/components/input', icon: 'form' as const },
    { label: 'Data Display', href: '/ui/components/table', icon: 'table' as const },
    { label: 'Feedback', href: '/ui/components/alert', icon: 'message' as const },
    { label: 'Navigation', href: '/ui/components/navbar', icon: 'navigation' as const },
  ];

  const isSearching = Boolean(search.trim());
  const normalizedSearch = search.toLowerCase().trim();

  const filteredComponents = catalog.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch),
  );

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
        <Link
          href="/ui"
          className="sidebar-overview-btn"
          aria-current={path === '/ui' ? 'page' : undefined}
          onClick={() => setExpanded(false)}
        >
          <span className="sidebar-overview-icon" aria-hidden="true">
            <InterfaceIcon name="home" />
          </span>
          <span className="sidebar-overview-label">Overview</span>
        </Link>

        <div className="sidebar-search">
          <InterfaceIcon name="search" />
          <Input
            type="search"
            aria-label="Search documentation"
            placeholder="Search components..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <nav aria-label="Documentation">
          {!isSearching ? (
            <>
              {/* GETTING STARTED */}
              <p className="nav-heading">GETTING STARTED</p>
              {gettingStartedLinks.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={path === href ? 'page' : undefined}
                  onClick={() => setExpanded(false)}
                  className="sidebar-nav-item"
                >
                  <span className="sidebar-item-icon" aria-hidden="true">
                    <InterfaceIcon name={icon} />
                  </span>
                  <span className="sidebar-item-right">
                    <span className="sidebar-item-label">{label}</span>
                  </span>
                </Link>
              ))}

              {/* FOUNDATIONS */}
              <p className="nav-heading">FOUNDATIONS</p>
              {foundationLinks.map(({ label, href, icon, badge }) => (
                <Link
                  key={label}
                  href={href}
                  aria-current={path === href ? 'page' : undefined}
                  onClick={() => setExpanded(false)}
                  className="sidebar-nav-item"
                >
                  <span className="sidebar-item-icon" aria-hidden="true">
                    <InterfaceIcon name={icon} />
                  </span>
                  <span className="sidebar-item-right">
                    <span className="sidebar-item-label">{label}</span>
                    {badge ? <span className="sidebar-item-badge">{badge}</span> : null}
                  </span>
                </Link>
              ))}

              {/* COMPONENTS */}
              <p className="nav-heading">COMPONENTS</p>
              {componentCategoryLinks.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-current={path === href ? 'page' : undefined}
                  onClick={() => setExpanded(false)}
                  className="sidebar-nav-item"
                >
                  <span className="sidebar-item-icon" aria-hidden="true">
                    <InterfaceIcon name={icon} />
                  </span>
                  <span className="sidebar-item-right">
                    <span className="sidebar-item-label">{label}</span>
                  </span>
                </Link>
              ))}

              {/* ALL COMPONENTS TRIGGER */}
              <div className="sidebar-all-row">
                <button
                  type="button"
                  className="sidebar-all-btn"
                  onClick={() => setShowAll(!showAll)}
                  aria-expanded={showAll}
                  aria-controls="all-components-list"
                >
                  <span className="sidebar-all-pill">ALL COMPONENTS</span>
                  <span className="sidebar-all-count">{catalog.length}</span>
                </button>
              </div>

              {showAll ? (
                <div id="all-components-list" className="sidebar-all-components">
                  {catalog.map((item) => (
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
                </div>
              ) : null}
            </>
          ) : (
            <>
              {/* SEARCH RESULTS */}
              <p className="nav-heading nav-component-heading">
                <span>MATCHING COMPONENTS</span>
                <Badge tone="brand" className="nav-count-badge">
                  {filteredComponents.length}
                </Badge>
              </p>
              {filteredComponents.length > 0 ? (
                <div className="sidebar-all-components">
                  {filteredComponents.map((item) => (
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
                </div>
              ) : (
                <p role="status" className="sidebar-no-results">
                  No matching components found.
                </p>
              )}
            </>
          )}
        </nav>

        <div className="sidebar-note">
          <div className="sidebar-status-pill">
            <span className="status-dot" aria-hidden="true" />
            <span>Independent MIT Foundation</span>
          </div>
          <span className="sidebar-version-tag">{releaseLabel} · DEV STATION</span>
        </div>
      </div>
    </aside>
  );
}
