import { test, expect } from '@playwright/test';
import components from '../../packages/react/components.json';

test('native Select responds to keyboard, disabled options and form reset', async ({ page }) => {
  await page.goto('/ui/components/select');
  const select = page.getByRole('combobox', { name: 'Project', exact: true });
  await select.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(select).toHaveValue('studio');
  await select.selectOption('orbit');
  await select.selectOption('studio');
  await expect(page.getByRole('status').filter({ hasText: 'Selected:' })).toContainText(
    'Dev Station studio',
  );
  await expect(page.getByRole('combobox', { name: 'Unavailable plan' })).toBeDisabled();
  await expect(select.locator('option[value="archived"]')).toBeDisabled();
  await page.getByRole('button', { name: 'Reset selection' }).click();
  await expect(select).toHaveValue('orbit');
});

test('feedback previews expose real state changes', async ({ page }) => {
  await page.goto('/ui/components/alert');
  await page.getByRole('button', { name: 'Dismiss message' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Show message' })).toBeFocused();
  await expect(page.getByRole('status').filter({ hasText: 'Your changes are saved.' })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Show message' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Your changes are saved.' }),
  ).toBeVisible();
  await page.goto('/ui/components/progress');
  await page.getByRole('button', { name: 'Advance upload' }).click();
  await expect(page.getByRole('progressbar', { name: 'Upload', exact: true })).toHaveAttribute(
    'value',
    '50',
  );
  await expect(page.getByRole('progressbar', { name: 'Connecting' })).not.toHaveAttribute('value');
  await page.goto('/ui/components/skeleton');
  await page.getByRole('button', { name: 'Finish loading' }).click();
  await expect(page.locator('[aria-label="Profile"]')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('.dvy-skeleton')).toHaveCount(0);
});

test('new foundations fit narrow, RTL and reduced-motion contexts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const name of ['select', 'alert', 'progress', 'skeleton']) {
    await page.goto(`/ui/components/${name}`);
    await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
  await expect(page.locator('.dvy-skeleton').first()).toHaveCSS('animation-name', 'none');
});

test('catalog lists exactly the canonical shipped inventory', async ({ page }) => {
  await page.goto('/ui/components');
  await expect(page.locator('main .component-directory a')).toHaveCount(components.length);
  for (const { name, slug } of components) {
    await expect(page.locator(`main a[href="/ui/components/${slug}"]`).first()).toContainText(name);
  }
});
