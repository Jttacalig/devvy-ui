import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 768, 1440]) {
  test(`glass lab is accessible and fits ${width}px in both themes`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/ui/glass');
    await page.getByRole('combobox', { name: 'Glass effect quality' }).selectOption('full');
    for (const theme of ['light', 'dark']) {
      await page.getByRole('combobox', { name: 'Glass appearance' }).selectOption(theme);
      const result = await new AxeBuilder({ page }).analyze();
      expect(
        result.violations.map((item) => ({
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

test('native glass dialog contains focus, supports Escape and restores the trigger', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/ui/glass');
  const trigger = page.getByRole('button', { name: 'Workspace settings', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Shape your workspace' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Workspace name' })).toBeFocused();
  await page
    .getByRole('combobox', { name: 'Glass appearance' })
    .evaluate((element) => element.focus());
  await expect(dialog.getByRole('textbox', { name: 'Workspace name' })).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    // Native dialogs retain document focus but intentionally allow browser chrome.
    expect(
      await dialog.evaluate(
        (element) =>
          element.contains(document.activeElement) ||
          (!document.hasFocus() && document.activeElement === document.body),
      ),
    ).toBe(true);
  }
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('textbox', { name: 'Workspace name' }).fill('My studio');
  await dialog.getByRole('button', { name: 'Save workspace' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'My studio is ready' })).toBeVisible();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('quality and material controls update real styles; native dock actions work', async ({
  page,
}) => {
  await page.goto('/ui/glass');
  const card = page.locator('.glass-project-card');
  await page.getByRole('combobox', { name: 'Glass effect quality' }).selectOption('full');
  expect(await card.evaluate((element) => getComputedStyle(element).backdropFilter)).toContain(
    'blur(14px)',
  );
  await page.getByRole('slider', { name: 'Glass blur' }).fill('20');
  expect(await card.evaluate((element) => getComputedStyle(element).backdropFilter)).toContain(
    'blur(20px)',
  );
  await page.getByRole('combobox', { name: 'Glass effect quality' }).selectOption('reduced');
  expect(await card.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe('none');
  expect(await card.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toMatch(
    /rgba\(/,
  );
  await page.getByRole('combobox', { name: 'Glass lighting' }).selectOption('225');
  expect(
    await card.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--dvy-glass-light-angle'),
    ),
  ).toBe('225deg');
  await page
    .getByRole('navigation', { name: 'Workspace shortcuts' })
    .getByRole('button', { name: 'Activity', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'A little progress, every day.' })).toBeVisible();
});

test('automatic mode reduces effects on low-resource hints', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 2 }),
  );
  await page.goto('/ui/glass');
  await expect(page.locator('.glass-scene')).toHaveAttribute('data-devvy-quality', 'reduced');
  expect(
    await page
      .locator('.glass-project-card')
      .evaluate((element) => getComputedStyle(element).backdropFilter),
  ).toBe('none');
});

test('reduced motion, contrast and forced colors override full effects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', contrast: 'more' });
  await page.goto('/ui/glass');
  await page.getByRole('combobox', { name: 'Glass effect quality' }).selectOption('full');
  expect(
    await page
      .locator('.glass-project-card')
      .evaluate((element) => getComputedStyle(element).backdropFilter),
  ).toBe('none');
  await page.getByRole('button', { name: 'Workspace settings', exact: true }).click();
  const dialog = page.getByRole('dialog');
  expect(await dialog.evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ contrast: 'no-preference', forcedColors: 'active' });
  expect(
    await page
      .locator('.glass-project-card')
      .evaluate((element) => getComputedStyle(element).backdropFilter),
  ).toBe('none');
});

test('unsupported native dialog becomes an explicitly inline panel', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: undefined,
    }),
  );
  await page.goto('/ui/glass');
  await page.getByRole('button', { name: 'Workspace settings', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const panel = page.getByRole('region', { name: 'Shape your workspace' });
  await expect(panel).toContainText('displays this panel inline');
  await panel.getByRole('button', { name: 'Close dialog' }).click();
  await expect(panel).not.toBeVisible();
});
