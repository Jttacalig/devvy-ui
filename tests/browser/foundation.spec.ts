import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const name of [
  'button',
  'input',
  'textarea',
  'label',
  'badge',
  'card',
  'separator',
  'checkbox',
  'switch',
  'tabs',
  'glass',
  'dialog',
  'dock',
  'chart',
  'navbar',
  'sidebar',
  'breadcrumbs',
]) {
  test(`${name} documentation passes axe with real light and dark styles`, async ({ page }) => {
    await page.goto(`/ui/components/${name}`);
    for (const theme of ['light', 'dark']) {
      await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
    }
  });
}

test('interactive preview, keyboard tabs and native form reset', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/ui');
  await page.getByRole('tab', { name: 'General', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Members', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'General', exact: true })).toBeFocused();
  await page.getByLabel('Project name', { exact: true }).fill('Devvy test');
  const updates = page.getByRole('switch', { name: 'Product updates' });
  await updates.focus();
  await page.keyboard.press('Space');
  await expect(updates).not.toBeChecked();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Changes saved' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByLabel('Project name', { exact: true })).toHaveValue('Orbit workspace');
  await expect(updates).toBeChecked();
  expect(errors).toEqual([]);
});

for (const width of [320, 677, 768, 1024, 1440]) {
  test(`docs fit ${width}px and pass axe in light and dark`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/ui');
    for (const theme of ['light', 'dark']) {
      await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
      await expect(page.locator('html')).toHaveAttribute('data-devvy-theme', theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  });
}

test('documentation search, component API and theme controls work', async ({ page }) => {
  await page.goto('/ui');
  await page.getByRole('searchbox', { name: 'Search documentation' }).fill('checkbox');
  await page
    .getByRole('navigation', { name: 'Documentation' })
    .getByRole('link', { name: 'Checkbox', exact: true })
    .click();
  await expect(page.getByRole('heading', { level: 1, name: 'Checkbox' })).toBeVisible();
  await expect(page.getByRole('table')).toContainText('indeterminate');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.goto('/ui/playground');
  await page.getByRole('button', { name: 'Preview: light' }).click();
  await expect(page.locator('.preview-canvas')).toHaveAttribute('data-devvy-theme', 'dark');
  await page.getByRole('button', { name: 'Toggle preview width' }).click();
  await expect(page.locator('.preview-canvas')).toHaveClass(/preview-mobile/);
  await page.getByRole('button', { name: 'Code', exact: true }).click();
  await expect(page.locator('.workbench-code')).toContainText('@devvy-ui/react');
});

test('all documentation routes respond and a missing component is a 404', async ({ page }) => {
  for (const path of [
    'docs',
    'getting-started',
    'components',
    'themes',
    'playground',
    'changelog',
    'contributing',
  ]) {
    const response = await page.goto(`/ui/${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  const response = await page.goto('/ui/components/not-shipped');
  expect(response?.status()).toBe(404);
});
