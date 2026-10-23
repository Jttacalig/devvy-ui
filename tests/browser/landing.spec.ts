import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('global search supports keyboard, Escape, focus return and route changes', async ({
  page,
}) => {
  await page.goto('/ui');
  const trigger = page.getByRole('button', { name: /^Search documentation/ });
  await trigger.focus();
  await page.keyboard.press('Control+k');
  const search = page.getByRole('combobox', { name: 'Search commands' });
  await expect(search).toBeFocused();
  await search.fill('not-a-real-component');
  await expect(page.getByRole('status').filter({ hasText: 'No matching commands' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await search.fill('combobox');
  await search.press('Enter');
  await expect(page).toHaveURL(/\/ui\/components\/combobox$/);
  await expect(page.locator('.sidebar')).toBeVisible();
  await page.locator('.wordmark').click();
  await expect(page.locator('.sidebar')).toHaveCount(0);
});

test('component gallery saves local ideas, changes the site style and links to the creator', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/ui');
  const gallery = page.locator('.landing-component-grid');
  await expect(gallery.locator('.dvy-card')).toHaveCount(3);
  const boxes = await Promise.all(
    (await gallery.locator('.landing-card').all()).map((card) => card.boundingBox()),
  );
  expect(
    Math.max(...boxes.map((box) => box!.height)) - Math.min(...boxes.map((box) => box!.height)),
  ).toBeLessThan(2);
  expect(new Set(boxes.map((box) => Math.round(box!.y))).size).toBe(1);
  const chart = gallery.getByRole('slider', { name: 'Inspect sample activity' });
  await chart.fill('3');
  await expect(chart).toHaveAttribute('aria-valuetext', 'Thu: 32');
  await gallery
    .getByRole('textbox', { name: 'Project title', exact: true })
    .fill('A calmer interface');
  await gallery.getByRole('button', { name: 'Save an idea' }).click();
  await expect(
    gallery.getByRole('status').filter({ hasText: 'Saved “A calmer interface” in this demo.' }),
  ).toBeVisible();
  await gallery.getByRole('button', { name: 'Modern', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-devvy-style', 'modern');
  await gallery.getByRole('combobox', { name: 'Showcase font' }).selectOption('manrope');
  await expect(page.locator('html')).toHaveAttribute('data-devvy-font', 'manrope');
  const footer = page.locator('.site-footer');
  await expect(footer.getByRole('link', { name: /Built by @Jttacalig/ })).toHaveAttribute(
    'href',
    'https://github.com/Jttacalig',
  );
  await expect(footer.getByRole('link', { name: /Source on GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Jttacalig/devvy-ui',
  );
});

test('mobile primary navigation uses native links and returns focus on Escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/ui');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const menu = nav.getByRole('button', { name: 'Menu' });
  await expect(nav.getByRole('link', { name: 'Components', exact: true })).not.toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await nav.getByRole('link', { name: 'Components', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await nav.getByRole('link', { name: 'Components', exact: true }).click();
  await expect(page).toHaveURL(/\/ui\/components$/);
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: 'Menu' }),
  ).toHaveAttribute('aria-expanded', 'false');
});

test('live showcase themes, density, form values and Glass controls change real state', async ({
  page,
}) => {
  await page.goto('/ui');
  const examples = page.locator('.landing-examples');
  await page.getByRole('checkbox', { name: 'Select Orbit workspace', exact: true }).check();
  await page.getByRole('button', { name: 'Send selected for review', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: '1 projects are ready for review.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('checkbox', { name: 'Select Orbit workspace', exact: true }),
  ).not.toBeChecked();
  await page.getByRole('combobox', { name: 'Example accent' }).selectOption('clay');
  await page.getByRole('combobox', { name: 'Example density' }).selectOption('compact');
  await expect(examples).toHaveAttribute('data-preview-accent', 'clay');
  await expect(examples).toHaveAttribute('data-devvy-density', 'compact');
  await page.getByRole('combobox', { name: 'Workspace region' }).selectOption('Europe');
  await page.getByRole('slider', { name: 'Weekly capacity', exact: true }).fill('81');
  await expect(page.getByRole('progressbar', { name: 'Selected weekly capacity' })).toHaveAttribute(
    'value',
    '81',
  );
  await page.getByRole('switch', { name: 'Weekly project updates' }).uncheck();
  await page.getByRole('button', { name: /Save preferences/ }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Saved: Europe, 81% capacity, updates off.' }),
  ).toBeVisible();
  await page.getByRole('switch', { name: 'Toggle showcase material' }).uncheck();
  await expect(page.locator('.hero-glass-viewport')).not.toHaveAttribute(
    'data-devvy-material',
    'glass',
  );
  await page.getByRole('button', { name: 'Try the glass' }).click();
  await expect(page.locator('.hero-glass-viewport')).toHaveAttribute(
    'data-devvy-material',
    'glass',
  );
  await page.getByRole('slider', { name: 'Showcase opacity' }).fill('92');
  await expect(page.locator('.hero-glass-viewport')).toHaveCSS('--dvy-glass-opacity', '0.92');
  await page.getByRole('button', { name: 'Reset preview' }).click();
  await expect(examples).toHaveAttribute('data-preview-accent', 'forest');
  await expect(examples).toHaveAttribute('data-devvy-density', 'default');
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

test('landing uses the available canvas at wide widths and fits compact screens', async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/ui');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const shell = await page.locator('.docs-shell').boundingBox();
    expect(shell?.width).toBe(width);
    if (width === 375 || width === 1440) {
      await page.screenshot({ path: `.artifacts/landing-${width}.png` });
    }
    if (width >= 1440) {
      const showcase = await page.locator('.landing-showcase-grid').boundingBox();
      expect(showcase!.width).toBeGreaterThan(width * 0.9);
    }
  }
});

test('signature styles preserve appearance choice, persist and retain Glass fallbacks', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, configurable: true }),
  );
  await page.goto('/ui');
  await expect(page.locator('html')).toHaveAttribute('data-devvy-style', 'minimal');
  const chooser = page.getByRole('button', { name: 'Choose a DEVVY style', exact: true });
  await chooser.click();
  await page.getByRole('radio', { name: /DEVVY Modern/ }).check();
  await expect(page.locator('html')).toHaveAttribute('data-devvy-style', 'modern');
  await expect(page.locator('html')).toHaveAttribute('data-devvy-theme', 'dark');
  await page.screenshot({ path: '.artifacts/landing-modern.png' });
  await page.keyboard.press('Escape');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-devvy-style', 'modern');
  await expect(page.locator('html')).toHaveAttribute('data-devvy-theme', 'dark');
  await page.getByRole('button', { name: 'Choose a DEVVY style', exact: true }).click();
  await page.getByRole('radio', { name: /DEVVY Glass/ }).check();
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-theme-scope')).toHaveAttribute('data-devvy-material', 'glass');
  await expect(page.locator('.site-theme-scope')).toHaveAttribute('data-devvy-quality', 'reduced');
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await expect(page.locator('.site-header')).toHaveCSS('backdrop-filter', 'none');
  await page.emulateMedia({ forcedColors: 'none' });
  await page.getByRole('button', { name: 'Choose a DEVVY style', exact: true }).click();
  await page.getByRole('radio', { name: /DEVVY Minimal/ }).check();
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-theme-scope')).not.toHaveAttribute(
    'data-devvy-material',
    'glass',
  );
});
