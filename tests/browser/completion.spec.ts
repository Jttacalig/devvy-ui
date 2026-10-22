import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { completionCatalog } from '../../apps/docs/lib/completion-catalog';
async function visit(page: Page, path: string) {
  await page.goto(path);
  const preview = page.locator('.component-preview');
  if (await preview.count()) await expect(preview).toHaveAttribute('data-ready', 'true');
}

test('popover, menu and hover card preserve keyboard focus and dismissal', async ({ page }) => {
  await visit(page, '/ui/components/popover');
  const trigger = page.getByRole('button', { name: 'Project settings', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Project name' })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await visit(page, '/ui/components/dropdown-menu');
  await page.getByRole('button', { name: 'Project actions', exact: true }).click();
  await expect(page.getByRole('menuitem', { name: /Save project/ })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Duplicate project' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.completion-result')).toHaveText('Project duplicated.');
  await visit(page, '/ui/components/hover-card');
  await page.getByRole('button', { name: 'About Dev Station', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Visit Dev Station' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'About Dev Station', exact: true })).toBeFocused();
});

test('tooltip supports focus, hover and Escape without trapping focus', async ({ page }) => {
  await visit(page, '/ui/components/tooltip');
  await page.getByRole('button', { name: 'About autosave' }).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).not.toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'About autosave' })).not.toBeFocused();
  await page.setViewportSize({ width: 320, height: 900 });
  await page.locator('.completion-preview').evaluate((el) => {
    el.style.display = 'flex';
    el.style.justifyContent = 'flex-end';
  });
  await page.getByRole('button', { name: 'About autosave' }).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  const tip = await page.getByRole('tooltip').boundingBox();
  expect(tip!.x).toBeGreaterThanOrEqual(0);
  expect(tip!.x + tip!.width).toBeLessThanOrEqual(320);
});

test('menu surfaces retain scoped theme variables and context/menubar keyboard access', async ({
  page,
}) => {
  await visit(page, '/ui/components/dropdown-menu');
  await page
    .locator('.completion-preview')
    .evaluate((el) => el.style.setProperty('--dvy-background', '#f1ece2'));
  await page.getByRole('button', { name: 'Project actions', exact: true }).click();
  await expect(page.getByRole('menu')).toHaveCSS('background-color', 'rgb(241, 236, 226)');
  await page.keyboard.press('Escape');
  await visit(page, '/ui/components/menubar');
  await page.getByRole('menuitem', { name: 'File', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Undo changes' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menuitem', { name: /Save project/ })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Undo changes' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeFocused();
  await visit(page, '/ui/components/context-menu');
  await page.getByRole('button', { name: 'Card actions', exact: true }).focus();
  await page.keyboard.press('Shift+F10');
  await expect(page.getByRole('menuitem', { name: /Save project/ })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('editable selection, multiple choices and tags update actual values', async ({ page }) => {
  await visit(page, '/ui/components/combobox');
  const framework = page.getByRole('combobox', { name: 'Framework', exact: true });
  await framework.fill('Next');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(framework).toHaveValue('Next.js');
  await expect(page.locator('input[name="framework"]')).toHaveValue('next');
  await framework.fill('Vite');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(framework).toHaveValue('Vite');
  await visit(page, '/ui/components/autocomplete');
  await page.getByRole('combobox', { name: 'Framework suggestion' }).fill('My framework');
  await expect(page.locator('.completion-result')).toContainText('My framework');
  await visit(page, '/ui/components/multi-select');
  await page.locator('.dvy-multi-select summary').click();
  await page.getByRole('checkbox', { name: 'React', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Vite', exact: true }).check();
  await expect(page.getByRole('checkbox', { name: 'Future adapter' })).toBeDisabled();
  await visit(page, '/ui/components/tag-input');
  await page.getByRole('textbox', { name: 'Project tags' }).fill('design');
  await page.keyboard.press('Enter');
  await expect(page.locator('input[name="tags"]')).toHaveValue('design');
  await page.getByRole('button', { name: 'Remove design' }).click();
  await expect(page.locator('input[name="tags"]')).toHaveCount(0);
});

test('OTP and date forms preserve native validation, submission and reset', async ({ page }) => {
  await visit(page, '/ui/components/otp-input');
  const code = page.getByRole('textbox', { name: 'Verification code' });
  await page.getByRole('button', { name: 'Check code' }).click();
  expect(await code.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  await code.fill('123456');
  await page.getByRole('button', { name: 'Check code' }).click();
  await expect(page.locator('.completion-result')).toHaveText('Code entered: 123456');
  await page.getByRole('button', { name: 'Reset code' }).click();
  await expect(code).toHaveValue('');
  await code.fill('654321');
  await code.evaluate((input: HTMLInputElement) =>
    input.form!.addEventListener('reset', (event) => event.preventDefault(), { once: true }),
  );
  await page.getByRole('button', { name: 'Reset code' }).click();
  await expect(code).toHaveValue('654321');
  await visit(page, '/ui/components/date-range-picker');
  await page.getByLabel('Travel dates start date', { exact: true }).fill('2026-10-23');
  await page.getByLabel('Travel dates end date', { exact: true }).fill('2026-10-22');
  expect(
    await page
      .getByLabel('Travel dates end date', { exact: true })
      .evaluate((el: HTMLInputElement) => el.checkValidity()),
  ).toBe(false);
  await page.getByLabel('Travel dates end date', { exact: true }).fill('2026-10-25');
  await page.getByRole('button', { name: 'Save dates' }).click();
  await expect(page.locator('.completion-result')).toHaveText('Travel dates saved.');
  await page.getByRole('button', { name: 'Reset dates' }).click();
  await expect(page.getByLabel('Travel dates start date', { exact: true })).toHaveValue('');
});

test('file chooser validates size and real drag-and-drop keeps native files', async ({ page }) => {
  await visit(page, '/ui/components/file-upload');
  const upload = page.getByLabel('Project files', { exact: true });
  await upload.setInputFiles({
    name: 'large.txt',
    mimeType: 'text/plain',
    buffer: Buffer.alloc(4097),
  });
  await expect(page.locator('.dvy-file-upload .dvy-field-error')).toContainText('each under 4 KB');
  await upload.setInputFiles({
    name: 'notes.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Owned source'),
  });
  await expect(page.locator('.completion-result')).toHaveText('1 files selected.');
  await page.getByRole('button', { name: 'Reset files' }).click();
  expect(await upload.evaluate((el: HTMLInputElement) => el.files?.length)).toBe(0);
  await visit(page, '/ui/components/dropzone');
  const data = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['A design note'], 'drop.txt', { type: 'text/plain' }));
    return transfer;
  });
  await page.locator('.dvy-dropzone').dispatchEvent('drop', { dataTransfer: data });
  await expect(page.locator('.completion-result')).toHaveText('1 assets selected.');
  expect(
    await page
      .getByLabel('Project assets', { exact: true })
      .evaluate((el: HTMLInputElement) => el.files?.[0]?.name),
  ).toBe('drop.txt');
});

test('calendar supports actual month movement, selection and RTL day keys', async ({ page }) => {
  await visit(page, '/ui/components/calendar');
  const day = page.getByRole('button', { name: 'Saturday, October 31, 2026' });
  await day.focus();
  await page.keyboard.press('PageDown');
  await expect(page.getByRole('button', { name: 'Monday, November 30, 2026' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.completion-result')).toContainText('2026-11-30');
  await page.keyboard.press('PageUp');
  await expect(page.getByRole('button', { name: 'Friday, October 30, 2026' })).toBeFocused();
});

test('tree navigation, resizer keys and pointer movement change real state', async ({ page }) => {
  await visit(page, '/ui/components/tree-view');
  await page.getByRole('treeitem', { name: 'Source', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('treeitem', { name: 'App.tsx', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('treeitem', { name: 'README.md', exact: true })).toBeFocused();
  await visit(page, '/ui/components/resizable-panels');
  const divider = page.getByRole('separator', { name: 'Resize workspace panels' });
  await divider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(divider).toHaveAttribute('aria-valuenow', '51');
  await page.keyboard.press('Home');
  await expect(divider).toHaveAttribute('aria-valuenow', '10');
  const bounds = await divider.boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + 100, bounds!.y + 10);
  await page.mouse.up();
  expect(Number(await divider.getAttribute('aria-valuenow'))).toBeGreaterThan(10);
});

test('native dialogs return focus and command search executes a chosen action', async ({
  page,
}) => {
  for (const [slug, label] of [
    ['drawer', 'Open workspace details'],
    ['alert-dialog', 'Archive project'],
    ['onboarding-tour', 'Start workspace tour'],
  ] as const) {
    await visit(page, '/ui/components/' + slug);
    const invoker = page.getByRole('button', { name: label, exact: true });
    await invoker.click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(invoker).toBeFocused();
  }
  await visit(page, '/ui/components/command-palette');
  await page.getByRole('button', { name: 'Open quick actions' }).click();
  await page.getByRole('combobox', { name: 'Search commands' }).fill('duplicate');
  await page.keyboard.press('Enter');
  await expect(page.locator('.completion-result')).toHaveText('Project duplicated.');
  await expect(page.getByRole('button', { name: 'Open quick actions' })).toBeFocused();
});

test('data table filters, sorts, paginates and shows empty feedback', async ({ page }) => {
  await visit(page, '/ui/components/data-table');
  const table = page.getByRole('table', { name: 'Project directory' });
  await expect(table.getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(table).toContainText('Dev Station studio');
  await page.getByRole('searchbox', { name: 'Filter Project directory' }).fill('atlas');
  await expect(table).toContainText('Atlas design');
  await page.getByRole('searchbox', { name: 'Filter Project directory' }).fill('nothing matches');
  await expect(table).toContainText('No matching records.');
  await page.getByRole('searchbox', { name: 'Filter Project directory' }).fill('');
  await page.getByRole('button', { name: /Project/ }).click();
  await expect(table.locator('th').first()).toHaveAttribute('aria-sort', 'ascending');
});

test('media, gallery, canvas export and manual carousel work with local assets', async ({
  page,
}) => {
  await visit(page, '/ui/components/carousel');
  await page.getByRole('button', { name: 'Next slide' }).click();
  await expect(page.getByRole('img', { name: 'Field notes geometric study' })).toBeVisible();
  await visit(page, '/ui/components/gallery');
  const image = page.getByRole('button', { name: /Orbit geometric study/ });
  await image.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Next image' }).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Image 2 of 3');
  await page.keyboard.press('Escape');
  await expect(image).toBeFocused();
  await visit(page, '/ui/components/image-cropper');
  await page.getByRole('button', { name: /Export/ }).click();
  await expect(page.locator('.completion-result')).toContainText('PNG crop ready:');
  await visit(page, '/ui/components/audio-player');
  await page.locator('audio').evaluate(async (el: HTMLAudioElement) => {
    el.muted = true;
    await el.play();
  });
  expect(await page.locator('audio').evaluate((el: HTMLAudioElement) => el.paused)).toBe(false);
  await page.locator('audio').evaluate((el: HTMLAudioElement) => el.pause());
  await visit(page, '/ui/components/video-player');
  await expect(page.locator('video')).toHaveAttribute('controls', '');
  await expect(page.locator('video track')).toHaveAttribute('src', '/examples/studio.vtt');
  expect(
    await page.locator('video').evaluate(async (el: HTMLVideoElement) => {
      el.muted = true;
      await el.play();
      el.pause();
      return el.readyState >= 2;
    }),
  ).toBe(true);
});

test('Markdown editor previews escaped source and mention insertion preserves text', async ({
  page,
}) => {
  await visit(page, '/ui/components/rich-text-editor');
  const editor = page.getByRole('textbox', { name: 'Release notes' });
  await editor.fill('Hello <img src=x onerror=alert(1)>');
  await expect(page.locator('.dvy-markdown')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.dvy-markdown img')).toHaveCount(0);
  await visit(page, '/ui/components/mentions-input');
  const comment = page.getByRole('textbox', { name: 'Team comment' });
  await comment.fill('Hello @be');
  await page.keyboard.press('Enter');
  await expect(comment).toHaveValue('Hello @bea ');
  await expect(comment).toBeFocused();
  await comment.fill('@');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
});

test('large list retains focused rows and provides a complete accessible alternative', async ({
  page,
}) => {
  await visit(page, '/ui/components/virtual-list');
  const first = page.getByRole('button', { name: 'Project record 1', exact: true });
  await first.focus();
  await page.locator('.dvy-virtual-viewport').evaluate((el) => {
    el.scrollTop = 4800;
  });
  await expect(first).toBeFocused();
  expect(await page.locator('.dvy-virtual-list [role="listitem"]').count()).toBeLessThan(20);
  await expect(
    page.getByRole('button', { name: 'Project record 102', exact: true }),
  ).toBeAttached();
  await page.getByRole('button', { name: 'Show all items' }).click();
  await expect(page.locator('.dvy-virtual-list [role="listitem"]')).toHaveCount(500);
});

test('async loading retries and board/list moves have non-drag alternatives', async ({ page }) => {
  await visit(page, '/ui/components/infinite-scroll');
  await page.getByRole('checkbox', { name: 'Simulate loading error' }).check();
  await page.getByRole('button', { name: 'Load more' }).click();
  await expect(page.locator('.dvy-infinite-scroll [role="status"]')).toHaveText(
    'Could not load more. Try again.',
  );
  await page.getByRole('checkbox', { name: 'Simulate loading error' }).uncheck();
  await page.getByRole('button', { name: /Retry/ }).click();
  await expect(page.locator('.dvy-infinite-scroll li')).toHaveCount(6);
  await visit(page, '/ui/components/kanban-board');
  const move = page.getByRole('combobox', { name: /Move Review components/ });
  await move.selectOption('done');
  await expect(move).toHaveValue('done');
  await expect(move).toBeFocused();
  await visit(page, '/ui/components/sortable-list');
  await page.getByRole('button', { name: /Move Design the interface down/ }).click();
  await expect(page.locator('.dvy-sortable-list li').first()).toContainText('Build the components');
});

test('landing workspace creates projects and exposes working row actions', async ({ page }) => {
  await visit(page, '/ui');
  await page.getByRole('button', { name: /New project/ }).click();
  await page.getByRole('textbox', { name: /Project name/ }).fill('A new idea');
  await page.getByRole('button', { name: 'Create project', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /New project/ })).toBeFocused();
  await expect(page.getByRole('table', { name: 'Your projects' })).toContainText('A new idea');
  await page.getByRole('button', { name: 'Actions for A new idea' }).click();
  await page.getByRole('menuitem', { name: 'Mark ready for review' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'A new idea is ready' })).toBeVisible();
  for (const theme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Site theme' }).selectOption(theme);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

for (let start = 0; start < completionCatalog.length; start += 10) {
  const group = completionCatalog.slice(start, start + 10);
  test(
    'completion responsive themes and RTL: ' + group.map((item) => item.name).join(', '),
    async ({ page }) => {
      test.slow();
      for (const item of group) {
        await visit(page, '/ui/components/' + item.slug);
        for (const dir of ['ltr', 'rtl']) {
          await page
            .locator('html')
            .evaluate((el, direction) => el.setAttribute('dir', direction), dir);
          for (const width of [320, 768, 1024, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            expect(
              await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
              item.name + '/' + dir + '/' + width,
            ).toBe(true);
          }
        }
        await page.getByRole('combobox', { name: 'Site theme' }).selectOption('dark');
        await expect(page.locator('[data-component-preview="' + item.slug + '"]')).toBeVisible();
      }
    },
  );
}

test('tour progression, loading feedback and notification pause/dismiss work', async ({ page }) => {
  await visit(page, '/ui/components/onboarding-tour');
  await page.getByRole('button', { name: 'Start workspace tour' }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Make it your own');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Welcome to your workspace');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(page.locator('.completion-result')).toHaveText('Workspace tour completed.');
  await expect(page.locator('.dvy-tour-target')).toHaveCount(0);
  await visit(page, '/ui/components/loading-overlay');
  await page.getByRole('button', { name: 'Refresh projects' }).click();
  await expect(page.locator('.dvy-loading-overlay')).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Finish refresh' }).click();
  await expect(page.locator('.dvy-loading-overlay')).toHaveAttribute('aria-busy', 'false');
  await visit(page, '/ui/components/toast');
  await page.clock.install();
  await page.getByRole('button', { name: 'Save project', exact: true }).click();
  await page.getByRole('button', { name: 'Dismiss notification' }).hover();
  await page.clock.fastForward(6000);
  await expect(page.locator('.dvy-toast')).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.locator('.dvy-toast')).not.toBeVisible();
});
