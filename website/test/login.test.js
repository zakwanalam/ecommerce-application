import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {  
  await page.goto('http://localhost:5173/home');
  // Rest of your test
  await page.getByRole('button', { name: 'Login' }).click();
  await page.fill('input[name=email]', 'zakwanalam07@gmail.com');
  await page.fill('input[name=password]', 'zakwan_267');
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await expect(page).toHaveURL(/home|products/);
});
