import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const supportUrl = 'https://buymeacoffee.com/jttacalig';

test('support links work without the checkout and the landing widget loads on demand', async ({
  page,
}) => {
  let checkouts = 0;
  await page.route('https://www.buymeacoffee.com/widget/page/**', async (route) => {
    checkouts++;
    await route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html lang="en"><title>Mock hosted checkout</title><body><main><h1>Checkout preview</h1></main></body></html>',
    });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/ui');
  await expect(
    page.locator('#support').getByRole('link', { name: /Buy me a coffee/ }),
  ).toHaveAttribute('href', supportUrl);
  await expect(
    page.locator('.site-footer').getByRole('link', { name: /Support independent/ }),
  ).toHaveAttribute('href', supportUrl);
  const header = page.locator('.site-header');
  await expect(header.getByRole('link', { name: 'Buy me a coffee', exact: true })).toHaveAttribute(
    'href',
    supportUrl,
  );
  await expect(header.getByRole('link', { name: 'npm package @devvy-ui/react' })).toBeVisible();
  await expect(header.getByRole('link', { name: 'GitHub repository' })).toBeVisible();
  await expect(header.locator('.dvy-support-header img')).toHaveAttribute(
    'src',
    /font_family=Cookie/,
  );
  await expect(header.locator('.dvy-support-header')).toHaveCSS(
    'background-color',
    'rgb(255, 221, 0)',
  );
  expect(checkouts).toBe(0);
  await page.locator('#support').scrollIntoViewIfNeeded();
  await page.screenshot({ path: '.artifacts/support-desktop.png' });
  await expect(page.locator('iframe.dvy-support-checkout')).toHaveCount(0);
  const trigger = page.getByRole('button', { name: 'Support DEVVY UI on Buy Me a Coffee' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Support independent development' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Every coffee makes a difference!');
  await expect(dialog.getByRole('link', { name: /Open Buy Me a Coffee/ })).toHaveAttribute(
    'href',
    supportUrl,
  );
  await expect(
    page.frameLocator('.dvy-support-checkout').getByRole('heading', { name: 'Checkout preview' }),
  ).toBeVisible();
  expect(checkouts).toBe(1);
  await expect(dialog.locator('iframe')).toHaveAttribute(
    'src',
    /jttacalig\?description=.+&color=%235F7FFF$/,
  );
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator('iframe.dvy-support-checkout')).toHaveCount(0);
  await page
    .locator('.landing-intro')
    .getByRole('link', { name: /Get started/ })
    .click();
  await expect(page).toHaveURL(/\/ui\/getting-started$/);
  await expect(trigger).toHaveCount(0);
  await expect(
    page.locator('.site-footer').getByRole('link', { name: /Support independent/ }),
  ).toHaveAttribute('href', supportUrl);
});

test('support remains usable on narrow screens, with blocked checkout and in both themes', async ({
  page,
}) => {
  await page.route('https://www.buymeacoffee.com/widget/page/**', (route) => route.abort());
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/ui');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('button', { name: 'Menu' }).click();
  await expect(nav.getByRole('link', { name: 'Buy me a coffee', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'npm', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'GitHub', exact: true })).toBeVisible();
  await nav.getByRole('link', { name: 'Buy me a coffee', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(nav.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
    await page.locator('#support').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `.artifacts/support-${theme}-320.png` });
    await page.getByRole('button', { name: 'Support DEVVY UI on Buy Me a Coffee' }).click();
    const dialog = page.getByRole('dialog', { name: 'Support independent development' });
    await expect(dialog.getByRole('link', { name: /Open Buy Me a Coffee/ })).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    expect(
      (await new AxeBuilder({ page }).exclude('.dvy-support-checkout').analyze()).violations,
    ).toEqual([]);
    await page.screenshot({ path: `.artifacts/support-dialog-${theme}-320.png` });
    await dialog.getByRole('button', { name: 'Close support' }).click();
  }
});
