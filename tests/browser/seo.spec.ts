import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { docsUrl } from '../../apps/docs/lib/release';
import { mcpPublishedVersion } from '../../apps/docs/lib/mcp-release';

test('landing and MCP release facts agree with canonical and social metadata', async ({ page }) => {
  for (const path of ['', '/mcp']) {
    await page.goto(`/ui${path}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${docsUrl}${path}`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${docsUrl}${path}`,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${new URL(docsUrl).origin}/ui/social-card`,
    );
    expect(await page.locator('main').innerText()).not.toContain('0.2.0');
    expect(
      await page.locator('meta[property="og:description"]').getAttribute('content'),
    ).not.toContain('0.2.0');
    const schema = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    );
    expect(schema.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(schema.isAccessibleForFree).toBe(true);
    if (path === '/mcp') {
      expect(schema.version).toBe(mcpPublishedVersion);
      await expect(page.locator('article')).toContainText(
        `Published ${mcpPublishedVersion} is the default.`,
      );
      await expect(page.locator('article')).toContainText('not published as an npm MCP');
    } else {
      const label = await page.locator('.site-header .release-tag').innerText();
      expect(label).toBe(`v${schema.version} Stable`);
    }
  }
});

test('crawler references list all canonical components and distinguish npm, docs and MCP versions', async ({
  request,
}) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(new Set(urls).size).toBe(111);
  expect(urls.filter((url) => url.includes('/ui/components/'))).toHaveLength(100);
  expect(urls.every((url) => url.startsWith(docsUrl))).toBe(true);
  expect(xml).not.toContain('<lastmod>');
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${new URL(docsUrl).origin}/sitemap.xml`);
  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  const text = await llms.text();
  expect(text).toContain(`Optional local MCP published-source pin: ${mcpPublishedVersion}`);
  expect(text).toContain('Documentation implementation version:');
  expect(text).toContain('not a published npm package or hosted endpoint');
  expect(text).not.toContain('0.2.0');
  expect(text.match(/\/ui\/components\//g) ?? []).toHaveLength(100);
});

test('social card renders the original identity as a bounded 1200 by 630 PNG', async ({
  request,
}) => {
  const response = await request.get('/ui/social-card');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const body = await response.body();
  expect(body.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(body.readUInt32BE(16)).toBe(1200);
  expect(body.readUInt32BE(20)).toBe(630);
  expect(body.byteLength).toBeLessThan(250000);
  await mkdir('.artifacts', { recursive: true });
  await writeFile('.artifacts/release-social-card.png', body);
});
