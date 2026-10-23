import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

test('dedicated playground previews edits automatically, pauses safely and resizes its workspace', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/ui/playground');
  await expect(page.locator('.sidebar')).toHaveCount(0);
  const shell = await page.locator('.docs-shell').boundingBox();
  expect(shell?.width).toBe(1440);
  await page.screenshot({ path: '.artifacts/playground-wide.png' });
  const preview = page.frameLocator('iframe[title="Your customized DEVVY UI preview"]');
  const css = page.getByRole('textbox', { name: 'Edit theme CSS', exact: true });
  await css.fill('.custom-card h1 { color: rgb(25, 90, 65); }');
  await expect(preview.getByRole('heading', { name: 'Your next idea starts here.' })).toHaveCSS(
    'color',
    'rgb(25, 90, 65)',
  );
  await page.getByRole('switch', { name: 'Auto preview' }).uncheck();
  await css.fill('.custom-card h1 { color: rgb(110, 50, 30); }');
  await expect(page.locator('.editor-run')).toContainText('Unapplied changes');
  await expect(preview.getByRole('heading', { name: 'Your next idea starts here.' })).toHaveCSS(
    'color',
    'rgb(25, 90, 65)',
  );
  await css.press('Control+Enter');
  await expect(preview.getByRole('heading', { name: 'Your next idea starts here.' })).toHaveCSS(
    'color',
    'rgb(110, 50, 30)',
  );
  const divider = page.getByRole('separator', { name: 'Resize code and preview' });
  await divider.focus();
  await divider.press('ArrowRight');
  await expect(divider).toHaveAttribute('aria-valuenow', '51');
  await page.getByRole('combobox', { name: 'Preview size' }).selectOption('mobile');
  await expect(page.locator('iframe[title="Your customized DEVVY UI preview"]')).toHaveCSS(
    'width',
    '375px',
  );
  await page
    .getByRole('group', { name: 'Workspace layout' })
    .getByRole('button', { name: 'Preview', exact: true })
    .click();
  await expect(css).not.toBeVisible();
  await page
    .getByRole('group', { name: 'Workspace layout' })
    .getByRole('button', { name: 'Split view', exact: true })
    .click();
  await expect(css).toBeVisible();
  await page.getByRole('switch', { name: 'Auto preview' }).check();
  await page.getByRole('button', { name: 'index.html', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Edit preview HTML' })
    .fill('<main><h1>Automatic HTML works</h1><script>window.badPreview = true</script></main>');
  await expect(preview.getByRole('heading', { name: 'Automatic HTML works' })).toBeVisible();
  expect(await preview.locator('body').evaluate(() => 'badPreview' in window)).toBe(false);
  await expect(page.locator('iframe[title="Your customized DEVVY UI preview"]')).toHaveAttribute(
    'sandbox',
    '',
  );
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('custom HTML and CSS update an isolated preview and export the edited design', async ({
  page,
}) => {
  test.slow();
  await page.goto('/ui/playground#code-playground');
  const css =
    '.my-workspace { padding: 2rem; background: #eef6f2; color: #18251f; } h1 { color: #087565; }';
  await page.getByRole('textbox', { name: 'Edit theme CSS', exact: true }).fill(css);
  await page.getByRole('button', { name: 'index.html', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Edit preview HTML', exact: true })
    .fill(
      '<main class="my-workspace"><h1>My own design</h1><p>Custom code, custom result.</p><script>window.customScriptRan = true;</script></main>',
    );
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click();
  const preview = page.frameLocator('iframe[title="Your customized DEVVY UI preview"]');
  await expect(preview.getByRole('heading', { name: 'My own design', exact: true })).toHaveCSS(
    'color',
    'rgb(8, 117, 101)',
  );
  expect(await preview.locator('body').evaluate(() => 'customScriptRan' in window)).toBe(false);
  await expect(page.locator('iframe[title="Your customized DEVVY UI preview"]')).toHaveAttribute(
    'sandbox',
    '',
  );
  const cssDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSS', exact: true }).click();
  const theme = await cssDownload;
  expect(theme.suggestedFilename()).toBe('devvy-theme.css');
  expect(await readFile((await theme.path())!, 'utf8')).toBe(css);
  const htmlDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download HTML', exact: true }).click();
  const design = await htmlDownload;
  expect(design.suggestedFilename()).toBe('my-devvy-design.html');
  const exportedHTML = await readFile((await design.path())!, 'utf8');
  expect(exportedHTML).toContain('My own design');
  expect(exportedHTML).toContain(css);
  expect(exportedHTML).toContain('MIT License');
  expect(exportedHTML).toContain('.dvy-button');
  await page.getByRole('button', { name: 'Restore starter', exact: true }).click();
  await expect(
    preview.getByRole('heading', { name: 'Your next idea starts here.', exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme', exact: true }).selectOption(theme);
    // The sandbox blocks injected audit scripts. Audit the editor UI here;
    // shared component markup is covered on the individual component pages.
    const accessibility = await new AxeBuilder({ page }).exclude('iframe').analyze();
    expect(accessibility.violations).toEqual([]);
  }
});

test('code editing waits for hydration instead of losing early changes', async ({ page }) => {
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route('**/_next/static/**/*.js', async (route) => {
    await scriptsReady;
    await route.continue();
  });
  await page.goto('/ui/playground#code-playground', { waitUntil: 'commit' });
  const editor = page.getByRole('textbox', { name: 'Edit theme CSS', exact: true });
  try {
    await expect(editor).toBeDisabled();
  } finally {
    releaseScripts();
  }
  await expect(editor).toBeEnabled();
  await editor.fill('.custom-card h1 { color: #087565; }');
  await page.getByRole('button', { name: 'Apply changes', exact: true }).click();
  await expect(
    page
      .frameLocator('iframe[title="Your customized DEVVY UI preview"]')
      .getByRole('heading', { name: 'Your next idea starts here.', exact: true }),
  ).toHaveCSS('color', 'rgb(8, 117, 101)');
});

test('React implementation source can be edited, downloaded and restored', async ({ page }) => {
  await page.goto('/ui/components/button#source');
  const editor = page.getByRole('textbox', { name: 'Edit Button.tsx source', exact: true });
  const original = await editor.inputValue();
  const customized = original + '\n// My project-specific variation.\n';
  await editor.fill(customized);
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download TSX', exact: true }).click();
  const source = await downloading;
  expect(source.suggestedFilename()).toBe('Button.tsx');
  const contents = await readFile((await source.path())!, 'utf8');
  expect(contents).toContain('MIT License');
  expect(contents).toContain(customized);
  await page.getByRole('button', { name: 'Restore original', exact: true }).click();
  await expect(editor).toHaveValue(original);
});
