import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { notFound } from 'next/navigation';
import { Badge, Card, CardHeader, CardTitle, CardDescription, Separator } from '@devvy-ui/react';
import { catalog } from '../../../../lib/catalog';
import { ComponentPreview } from '../../../../components/ComponentPreview';
import { CopyCode } from '../../../../components/CopyCode';
import { SourceEditor } from '../../../../components/SourceEditor';

export function generateStaticParams() {
  return catalog.map((item) => ({ slug: item.slug }));
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = catalog.find((entry) => entry.slug === slug);
  if (!item) notFound();
  const [source, license] = await Promise.all([
    readFile(
      resolve(process.cwd(), `../../packages/react/src/components/${item.name}.tsx`),
      'utf8',
    ),
    readFile(resolve(process.cwd(), '../../LICENSE'), 'utf8'),
  ]);
  const isEnhancement = ['glass', 'dialog', 'dock'].includes(item.slug);

  return (
    <article className="article">
      <div className="breadcrumb">
        Components / <span>{item.name}</span>
      </div>
      <div className="component-page-header">
        <div className="component-badges">
          <Badge tone={isEnhancement ? 'brand' : 'neutral'}>
            {isEnhancement ? 'Alpha Enhancement' : 'Foundation Component'}
          </Badge>
          <Badge tone="neutral">React 18 & 19</Badge>
          <Badge tone="neutral">Zero Runtime CSS</Badge>
        </div>
        <h1>{item.name}</h1>
        <p className="page-lead">{item.description}</p>
      </div>

      <div className="preview-container">
        <ComponentPreview name={item.slug} />
      </div>

      <Separator className="section-divider" />

      <section className="component-doc-section" aria-labelledby="usage-heading">
        <h2 id="usage-heading">Usage</h2>
        <CopyCode
          label={`${item.name} usage`}
          code={`import { ${[...new Set([item.name, ...(item.code.match(/(?<=<)[A-Z][a-zA-Z]+/g) ?? [])])].join(', ')} } from "@devvy-ui/react";\n\n${item.code}`}
        />
      </section>

      <Separator className="section-divider" />

      <section className="component-doc-section" aria-labelledby="api-heading">
        <h2 id="api-heading">API reference</h2>
        <p>
          Native HTML attributes, className, style and a forwarded ref are supported.
          Component-specific props:
        </p>
        <Card className="table-card">
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label={`${item.name} API reference`}
          >
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {item.props.map((prop) => (
                  <tr key={prop[0]}>
                    {prop.map((cell, index) => (
                      <td
                        key={index}
                        className={
                          index === 0 ? 'prop-cell-name' : index === 1 ? 'prop-cell-type' : ''
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <Separator className="section-divider" />

      <section className="component-doc-section" aria-labelledby="a11y-heading">
        <h2 id="a11y-heading">Accessibility & behavior</h2>
        <Card className="a11y-callout-card">
          <CardHeader>
            <CardTitle>Platform Behavior & Guidelines</CardTitle>
            <CardDescription>{item.note}</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <Separator className="section-divider" />

      <section className="component-doc-section" aria-labelledby="ownership-heading">
        <h2 id="ownership-heading">Source ownership</h2>
        <p>Add the audited implementation directly into your repository with the CLI:</p>
        <CopyCode
          label={`${item.name} source installation`}
          code={`node /path/to/devvy-ui/packages/cli/src/cli.mjs add ${item.slug}`}
        />
      </section>

      <Separator className="section-divider" />

      <section className="component-doc-section" aria-labelledby="source">
        <h2 id="source">Make the source yours.</h2>
        <p>
          Start from the canonical implementation used by the package and registry. Change the code,
          keep the MIT notice, and build the behavior your project needs.
        </p>
        <SourceEditor source={source} filename={`${item.name}.tsx`} license={license} />
      </section>
    </article>
  );
}
