import { test, expect } from '@playwright/test';
import inventory from '../../packages/react/components.json';
import { docsUrl, releaseLabel } from '../../apps/docs/lib/release';

test('stable onboarding exposes the real installation and release destinations', async ({
  page,
}) => {
  await page.goto('/ui');
  const publishedLabel = await page.locator('.site-header .release-tag').innerText();
  const publishedVersion = publishedLabel.match(/^v(\d+\.\d+\.\d+) Stable$/)?.[1];
  expect(publishedVersion).toBeTruthy();
  await expect(page.locator('.release-note')).toContainText(publishedLabel);
  await expect(page.locator('.hero-install-code')).toHaveText('npm install @devvy-ui/react');
  const hero = page.locator('.landing-intro');
  await expect(hero.getByRole('link', { name: /Get started/ })).toHaveAttribute(
    'href',
    '/ui/getting-started',
  );
  await expect(hero.getByRole('link', { name: /Explore all 100/ })).toHaveAttribute(
    'href',
    '/ui/components',
  );
  await expect(hero.getByRole('link', { name: /Playground/ })).toHaveAttribute(
    'href',
    '/ui/playground#code-playground',
  );
  const resources = page.getByRole('navigation', { name: 'Release resources' });
  await expect(resources.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Jttacalig/devvy-ui',
  );
  await expect(resources.getByRole('link', { name: /npm/ })).toHaveAttribute(
    'href',
    'https://www.npmjs.com/package/@devvy-ui/react',
  );
  for (const [manager, command] of [
    ['npm', 'npm install @devvy-ui/react'],
    ['pnpm', 'pnpm add @devvy-ui/react'],
    ['Yarn', 'yarn add @devvy-ui/react'],
    ['Bun', 'bun add @devvy-ui/react'],
  ]) {
    await page.getByRole('tab', { name: manager, exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: manager, exact: true })).toContainText(command);
  }
  await expect(page.locator('.packages-grid a')).toHaveCount(6);
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema.version).toBe(publishedVersion);
  expect(schema.url).toBe(docsUrl);
  await page.goto('/ui/getting-started');
  await expect(page.locator('main')).toContainText('npm install @devvy-ui/react');
  await expect(page.locator('main')).not.toContainText('@beta');
  await expect(page.locator('main')).toContainText('npx @devvy-ui/cli init');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `${docsUrl}/getting-started`,
  );
});

test('all 100 component pages expose stable imports, published CLI usage and unique SEO', async ({
  request,
}) => {
  expect(inventory).toHaveLength(100);
  for (const { slug, name } of inventory) {
    const response = await request.get(`/ui/components/${slug}`);
    expect(response.status(), slug).toBe(200);
    const html = await response.text();
    expect(html, slug).toContain(releaseLabel);
    const publishedLabel = html.match(
      /class="[^"]*\brelease-tag\b[^"]*"[^>]*>(v\d+\.\d+\.\d+ Stable)</,
    )?.[1];
    expect(publishedLabel, slug).toBeTruthy();
    expect(html, slug).toContain(`<title>${name} · DEVVY UI ${publishedLabel}</title>`);
    expect(html, slug).toContain(`${docsUrl}/components/${slug}`);
    expect(html, slug).toContain(`npx @devvy-ui/cli add ${slug}`);
    expect(html, slug).toContain('@devvy-ui/react');
    expect(html, slug).not.toContain('@devvy-ui/react@beta');
    expect(html, slug).not.toContain('/path/to/devvy-ui/packages/cli');
  }
});
