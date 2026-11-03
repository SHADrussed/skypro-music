import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const sourceURLs = [...fs.readFileSync('src/data/data.ts', 'utf8').matchAll(/https:[^'\s]+\.mp3/g)].map(match => match[0]);

test('real MP3 URLs decode and actually play without intercepted responses', async ({ page }, testInfo) => {
  test.skip(!process.env.QA_REAL_AUDIO, 'Run QA_REAL_AUDIO=1 npm run qa for the external-source audit.');
  test.setTimeout(180000);
  const errors = [];
  const results = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`${request.url()}: ${request.failure()?.errorText}`); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('/');
  const rows = page.locator('[class*="playlist__item"]');
  expect(await rows.count()).toBe(sourceURLs.length);
  for (let i = 0; i < await rows.count(); i++) {
    await rows.nth(i).getByRole('button').click();
    await expect(page.locator('audio')).toHaveAttribute('src', sourceURLs[i]);
    await expect.poll(() => page.locator('audio').evaluate(audio => audio.currentSrc), { timeout: 20000 }).toBe(sourceURLs[i]);
    await expect(page.getByRole('button', { name: 'Пауза', exact: true })).toBeVisible({ timeout: 20000 });
    await expect.poll(() => page.locator('audio').evaluate(audio => !audio.paused && audio.readyState >= 3), { timeout: 20000 }).toBe(true);
    const initialTime = await page.locator('audio').evaluate(audio => audio.currentTime);
    await expect.poll(() => page.locator('audio').evaluate(audio => audio.currentTime), { timeout: 20000 }).toBeGreaterThan(initialTime + 0.15);
    const result = await page.locator('audio').evaluate(audio => ({
      url: audio.currentSrc, currentTime: audio.currentTime, duration: audio.duration,
      paused: audio.paused, readyState: audio.readyState, error: audio.error?.message ?? null,
    }));
    expect(result.paused).toBe(false); expect(result.error).toBeNull();
    results.push(result);
  }
  await testInfo.attach('real-source-playback', { body: JSON.stringify({ results, errors }, null, 2), contentType: 'application/json' });
  expect(errors).toEqual([]);
});

test('advanced controls operate on the actual remote MP3 audio', async ({ page }, testInfo) => {
  test.skip(!process.env.QA_REAL_AUDIO, 'Enable QA_REAL_AUDIO for external-source checks.');
  test.setTimeout(180000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`${request.url()}: ${request.failure()?.errorText}`); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('/');
  const media = page.locator('audio');
  const seek = page.getByRole('slider', { name: 'Позиция воспроизведения' });
  await page.locator('[class*="playlist__item"]').first().getByRole('button').click();
  await expect.poll(() => media.evaluate(el => el.currentTime), { timeout: 20000 }).toBeGreaterThan(0.15);
  const duration = await media.evaluate(el => el.duration);
  expect(duration).toBeGreaterThan(100);
  await page.getByRole('button', { name: 'Пауза', exact: true }).click();
  for (const value of [0, duration / 2]) {
    await seek.fill(String(Math.round(value * 100) / 100));
    await expect.poll(() => media.evaluate(el => el.currentTime), { timeout: 15000 }).toBeCloseTo(value, 1);
    expect(await media.evaluate(el => el.paused)).toBe(true);
  }
  for (const value of [0, 0.5, 1]) {
    await page.getByRole('slider', { name: 'Громкость' }).fill(String(value));
    await expect.poll(() => media.evaluate(el => el.volume)).toBe(value);
  }
  await page.getByRole('button', { name: 'Случайный порядок', exact: true }).click();
  await page.getByRole('button', { name: 'Повтор трека', exact: true }).click();
  await seek.fill(String(Math.round((duration - 0.5) * 100) / 100));
  await expect.poll(() => media.evaluate(el => el.readyState), { timeout: 15000 }).toBeGreaterThanOrEqual(3);
  await page.getByRole('button', { name: 'Воспроизвести', exact: true }).click();
  await expect.poll(() => media.evaluate(el => el.currentTime), { timeout: 20000 }).toBeLessThan(2);
  await expect(media).toHaveAttribute('src', sourceURLs[0]);
  expect(await media.evaluate(el => el.loop)).toBe(true);
  await page.getByRole('button', { name: 'Повтор трека', exact: true }).click();
  await page.getByRole('button', { name: 'Случайный порядок', exact: true }).click();
  await seek.fill(String(Math.round((duration - 0.3) * 100) / 100));
  await expect(media).toHaveAttribute('src', sourceURLs[1], { timeout: 20000 });
  await expect.poll(() => media.evaluate(el => el.currentTime), { timeout: 20000 }).toBeGreaterThan(0.15);
  await page.getByRole('button', { name: 'Следующий трек', exact: true }).click();
  await expect(media).toHaveAttribute('src', sourceURLs[2]);
  await expect.poll(() => media.evaluate(el => el.currentTime), { timeout: 20000 }).toBeGreaterThan(0.15);
  await page.getByRole('button', { name: 'Предыдущий трек', exact: true }).click();
  await expect(media).toHaveAttribute('src', sourceURLs[1]);
  await expect.poll(() => media.evaluate(el => el.currentTime), { timeout: 20000 }).toBeGreaterThan(0.15);
  await testInfo.attach('real-advanced-playback', { body: JSON.stringify({ duration, source: await media.evaluate(el => el.currentSrc), errors }, null, 2), contentType: 'application/json' });
  expect(errors).toEqual([]);
});
