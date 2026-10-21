import Link from 'next/link';
import { ChartPreview, NavigationPreview } from './DataNavigationPreview';

export function ComponentCollection() {
  return (
    <section className="component-collection" aria-labelledby="collection-heading">
      <div className="section-label">
        <div>
          <span className="eyebrow">NEW BUILDING BLOCKS</span>
          <h2 id="collection-heading">Give your data a shape. Give your app a direction.</h2>
          <p className="section-subtext">
            Original charts and navigation, made from the same foundation.
          </p>
        </div>
        <Link href="/ui/components/chart">
          Explore charts <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="component-collection-grid">
        <div className="component-collection-example">
          <div className="component-collection-label">
            <span>01 / DATA DISPLAY</span>
            <span>SVG · No chart dependency</span>
          </div>
          <ChartPreview />
        </div>
        <div className="component-collection-example">
          <div className="component-collection-label">
            <span>02 / NAVIGATION</span>
            <Link href="/ui/components/navbar">View components ↗</Link>
          </div>
          <NavigationPreview name="navbar" />
          <NavigationPreview name="breadcrumbs" />
          <NavigationPreview name="sidebar" />
        </div>
      </div>
    </section>
  );
}
