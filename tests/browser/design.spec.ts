import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('mobile documentation disclosure supports keyboard search and closes after navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/ui/glass');
  const toggle = page.getByRole('button', { name: 'Browse documentation' });
  const search = page.getByRole('searchbox', { name: 'Search documentation' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(search).not.toBeVisible();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await search.fill('checkbox');
  const link = page
    .getByRole('navigation', { name: 'Documentation', exact: true })
    .getByRole('link', { name: 'Checkbox', exact: true });
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Checkbox', exact: true }),
  ).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(search).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('native dropdown keyboard selection, reset and browser picker fallback work', async ({
  page,
  browserName,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/ui/glass');
  const atmosphere = page.getByRole('combobox', { name: 'Glass atmosphere', exact: true });
  await atmosphere.focus();
  if (browserName === 'firefox') {
    await atmosphere.press('End');
  } else {
    await atmosphere.press('Space');
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
  }
  await expect(atmosphere).toHaveValue('amber');
  await expect(page.locator('.glass-scene')).toHaveAttribute('data-tint', 'amber');
  await page.getByRole('combobox', { name: 'Glass appearance', exact: true }).selectOption('light');
  await page
    .getByRole('combobox', { name: 'Glass effect quality', exact: true })
    .selectOption('reduced');
  await page.getByRole('combobox', { name: 'Glass lighting', exact: true }).selectOption('225');
  await page.getByRole('slider', { name: 'Glass blur', exact: true }).fill('8');
  await page.getByRole('slider', { name: 'Glass surface opacity', exact: true }).fill('96');
  await page.getByRole('checkbox', { name: 'Build your next idea', exact: true }).check();
  await page.getByRole('button', { name: 'Reset material settings', exact: true }).click();
  await expect(atmosphere).toHaveValue('mint');
  await expect(page.getByRole('combobox', { name: 'Glass appearance', exact: true })).toHaveValue(
    'dark',
  );
  await expect(
    page.getByRole('combobox', { name: 'Glass effect quality', exact: true }),
  ).toHaveValue('auto');
  await expect(page.getByRole('combobox', { name: 'Glass lighting', exact: true })).toHaveValue(
    '135',
  );
  await expect(page.getByRole('slider', { name: 'Glass blur', exact: true })).toHaveValue('14');
  await expect(
    page.getByRole('slider', { name: 'Glass surface opacity', exact: true }),
  ).toHaveValue('88');
  await expect(
    page.getByRole('checkbox', { name: 'Build your next idea', exact: true }),
  ).toBeChecked();
  await page.setViewportSize({ width: 390, height: 900 });
  expect(await atmosphere.evaluate((element) => getComputedStyle(element).appearance)).toBe('none');
  await atmosphere.selectOption('ocean');
  await expect(page.locator('.glass-scene')).toHaveAttribute('data-tint', 'ocean');
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
  expect(errors).toEqual([]);
});
