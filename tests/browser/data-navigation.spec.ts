import { test, expect } from '@playwright/test';
import { releaseVersion } from '../../apps/docs/lib/release';
import inventory from '../../packages/react/components.json';
import AxeBuilder from '@axe-core/playwright';

test('chart variants keep exact values accessible', async ({ page }) => {
  await page.goto('/ui/components/chart');
  for (const type of ['bar', 'line', 'area', 'donut']) {
    await page.getByRole('button', { name: type, exact: true }).click();
    await expect(page.locator('.dvy-chart')).toHaveAttribute('data-type', type);
    if (!((await page.locator('.dvy-chart-data').getAttribute('open')) !== null))
      await page.locator('.dvy-chart-data summary').click();
    await expect(page.locator('.dvy-chart-data table')).toBeVisible();
  }
});
test('mobile navbar disclosure supports keyboard and does not leak hidden focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/ui/components/navbar');
  const nav = page.getByRole('navigation', { name: 'Sample product' });
  await expect(nav.getByRole('link', { name: 'Projects' })).not.toBeVisible();
  const toggle = nav.getByRole('button', { name: 'Menu' });
  await toggle.click();
  await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
  await nav.getByRole('link', { name: 'Projects' }).focus();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible();
});
for (const name of ['chart', 'navbar', 'sidebar', 'breadcrumbs']) {
  test(`${name} fits compact and wide layouts in both themes`, async ({ page }) => {
    await page.goto(`/ui/components/${name}`);
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ['light', 'dark']) {
        await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('landing uses a paper-and-ink palette with DEVVY components', async ({ page }) => {
  await page.goto('/ui');
  await expect(page.locator('.release-note')).toContainText('v' + releaseVersion);
  await expect(page.locator('.release-note')).toContainText(inventory.length + ' components');
  await expect(page.locator('.sidebar-version-tag')).toContainText('v' + releaseVersion);
  await expect(page.locator('.footer-badge')).toHaveText('v' + releaseVersion);
  await page.getByRole('combobox', { name: 'Site theme' }).selectOption('light');
  expect(
    await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor),
  ).toBe('rgb(245, 243, 238)');
  expect(
    await page
      .locator('html')
      .evaluate((element) => getComputedStyle(element).getPropertyValue('--dvy-brand').trim()),
  ).toBe('#282724');
  await expect(page.locator('.component-collection .dvy-chart')).toBeVisible();
  await expect(page.locator('.component-collection .dvy-navbar')).toBeVisible();
  await page.screenshot({ path: '.artifacts/devvy-paper-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.artifacts/devvy-paper-phone.png', fullPage: true });
});
