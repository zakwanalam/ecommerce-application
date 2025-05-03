import { test, expect } from '@playwright/test'
import { checkout } from './checkout';
import { login } from './login';
test('login', async ({ page }) => {
    await login({page})

    await page.goto('http://localhost:5173/home');

    const buttons = page.locator('text=Add To Cart');

    const count = await buttons.count();
    console.log('Number of Add To Cart links:', count);

    for (let index = 0; index < 4; index++) {
        if (count > 0) {
            const randomIndex = Math.floor(Math.random() * count)
            if (randomIndex > 6) {
                randomIndex--
            }
            console.log(randomIndex);
            await buttons.nth(randomIndex).click()
            await page.waitForTimeout(1000)
        }
        else {
            console.error('No links found');
        }
    }
    await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
    const cartIcon = page.locator("#cartIcon")
    await cartIcon.click()
    await page.waitForTimeout(3000)
    const checkoutButton = page.locator('#checkoutBtn')
    await checkoutButton.click()
    await expect(page).toHaveURL(/checkout/)
    await page.waitForTimeout(4000)

    // Fill Stripe Billing Form
   await checkout({page})
});