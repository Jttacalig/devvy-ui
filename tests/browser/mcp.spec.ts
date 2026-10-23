import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('MCP guide documents all tools, editor setup and private release boundaries accessibly', async ({
  page,
}) => {
  await page.goto('/ui/mcp');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Give your assistant the actual source.',
  );
  const tools = page.getByRole('region', { name: 'MCP tools' });
  await expect(tools.locator('tbody tr')).toHaveCount(8);
  for (const name of ['Codex', 'Claude Code', 'Cursor', 'VS Code'])
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  await expect(page.locator('article')).toContainText('publishing disabled');
  await expect(page.locator('article')).toContainText('384 KiB');
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme', exact: true }).selectOption(theme);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
  await page.setViewportSize({ width: 375, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
