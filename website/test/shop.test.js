import { test, expect } from '@playwright/test'
test('login', async ({ page }) => {
    await page.goto('http://localhost:5173/home');
    // Rest of your test
    await page.getByRole('button', { name: 'Login' }).click();
    await page.fill('input[name=email]', 'zakwanalam07@gmail.com');
    await page.fill('input[name=password]', 'zakwan_267');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await expect(page).toHaveURL(/home|products/);

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

    /*  try {
         await page.fill("input[name=cardNumber]", cardNumber)
         await page.waitForTimeout(100)
         await page.fill("input[name=phoneNumber]", phoneNumber)
         await page.waitForTimeout(100)
         await page.fill("input[name=cardExpiry]", cardExpiry)
         await page.waitForTimeout(100)
         await page.fill("input[name=cardCvc]", cardCvc)
         await page.waitForTimeout(100)
         await page.fill("input[name=billingName]", billingName)
         await page.waitForTimeout(100)
         await page.fill("input[name=billingAddressLine1]", billingAddressL1)
         await page.waitForTimeout(100)
         await page.fill("input[name=billingAddressLine2]", billingAddressL2)
         await page.waitForTimeout(100)
         await page.fill("input[name=billingDependentLocality]", billingDependentLocality)
         await page.waitForTimeout(100)
         await page.fill("input[name=billingLocality]", billingPostalCode)
         await page.waitForTimeout(100)
         await page.fill("input[name=billingPostalCode]", billingPostalCode)
         await page.waitForTimeout(100)
 
         const payButton = page.locator('button[data-testid="hosted-payment-submit-button"]');
         if (payButton.isEnabled()) {
             await payButton.click()
         }
         else {
             console.error('Button is disabled! Incomplete Form');
         }
         await expect(page).toHaveURL(/paymentSuccess|paymentFail/)
         const endCheckout = page.getByRole('button',{name:/back to home|finish/i})
         await endCheckout.click()
     } catch (error) {
         console.error('Checkout Failed')
         throw error
     } */
});