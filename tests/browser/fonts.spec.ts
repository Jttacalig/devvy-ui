import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('font controls wait for hydration so the first edit is retained', async ({ page }) => {
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route('**/_next/static/**/*.js', async (route) => {
    await scriptsReady;
    await route.continue();
  });
  await page.goto('/ui/fonts', { waitUntil: 'commit' });
  const input = page.getByRole('textbox', { name: 'Your preview text', exact: true });
  const weight = page.getByRole('slider', { name: /Weight/ });
  try {
    await expect(input).toBeDisabled();
    await expect(weight).toBeDisabled();
  } finally {
    releaseScripts();
  }
  await expect(input).toBeEnabled();
  await input.fill('Keep my first edit');
  await weight.fill('700');
  await expect(page.locator('.font-sample')).toHaveText([
    'Keep my first edit',
    'Keep my first edit',
    'Keep my first edit',
  ]);
  await expect(input).toHaveValue('Keep my first edit');
});

test('optional fonts load on use, preview weights, persist choices and keep base system fonts', async ({
  page,
}) => {
  const fonts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fonts.push(request.url());
  });
  await page.goto('/ui');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Choose a DEVVY style' }).click();
  await expect(page.getByRole('combobox', { name: 'Interface font' })).toHaveValue('system');
  expect(fonts).toHaveLength(0);
  await page.getByRole('combobox', { name: 'Interface font' }).selectOption('manrope');
  await expect(page.locator('html')).toHaveAttribute('data-devvy-font', 'manrope');
  await expect.poll(() => fonts.length).toBe(1);
  expect(fonts.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-devvy-font', 'manrope');
  await page.goto('/ui/fonts');
  await page.getByRole('textbox', { name: 'Your preview text' }).fill('Build with Devvy 123');
  await page.getByRole('slider', { name: /Weight/ }).fill('700');
  for (const sample of await page.locator('.font-sample').all()) {
    await expect(sample).toHaveText('Build with Devvy 123');
    await expect(sample).toHaveCSS('font-weight', '700');
  }
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.fonts.check('700 24px "Geist"') &&
          document.fonts.check('700 24px "Manrope"') &&
          document.fonts.check('700 24px "Geist Mono"'),
      ),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Try Geist on this site', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-devvy-font', 'geist');
  await expect(page.locator('body')).toHaveCSS('font-family', /Geist/);
  await page.getByRole('button', { name: 'Restore system font' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-devvy-font', 'system');
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme', exact: true }).selectOption(theme);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
  await page.setViewportSize({ width: 375, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.artifacts/fonts-mobile.png' });
});
