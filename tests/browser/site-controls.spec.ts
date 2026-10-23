import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('published version is rendered consistently without browser requests to npm', async ({
  page,
}) => {
  const registryRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'registry.npmjs.org')
      registryRequests.push(request.url());
  });
  await page.goto('/ui');
  const versionText = await page.locator('.hero-install-version').innerText();
  const version = versionText.match(/v(\d+\.\d+\.\d+)$/)?.[1];
  expect(version).toBeTruthy();
  await expect(page.locator('.site-header .release-tag')).toHaveText(`v${version} Stable`);
  await expect(page.locator('.release-note .dvy-badge').first()).toHaveText(`v${version} Stable`);
  await expect(page.locator('.footer-badge')).toHaveText(`v${version} Stable`);
  await expect(page).toHaveTitle(new RegExp(`DEVVY UI v${version!.replaceAll('.', '\\.')} Stable`));
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(schema!).version).toBe(version);
  expect(registryRequests).toEqual([]);
});

test('theme changes apply readable foreground and background colors together', async ({ page }) => {
  await page.goto('/ui/components/button');
  await expect(page.locator('.component-preview')).toHaveAttribute('data-ready', 'true');
  const download = page.getByRole('button', { name: 'Download TSX', exact: true });
  await expect(download).toBeEnabled();
  const editorStyle = await download.evaluate((node) => {
    const style = getComputedStyle(node);
    return { opacity: style.opacity, transition: style.transitionProperty };
  });
  expect(editorStyle.opacity).toBe('1');
  expect(editorStyle.transition.split(/,\s*/)).not.toContain('opacity');
  for (const theme of ['dark', 'light', 'dark', 'light']) {
    await page.getByRole('combobox', { name: 'Site theme', exact: true }).selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-devvy-theme', theme);
    const colors = await page.evaluate(() => {
      const button = getComputedStyle(document.querySelector('.component-preview .dvy-button')!);
      const overview = getComputedStyle(document.querySelector('.sidebar-overview-btn')!);
      return {
        foreground: button.color,
        background: button.backgroundColor,
        overview: overview.color,
      };
    });
    expect(colors).toEqual(
      theme === 'dark'
        ? {
            foreground: 'rgb(16, 38, 26)',
            background: 'rgb(139, 212, 172)',
            overview: 'rgb(177, 189, 178)',
          }
        : {
            foreground: 'rgb(255, 255, 255)',
            background: 'rgb(23, 107, 75)',
            overview: 'rgb(89, 100, 92)',
          },
    );
  }
});

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
