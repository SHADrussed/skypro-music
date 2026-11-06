import { test, expect } from '@playwright/test';

// Real PCM audio: Chromium decodes and plays this, no play()/pause() mocks.
const sampleRate = 8000;
const samples = sampleRate * 12;
const wav = Buffer.alloc(44 + samples * 2);
wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4);
wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24); wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write('data', 36); wav.writeUInt32LE(samples * 2, 40);
for (let i = 0; i < samples; i++) wav.writeInt16LE(Math.round(1000 * Math.sin(2 * Math.PI * 440 * i / sampleRate)), 44 + i * 2);

const rows = page => page.locator('[class*="playlist__item"]');
const choose = (page, index) => rows(page).nth(index).getByRole('button').click();
const media = page => page.locator('audio');
const indicator = page => page.getByTestId('playback-indicator');

async function expectPlaying(page) {
  await expect(page.getByRole('button', { name: 'Пауза', exact: true })).toBeVisible();
  await expect.poll(() => media(page).evaluate(audio => !audio.paused && !audio.ended && audio.readyState >= 3)).toBe(true);
  const time = await media(page).evaluate(audio => audio.currentTime);
  await expect.poll(() => media(page).evaluate(audio => audio.currentTime)).toBeGreaterThan(time + 0.15);
  await expect(indicator(page)).toHaveAttribute('data-playing', 'true');
  await expect(indicator(page)).toHaveCSS('animation-name', /pulse/);
}

test.beforeEach(async ({ page }) => {
  await page.route('**/media/music_files/*.mp3', route => route.fulfill({ contentType: 'audio/wav', body: wav }));
});

test('selection, actual playback, pause/resume, switch and a single audio element', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text()); });
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(request.url()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Воспроизвести', exact: true })).toBeDisabled();
  await choose(page, 0);
  await expectPlaying(page);
  await expect(media(page)).toHaveCount(1);
  await expect(media(page)).toHaveAttribute('src', /Alexander_Nakarada_-_Chase.mp3$/);
  const bar = page.locator('[class*="bar__content"]');
  await expect(bar).toContainText('Chase');
  await expect(bar).toContainText('Alexander Nakarada');
  await page.getByRole('button', { name: 'Пауза', exact: true }).click();
  await expect.poll(() => media(page).evaluate(audio => audio.paused)).toBe(true);
  const pausedAt = await media(page).evaluate(audio => audio.currentTime);
  await expect(indicator(page)).toHaveAttribute('data-playing', 'false');
  await expect(indicator(page)).toHaveCSS('animation-name', 'none');
  await expect.poll(async () => {
    await page.waitForTimeout(200);
    return media(page).evaluate(audio => audio.currentTime);
  }).toBe(pausedAt);
  await page.getByRole('button', { name: 'Воспроизвести', exact: true }).click();
  await expectPlaying(page);
  expect(await media(page).evaluate(audio => audio.currentTime)).toBeGreaterThan(pausedAt);
  await choose(page, 1);
  await expectPlaying(page);
  await expect(media(page)).toHaveCount(1);
  await expect(media(page)).toHaveAttribute('src', /Frank_Schroter_-_Open_Sea_epic.mp3$/);
  await expect(bar).toContainText('Open Sea epic');
  await expect(bar).toContainText('Frank Schroter');
  await expect(rows(page).nth(0).getByTestId('playback-indicator')).toHaveCount(0);
  await expect(rows(page).nth(1).getByTestId('playback-indicator')).toHaveCount(1);
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
    const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(el => `${el.tagName}.${el.className}`));
  expect(overflow).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('audio-playing.png'), fullPage: true });
  await testInfo.attach('browser-diagnostics', { body: JSON.stringify(errors), contentType: 'application/json' });
  expect(errors).toEqual([]);
});

test('last track ends without wrapping; selecting the same track restarts', async ({ page }) => {
  await page.goto('/'); await choose(page, 9); await expectPlaying(page);
  await expect.poll(() => media(page).evaluate(audio => audio.ended), { timeout: 15000 }).toBe(true);
  await expect(indicator(page)).toHaveAttribute('data-playing', 'false');
  await expect(page.getByRole('button', { name: 'Воспроизвести', exact: true })).toBeEnabled();
  await choose(page, 9); await expectPlaying(page);
});

test('unavailable source stays stopped and recovers on another track', async ({ page }) => {
  await page.route('**/Alexander_Nakarada_-_Chase.mp3', route => route.fulfill({ status: 404, body: 'missing' }));
  await page.goto('/'); await choose(page, 0);
  await expect(page.locator('p[role=alert]')).toBeVisible();
  await expect.poll(() => media(page).evaluate(audio => audio.error !== null)).toBe(true);
  await expect(indicator(page)).toHaveAttribute('data-playing', 'false');
  await expect(indicator(page)).toHaveCSS('animation-name', 'none');
  await choose(page, 1); await expectPlaying(page);
  await expect(page.locator('p[role=alert]')).toHaveCount(0);
});

test('rejected play promise is handled without claiming playback', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    let rejectOnce = true;
    HTMLMediaElement.prototype.play = function () {
      if (rejectOnce) { rejectOnce = false; return Promise.reject(new DOMException('Test autoplay denial', 'NotAllowedError')); }
      return play.call(this);
    };
  });
  await page.goto('/'); await choose(page, 0);
  await expect(page.locator('p[role=alert]')).toBeVisible();
  await expect(indicator(page)).toHaveAttribute('data-playing', 'false');
  expect(await media(page).evaluate(audio => audio.paused)).toBe(true);
  await page.getByRole('button', { name: 'Воспроизвести', exact: true }).click();
  await expectPlaying(page); expect(errors).toEqual([]);
});

test('rapid selection cancels the previous pending play request', async ({ page }) => {
  await page.route('**/Alexander_Nakarada_-_Chase.mp3', async route => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await route.fulfill({ contentType: 'audio/wav', body: wav }).catch(() => {});
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/'); await choose(page, 0); await choose(page, 1);
  await expectPlaying(page);
  await expect(media(page)).toHaveAttribute('src', /Frank_Schroter/);
  await expect(media(page)).toHaveCount(1);
  await expect(page.locator('p[role=alert]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('retry the same source after a temporary load failure', async ({ page }) => {
  let attempts = 0;
  await page.route('**/Alexander_Nakarada_-_Chase.mp3', route => {
    attempts++;
    return route.fulfill(attempts === 1
      ? { status: 404, body: 'temporarily missing' }
      : { contentType: 'audio/wav', body: wav });
  });
  await page.goto('/'); await choose(page, 0);
  await expect(page.locator('p[role=alert]')).toBeVisible();
  await page.getByRole('button', { name: 'Воспроизвести', exact: true }).click();
  await expectPlaying(page);
  expect(attempts).toBeGreaterThan(1);
  await expect(page.locator('p[role=alert]')).toHaveCount(0);
});

test('pending playback can be paused before the source finishes loading', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/Alexander_Nakarada_-_Chase.mp3', async route => {
    await gate;
    await route.fulfill({ contentType: 'audio/wav', body: wav });
  });
  await page.goto('/'); await choose(page, 0);
  try {
    await expect.poll(() => media(page).evaluate(audio => audio.paused)).toBe(false);
    await expect(indicator(page)).toHaveAttribute('data-playing', 'false');
    await page.getByRole('button', { name: 'Пауза', exact: true }).click({ timeout: 3000 });
    expect(await media(page).evaluate(audio => audio.paused)).toBe(true);
    release();
    await expect.poll(() => media(page).evaluate(audio => audio.readyState)).toBeGreaterThanOrEqual(3);
    expect(await media(page).evaluate(audio => audio.paused)).toBe(true);
    await expect(indicator(page)).toHaveAttribute('data-playing', 'false');
    await page.getByRole('button', { name: 'Воспроизвести', exact: true }).click();
    await expectPlaying(page);
  } finally { release(); }
});

test('navigation disposes the previous audio element before returning to the player', async ({ page }) => {
  await page.goto('/'); await choose(page, 0); await expectPlaying(page);
  await media(page).evaluate(audio => { window.retiredAudio = audio; });
  await page.getByRole('button', { name: 'Меню', exact: true }).click();
  await page.getByRole('link', { name: 'Мои треки', exact: true }).click();
  await expect(page).toHaveURL(/\/favourites$/);
  await expect.poll(() => page.evaluate(() => window.retiredAudio.paused && !window.retiredAudio.hasAttribute('src'))).toBe(true);
  await page.goto('/');
  await choose(page, 1); await expectPlaying(page);
  await expect(media(page)).toHaveCount(1);
});

