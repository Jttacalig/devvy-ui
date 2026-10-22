import { test, expect } from '@playwright/test';
import { midpointCatalog } from '../../apps/docs/lib/midpoint-catalog';

test('disclosures support native keyboard activation and controlled hiding', async ({ page }) => {
  await page.goto('/ui/components/accordion');
  const ownership = page.locator('.dvy-accordion summary').filter({ hasText: 'Can I customize' });
  await ownership.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.dvy-accordion details').first()).toHaveAttribute('open');
  await page.locator('.dvy-accordion summary').filter({ hasText: 'How do themes' }).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.dvy-accordion details').first()).not.toHaveAttribute('open');
  await page.locator('.dvy-accordion summary').filter({ hasText: 'Future adapters' }).click();
  await expect(page.locator('.dvy-accordion details').last()).not.toHaveAttribute('open');
  await page.goto('/ui/components/collapsible');
  await expect(page.getByRole('textbox', { name: 'Project alias' })).toHaveCount(0);
  await page.locator('.dvy-collapsible summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Project alias' })).toBeVisible();
  await page.locator('.dvy-collapsible summary').focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('textbox', { name: 'Project alias' })).toHaveCount(0);
});

test('native radio and segmented values support keyboard, disabled options and reset', async ({
  page,
}) => {
  await page.goto('/ui/components/radio-group');
  await page.getByRole('radio', { name: /Team/ }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: /Solo/ })).toBeChecked();
  await expect(page.getByRole('radio', { name: /Enterprise/ })).toBeDisabled();
  await page.getByRole('button', { name: 'Reset plan' }).click();
  await expect(page.getByRole('radio', { name: /Team/ })).toBeChecked();
  await page.goto('/ui/components/segmented-control');
  await page.getByRole('radio', { name: 'Monthly' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Yearly' })).toBeChecked();
  await expect(page.getByRole('status').filter({ hasText: 'Billing:' })).toContainText('yearly');
});

test('forms retain native validity, submission, reset, described errors and disabled fieldsets', async ({
  page,
}) => {
  await page.goto('/ui/components/form');
  await page.getByRole('button', { name: 'Subscribe' }).click();
  const email = page.getByRole('textbox', { name: /Email address/ });
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await email.fill('ada@example.com');
  await page.getByRole('button', { name: 'Subscribe' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Subscribed:' })).toContainText(
    'ada@example.com',
  );
  await page.getByRole('button', { name: 'Reset form' }).click();
  await expect(email).toHaveValue('');
  await page.goto('/ui/components/form-field');
  await page.getByRole('button', { name: 'Show field error' }).click();
  await expect(page.getByRole('textbox', { name: /Workspace email/ })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(page.locator('.dvy-field-error')).toHaveText('Enter a valid workspace email.');
  await page.goto('/ui/components/fieldset');
  await page.getByRole('button', { name: 'Disable notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Product updates' })).toBeDisabled();
});

test('number, password, search and slider inputs expose real behavior', async ({ page }) => {
  await page.goto('/ui/components/number-input');
  const seats = page.getByRole('spinbutton', { name: /Seats/ });
  await seats.fill('101');
  expect(await seats.evaluate((input: HTMLInputElement) => input.validity.rangeOverflow)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Reset seats' }).click();
  await expect(seats).toHaveValue('3');
  await page.goto('/ui/components/password-input');
  await page.getByRole('button', { name: 'Show password' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByLabel('Workspace password', { exact: true })).toHaveAttribute(
    'type',
    'text',
  );
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(page.getByLabel('Workspace password', { exact: true })).toHaveAttribute(
    'type',
    'password',
  );
  await page.goto('/ui/components/search-field');
  await page.getByRole('searchbox', { name: 'Find a project' }).fill('studio');
  await expect(page.locator('.midpoint-preview li')).toHaveCount(1);
  await expect(page.locator('.midpoint-preview li')).toHaveText('Dev Station studio');
  await page.goto('/ui/components/slider');
  await page.getByRole('slider', { name: 'Volume' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('slider', { name: 'Volume' })).toHaveValue('36');
});

test('pagination, icon actions and empty state examples change actual state', async ({ page }) => {
  await page.goto('/ui/components/pagination');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Page 2', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.getByRole('button', { name: 'Page 12', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  await page.goto('/ui/components/icon-button');
  await page.getByRole('button', { name: 'Star project' }).click();
  await expect(page.getByRole('button', { name: 'Star project' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.goto('/ui/components/empty-state');
  await page.getByRole('button', { name: 'Create project' }).click();
  await expect(page.getByText('Orbit workspace created', { exact: true })).toBeVisible();
});

test('measurements, loading and color examples update values without motion dependence', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/ui/components/circular-progress');
  await page.getByRole('button', { name: 'Advance export' }).click();
  await expect(page.getByRole('progressbar', { name: 'Preparing export' })).toHaveAttribute(
    'aria-valuenow',
    '50',
  );
  await expect(
    page.getByRole('progressbar', { name: 'Connecting to workspace' }),
  ).not.toHaveAttribute('aria-valuenow');
  await page.goto('/ui/components/spinner');
  await expect(page.locator('.dvy-loading-spinner .dvy-spinner')).toHaveCSS(
    'animation-name',
    'none',
  );
  await page.getByRole('button', { name: 'Finish loading', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Project details loaded.' }),
  ).toBeVisible();
  await page.goto('/ui/components/meter');
  await page.getByRole('button', { name: 'Change storage use' }).click();
  await expect(page.getByRole('meter', { name: 'Storage used' })).toHaveAttribute('value', '55');
  await page.goto('/ui/components/color-picker');
  await page.getByLabel('Accent color', { exact: true }).fill('#a12345');
  await expect(page.locator('.midpoint-preview code')).toHaveText('#a12345');
});

test('copy action reports successful copying and exposes a focused manual fallback on denial', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (sessionStorage.getItem('devvy-deny-clipboard')) throw new Error('Denied');
          sessionStorage.setItem('devvy-copied-text', text);
        },
      },
    }),
  );
  await page.goto('/ui/components/copy-button');
  await page.getByRole('button', { name: 'Copy theme token' }).click();
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('devvy-copied-text'))).toBe(
    '--dvy-brand: #087565;',
  );
  await page.evaluate(() => sessionStorage.setItem('devvy-deny-clipboard', '1'));
  await page.reload();
  await page.getByRole('button', { name: 'Copy theme token' }).click();
  const fallback = page.getByRole('textbox', { name: 'Copy this text manually' });
  await expect(fallback).toBeFocused();
  await expect(fallback).toHaveValue('--dvy-brand: #087565;');
});

test('long component headings fit narrow screens with wider fallback fonts', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const slug of ['segmented-control', 'circular-progress']) {
    await page.goto('/ui/components/' + slug);
    const heading = page.getByRole('heading', { level: 1 });
    // System font metrics differ between Windows and the Linux CI runner.
    await heading.evaluate((element) => {
      element.style.fontFamily = 'monospace';
    });
    for (const dir of ['ltr', 'rtl']) {
      await page
        .locator('html')
        .evaluate((element, direction) => element.setAttribute('dir', direction), dir);
      for (const theme of ['light', 'dark']) {
        await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
        expect(
          await heading.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            const range = document.createRange();
            range.selectNodeContents(element);
            return [...range.getClientRects()].every(
              (line) => line.left >= bounds.left - 1 && line.right <= bounds.right + 1,
            );
          }),
          slug + ' heading in ' + dir + '/' + theme,
        ).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
  }
});

for (let start = 0; start < midpointCatalog.length; start += 10) {
  const group = midpointCatalog.slice(start, start + 10);
  test(
    'midpoint layouts, RTL and themes: ' + group.map((item) => item.name).join(', '),
    async ({ page }) => {
      test.slow();
      for (const item of group) {
        await page.goto('/ui/components/' + item.slug);
        await expect(page.locator('[data-component-preview="' + item.slug + '"]')).toBeVisible();
        await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
        for (const width of [320, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            item.name + ' at ' + width,
          ).toBe(true);
        }
        await page.getByRole('combobox', { name: 'Site theme' }).selectOption('dark');
        await expect(page.locator('[data-component-preview="' + item.slug + '"]')).toBeVisible();
      }
    },
  );
}
