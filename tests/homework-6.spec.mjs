import { test, expect } from '@playwright/test';

const track = { _id: 8, name: 'Chase', author: 'Alexander Nakarada', album: 'Chase', release_date: '2005-06-11', genre: ['Классическая музыка'], duration_in_seconds: 205, logo: null, track_file: 'https://example.com/chase.mp3', staredUser: [1] };
const session = { user: { _id: 1, username: 'QA', email: 'qa@example.com' }, access: 'old-access', refresh: 'refresh-token' };

async function signedIn(page) {
  await page.addInitScript(value => localStorage.setItem('skypro-session', JSON.stringify(value)), session);
}

test('favourites requires a session', async ({ page }) => {
  await page.goto('/favourites');
  await expect(page).toHaveURL('/');
});

test('unliking removes the track and logout clears the session', async ({ page }) => {
  await signedIn(page);
  await page.route('**/catalog/track/favorite/all/', route => route.fulfill({ json: { data: [track] } }));
  await page.route('**/catalog/track/8/favorite/', route => route.fulfill({ status: 200, json: { success: true } }));
  await page.goto('/favourites');
  await expect(page.getByRole('heading', { name: 'Мои треки' })).toBeVisible();
  await page.getByRole('button', { name: 'Убрать Chase из избранного' }).first().click();
  await expect(page.getByText('Нет подходящих треков')).toBeVisible();
  await page.getByRole('button', { name: 'Выйти' }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => localStorage.getItem('skypro-session'))).toBeNull();
});

test('failed unlike keeps the track visible and shows the server error', async ({ page }) => {
  await signedIn(page);
  await page.route('**/catalog/track/favorite/all/', route => route.fulfill({ json: { data: [track] } }));
  await page.route('**/catalog/track/8/favorite/', route => route.fulfill({ status: 500, json: { message: 'Ошибка сервера' } }));
  await page.goto('/favourites');
  await page.getByRole('button', { name: 'Убрать Chase из избранного' }).first().click();
  await expect(page.getByText('Ошибка сервера', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Убрать Chase из избранного' }).first()).toBeEnabled();
});

test('401 refreshes once and retries the protected request', async ({ page }) => {
  await signedIn(page);
  let calls = 0;
  let refreshes = 0;
  await page.route('**/catalog/track/favorite/all/', route => {
    calls++;
    if (route.request().headers().authorization === 'Bearer new-access') return route.fulfill({ json: { data: [track] } });
    return route.fulfill({ status: 401, json: { detail: 'Expired' } });
  });
  await page.route('**/user/token/refresh/', route => { refreshes++; return route.fulfill({ json: { access: 'new-access' } }); });
  await page.goto('/favourites');
  await expect(page.getByRole('heading', { name: 'Мои треки' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Убрать Chase из избранного' }).first()).toBeVisible();
  expect(calls).toBe(2);
  expect(refreshes).toBe(1);
});

test('failed refresh clears the session', async ({ page }) => {
  await signedIn(page);
  await page.route('**/catalog/track/favorite/all/', route => route.fulfill({ status: 401, json: { detail: 'Expired' } }));
  await page.route('**/user/token/refresh/', route => route.fulfill({ status: 401, json: { detail: 'Invalid' } }));
  await page.goto('/favourites');
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => localStorage.getItem('skypro-session'))).toBeNull();
});

test('network failure while refreshing clears the session', async ({ page }) => {
  await signedIn(page);
  await page.route('**/catalog/track/favorite/all/', route => route.fulfill({ status: 401, json: { detail: 'Expired' } }));
  await page.route('**/user/token/refresh/', route => route.abort('failed'));
  await page.goto('/favourites');
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => localStorage.getItem('skypro-session'))).toBeNull();
});

test('403 while liking leaves the track unliked', async ({ page }) => {
  await signedIn(page);
  await page.route('**/catalog/track/favorite/all/', route => route.fulfill({ json: { data: [] } }));
  await page.route('**/catalog/track/8/favorite/', route => route.fulfill({ status: 403, json: { message: 'Недоступно' } }));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Выйти' })).toBeVisible();
  const button = page.getByRole('button', { name: 'Добавить Chase в избранное' }).first();
  await expect(button).toBeEnabled();
  await button.click();
  await expect(page.getByRole('button', { name: 'Добавить Chase в избранное' }).first()).toBeVisible();
  await expect(page.getByText('Недоступно')).toBeVisible();
});
