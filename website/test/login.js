import { expect } from "@playwright/test";

export const login = async({page})=>{
    await page.goto('http://localhost:5173/home');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.fill('input[name=email]', 'zakwanalam07@gmail.com');
    await page.fill('input[name=password]', 'zakwan_267');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await expect(page).toHaveURL(/home|products/);
}