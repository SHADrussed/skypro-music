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
