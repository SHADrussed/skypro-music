import { test, expect } from '@playwright/test';
import { makeWav, fulfillAudio } from './fixtures/audio.mjs';

const audio = page => page.locator('audio');
const rows = page => page.locator('[class*="playlist__item"]');
const choose = (page, index) => rows(page).nth(index).getByRole('button').click();
const next = page => page.getByRole('button', { name: 'Следующий трек', exact: true });
const previous = page => page.getByRole('button', { name: 'Предыдущий трек', exact: true });
const shuffle = page => page.getByRole('button', { name: 'Случайный порядок', exact: true });
const loop = page => page.getByRole('button', { name: 'Повтор трека', exact: true });
const seek = page => page.getByRole('slider', { name: 'Позиция воспроизведения' });
const currentSource = page => audio(page).evaluate(el => el.getAttribute('src'));
const errors = new WeakMap();

async function playing(page) {
  await expect.poll(() => audio(page).evaluate(el => !el.paused && el.readyState >= 3 && !el.error)).toBe(true);
  const time = await audio(page).evaluate(el => el.currentTime);
  await expect.poll(() => audio(page).evaluate(el => el.currentTime)).toBeGreaterThan(time + 0.1);
  await expect(page.getByTestId('playback-indicator')).toHaveAttribute('data-playing', 'true');
}

test.beforeEach(async ({ page }) => {
  const diagnostics = [];
  errors.set(page, diagnostics);
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (message.type() === 'error') diagnostics.push(message.text()); });
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') diagnostics.push(`${request.url()}: ${request.failure()?.errorText}`); });
  page.on('response', response => { if (response.status() >= 400) diagnostics.push(`${response.status()} ${response.url()}`); });
  const wav = makeWav();
  await page.route('**/media/music_files/*.mp3', route => fulfillAudio(route, wav));
});

test.afterEach(async ({ page }, info) => {
  await info.attach('browser-diagnostics', { body: JSON.stringify(errors.get(page)), contentType: 'application/json' });
  expect(errors.get(page)).toEqual([]);
});

test('next/previous respect boundaries and switch actual playback', async ({ page }) => {
  await page.goto('/');
  await expect(next(page)).toBeDisabled(); await expect(previous(page)).toBeDisabled();
  await choose(page, 0); await playing(page);
  const first = await currentSource(page);
  await expect(previous(page)).toBeDisabled();
  await next(page).click(); await playing(page);
  expect(await currentSource(page)).not.toBe(first);
  await previous(page).click(); await playing(page);
  expect(await currentSource(page)).toBe(first);
  await choose(page, 9); await playing(page);
  const last = await currentSource(page);
  await expect(next(page)).toBeDisabled();
  await previous(page).click(); await playing(page);
  expect(await currentSource(page)).not.toBe(last);
  await expect(audio(page)).toHaveCount(1);
});

test('natural ended advances to the next track', async ({ page }) => {
  await page.route('**/Alexander_Nakarada_-_Chase.mp3', route => fulfillAudio(route, makeWav(1.5)));
  await page.goto('/'); await choose(page, 0); await playing(page);
  await expect(audio(page)).toHaveAttribute('src', /Frank_Schroter/);
  await playing(page);
});

test('shuffle avoids repeats within a cycle and previous retraces playback history', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.5; });
  await page.goto('/'); await choose(page, 0); await playing(page);
  await shuffle(page).click();
  await expect(shuffle(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(shuffle(page).locator('svg')).toHaveCSS('stroke', 'rgb(255, 255, 255)');
  const history = [await currentSource(page)];
  for (let i = 0; i < 9; i++) {
    await next(page).click(); await playing(page);
    history.push(await currentSource(page));
  }
  expect(new Set(history).size).toBe(10);
  expect(history[1]).not.toContain('Frank_Schroter');
  await next(page).click(); await playing(page);
  expect(await currentSource(page)).not.toBe(history[9]);
  await previous(page).click();
  await expect(audio(page)).toHaveAttribute('src', history[9]);
  for (let i = 8; i >= 0; i--) {
    await previous(page).click();
    await expect(audio(page)).toHaveAttribute('src', history[i]);
  }
  await expect(previous(page)).toBeDisabled();
  await next(page).click();
  await expect(audio(page)).toHaveAttribute('src', history[1]);
  await shuffle(page).click();
  await expect(shuffle(page)).toHaveAttribute('aria-pressed', 'false');
  await choose(page, 0); await next(page).click();
  await expect(audio(page)).toHaveAttribute('src', /Frank_Schroter/);
});

test('loop has priority over shuffle, and disabling loop allows ended navigation', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.5; });
  await page.route('**/Alexander_Nakarada_-_Chase.mp3', route => fulfillAudio(route, makeWav(1.5)));
  await page.goto('/'); await shuffle(page).click(); await loop(page).click();
  await expect(loop(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(loop(page).locator('svg')).toHaveCSS('stroke', 'rgb(255, 255, 255)');
  await choose(page, 0); await playing(page);
  expect(await audio(page).evaluate(el => el.loop)).toBe(true);
  const source = await currentSource(page);
  const initial = await audio(page).evaluate(el => el.currentTime);
  await expect.poll(() => audio(page).evaluate(el => el.currentTime), { timeout: 5000 }).toBeLessThan(initial);
  expect(await currentSource(page)).toBe(source);
  await playing(page);
  await loop(page).click();
  await expect(loop(page)).toHaveAttribute('aria-pressed', 'false');
  expect(await audio(page).evaluate(el => el.loop)).toBe(false);
  await expect.poll(() => currentSource(page), { timeout: 5000 }).not.toBe(source);
  await expect(audio(page)).toHaveAttribute('src', /Epic_Heroic_Conquest/);
  await playing(page);
});

test('seek and volume control real media properties without restarting the track', async ({ page }, info) => {
  await page.goto('/'); await choose(page, 0); await playing(page);
  await expect(seek(page)).toHaveAttribute('max', '12');
  await page.getByRole('button', { name: 'Пауза', exact: true }).click();
  const source = await currentSource(page);
  for (const value of [0, 6, 12]) {
    await seek(page).fill(String(value));
    await expect.poll(() => audio(page).evaluate(el => el.currentTime)).toBeCloseTo(value, 1);
    await expect(page.getByTestId('playback-time')).toHaveText(`${value === 0 ? '00:00' : value === 6 ? '00:06' : '00:12'} / 00:12`);
    expect(await audio(page).evaluate(el => el.paused)).toBe(true);
    expect(await currentSource(page)).toBe(source);
  }
  const volume = page.getByRole('slider', { name: 'Громкость' });
  for (const value of [0, 0.5, 1]) {
    await volume.fill(String(value));
    await expect.poll(() => audio(page).evaluate(el => el.volume)).toBe(value);
  }
  await seek(page).fill('6');
  await page.getByRole('button', { name: 'Воспроизвести', exact: true }).click(); await playing(page);
  expect(await audio(page).evaluate(el => el.currentTime)).toBeGreaterThan(6);
  await volume.fill('0.5'); await next(page).click(); await playing(page);
  expect(await audio(page).evaluate(el => el.volume)).toBe(0.5);
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
    const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(el => `${el.tagName}.${el.className}`));
  expect(overflow).toEqual([]);
  await page.screenshot({ path: info.outputPath('advanced-player.png'), fullPage: true });
});
