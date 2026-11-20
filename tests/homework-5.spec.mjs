import { test, expect } from '@playwright/test';

test('catalog and selection load live API data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Треки' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Воспроизвести/ }).first()).toBeVisible();
  await page.goto('/selection/2');
  await expect(page.getByRole('heading', { name: 'Плейлист дня' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Воспроизвести/ }).first()).toBeVisible();
});

test('signup validates password confirmation', async ({ page }) => {
  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Имя пользователя' }).fill('QA');
  await page.getByRole('textbox', { name: 'Почта' }).fill('qa@example.com');
  await page.locator('input[name="password"]').fill('Pass123!');
  await page.locator('input[name="confirmPassword"]').fill('Wrong123!');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
  await expect(page.locator('form [role="alert"]')).toHaveText('Пароли не совпадают.');
});

test('signin reports invalid credentials', async ({ page }) => {
  await page.goto('/signin');
  await page.getByRole('textbox', { name: 'Почта' }).fill('nobody@example.com');
  await page.locator('input[name="password"]').fill('Wrong123!');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.locator('form [role="alert"]')).toBeVisible();
});

test('registration navigates to sign in without document reload', async ({ page }) => {
  await page.route('**/user/signup/', route => route.fulfill({ status: 201, json: { success: true, message: 'Создан', result: { _id: 1, email: 'qa@example.com', username: 'QA' } } }));
  await page.goto('/signup');
  await page.locator('input[name="username"]').fill('QA');
  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.locator('input[name="password"]').fill('Pass123!');
  await page.locator('input[name="confirmPassword"]').fill('Pass123!');
  const marker = await page.evaluate(() => { window.__qaMarker = 1; return 1; });
  expect(marker).toBe(1);
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
  await expect(page).toHaveURL(/\/signin$/);
  expect(await page.evaluate(() => window.__qaMarker)).toBe(1);
});

test('sign in navigates home and stores returned session', async ({ page }) => {
  await page.route('**/user/login/', route => route.fulfill({ json: { _id: 1, email: 'qa@example.com', username: 'QA' } }));
  await page.route('**/user/token/', route => route.fulfill({ json: { access: 'qa-access', refresh: 'qa-refresh' } }));
  await page.goto('/signin');
  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.locator('input[name="password"]').fill('Pass123!');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page).toHaveURL('/');
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('skypro-session')));
  expect(session.user.email).toBe('qa@example.com');
  expect(session.access).toBe('qa-access');
});
