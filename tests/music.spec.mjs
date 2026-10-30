import { test, expect } from '@playwright/test';
import fs from 'node:fs';

// Read the actual data through TypeScript's parser rather than duplicating fixtures.
import ts from 'typescript';
const source = ts.createSourceFile('data.ts', fs.readFileSync('src/data/data.ts', 'utf8'), ts.ScriptTarget.Latest, true);
const tracks = [];
function visit(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const track = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = property.name.getText(source);
      if (ts.isStringLiteral(property.initializer)) track[key] = property.initializer.text;
      if (ts.isArrayLiteralExpression(property.initializer)) {
        track[key] = property.initializer.elements.filter(ts.isStringLiteral).map(item => item.text);
      }
    }
    if (track.author) tracks.push(track);
  }
  ts.forEachChild(node, visit);
}
visit(source);

const browserErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
});

test.afterEach(async ({ page }, testInfo) => {
  const errors = browserErrors.get(page);
  await testInfo.attach('browser-diagnostics', { body: JSON.stringify({ errors }, null, 2), contentType: 'application/json' });
  expect(errors).toEqual([]);
});

for (const [route, ready] of [['/', 'Треки'], ['/signin', 'Почта'], ['/signup', 'Повторите пароль'], ['/favourites', 'Favourites']]) {
  test(`route ${route}: assets, console, network, geometry`, async ({ page }, testInfo) => {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    if (route === '/' || route === '/favourites') await expect(page.getByRole('heading', { name: ready, exact: true })).toBeVisible();
    else await expect(page.getByRole('textbox', { name: 'Почта', exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
    }).map(element => `${element.tagName}.${element.className}`));
    await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
    await page.screenshot({ path: testInfo.outputPath('viewport.png') });
    expect(overflow).toEqual([]);
  });
}

test('menu toggles by mouse and keyboard and navigates', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Меню', exact: true });
  const link = page.getByRole('link', { name: 'Мои треки', exact: true });
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(link).toHaveCount(0);
  await button.click();
  await expect(link).toBeVisible();
  await button.click();
  await expect(link).toHaveCount(0);
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(link).toBeVisible();
  await page.keyboard.press('Space');
  await expect(link).toHaveCount(0);
  await button.click();
  await link.click();
  await expect(page).toHaveURL(/\/favourites$/);
});

test('filters switch directly, deduplicate data, scroll and leave tracks unchanged', async ({ page }, testInfo) => {
  await page.goto('/');
  const playlist = page.locator('[class*="playlist__item"]');
  const original = await playlist.allTextContents();
  expect(original).toHaveLength(tracks.length);
  const categories = [
    ['исполнителю', [...new Set(tracks.map(track => track.author))]],
    ['году выпуска', ['По возрастанию', 'По убыванию']],
    ['жанру', [...new Set(tracks.flatMap(track => track.genre))]],
  ];
  await expect(page.getByRole('region', { name: /Варианты:/ })).toHaveCount(0);
  for (const [label, options] of categories) {
    const button = page.getByRole('button', { name: label, exact: true });
    await button.click();
    const panels = page.getByRole('region', { name: /Варианты:/ });
    await expect(panels).toHaveCount(1);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(button).toHaveCSS('color', 'rgb(173, 97, 255)');
    await expect(panels.getByRole('button')).toHaveText(options);
    const bounds = await panels.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize().width);
    await page.screenshot({ path: testInfo.outputPath(`${label}.png`) });
    for (const option of options) {
      await panels.getByRole('button', { name: option, exact: true }).click();
      expect(await playlist.allTextContents()).toEqual(original);
    }
    if (label === 'исполнителю') {
      const list = panels.locator('ul');
      expect(await list.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
      await list.evaluate(el => { el.scrollTop = 0; });
      await list.hover();
      await page.mouse.wheel(0, 600);
      await expect.poll(() => list.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      await expect(list.getByRole('button').last()).toBeInViewport();
      await page.screenshot({ path: testInfo.outputPath('authors.png') });
    }
  }
  for (const [label] of categories) {
    const button = page.getByRole('button', { name: label, exact: true });
    // Close the last category before testing each isolated repeated click.
    if (await button.getAttribute('aria-expanded') === 'true') await button.click();
    await button.click();
    await expect(page.getByRole('region', { name: /Варианты:/ })).toHaveCount(1);
    await button.click();
    await expect(page.getByRole('region', { name: /Варианты:/ })).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'исполнителю', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('region', { name: /Варианты:/ })).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: /Варианты:/ })).toHaveCount(0);
});
