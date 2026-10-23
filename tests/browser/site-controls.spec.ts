import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('search keeps its input fixed, bounds results, retains a query and ranks exact names first', async ({
  page,
}) => {
  await page.goto('/ui');
  const trigger = page.getByRole('button', { name: /^Search documentation/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Search DEVVY UI' });
  const input = dialog.getByRole('combobox', { name: 'Search commands' });
  await expect(dialog.getByRole('option')).toHaveCount(7);
  await input.fill('a');
  await expect(dialog.getByRole('option')).toHaveCount(12);
  for (let i = 0; i < 9; i++) await input.press('ArrowDown');
  const list = dialog.getByRole('listbox');
  await expect.poll(() => list.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await expect(input).toBeInViewport();
  await input.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(input).toHaveValue('a');
  await input.fill('form');
  await expect(dialog.getByRole('option').first().locator('strong')).toHaveText('Form');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/ui\/components\/form$/);
});

test('search is accessible in both themes and fits a compact screen without outer scrolling', async ({
  page,
}) => {
  await page.goto('/ui');
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme', exact: true }).selectOption(theme);
    await page.getByRole('button', { name: /^Search documentation/ }).click();
    const dialog = page.getByRole('dialog', { name: 'Search DEVVY UI' });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: `.artifacts/search-${theme}.png` });
    await dialog.getByRole('button', { name: 'Close search' }).click();
  }
  await page.setViewportSize({ width: 375, height: 667 });
  await page.getByRole('button', { name: /^Search documentation/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Search DEVVY UI' });
  const box = await dialog.boundingBox();
  expect(box!.height).toBeLessThan(651);
  expect(await dialog.evaluate((node) => node.scrollHeight <= node.clientHeight + 1)).toBe(true);
  await page.screenshot({ path: '.artifacts/search-mobile.png' });
  await dialog.getByRole('combobox', { name: 'Search commands' }).fill('no-such-command-anywhere');
  await expect(dialog.getByRole('status')).toContainText('No matching commands.');
  await dialog.getByRole('button', { name: 'Clear search' }).click();
  await expect(dialog.getByRole('option')).toHaveCount(7);
});

test('website pickers use DEVVY Select with consistent controls and native disabled semantics', async ({
  page,
  browserName,
}) => {
  await page.goto('/ui');
  const accent = page.getByRole('combobox', { name: 'Example accent' });
  await expect(accent).toHaveClass(/dvy-select/);
  await expect(accent).toHaveClass(/docs-select/);
  await accent.selectOption('clay');
  await page.getByRole('combobox', { name: 'Example density' }).selectOption('comfortable');
  await expect(page.locator('.landing-examples')).toHaveAttribute('data-preview-accent', 'clay');
  await expect(page.locator('.landing-examples')).toHaveAttribute(
    'data-devvy-density',
    'comfortable',
  );
  if (browserName === 'chromium') {
    await accent.click();
    await page.screenshot({ path: '.artifacts/dropdown-accent.png' });
    await page.keyboard.press('Escape');
  }
  await page.goto('/ui/components/chart');
  await page.getByRole('button', { name: 'donut', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Chart period', exact: true })).toBeDisabled();
  await expect(
    page.getByRole('combobox', { name: 'Chart line style', exact: true }),
  ).toBeDisabled();
});
