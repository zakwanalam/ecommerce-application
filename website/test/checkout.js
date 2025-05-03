import { expect } from "@playwright/test";

export const checkout = async({page})=>{
    await page.locator('button:has-text("Pay Without Link")').click();

    const formObject = {
        cardNumber: "4242424242424242",
        phoneNumber: "03312462258",
        cardExpiry: "05/28",
        cardCvc: "007",
        billingName: 'ecom-test',
        billingAddressL1: 'House R-180',
        billingAddressL2: 'Street 48,PECHS,Karachi',
        billingDependentLocality: "PECHS Block 2",
        billingLocality: "Karachi",
        billingPostalCode: "75850"
    }
    try {
        await page.fill("input[name=cardNumber]", formObject.cardNumber)
        await page.waitForTimeout(100)
        await page.fill("input[name=phoneNumber]", formObject.phoneNumber)
        await page.waitForTimeout(100)
        await page.fill("input[name=cardExpiry]", formObject.cardExpiry)
        await page.waitForTimeout(100)
        await page.fill("input[name=cardCvc]", formObject.cardCvc)
        await page.waitForTimeout(100)
        await page.fill("input[name=billingName]", formObject.billingName)
        await page.waitForTimeout(100)
        await page.fill("input[name=billingAddressLine1]", formObject.billingAddressL1)
        await page.waitForTimeout(100)
        await page.fill("input[name=billingAddressLine2]", formObject.billingAddressL2)
        await page.waitForTimeout(100)
        await page.fill("input[name=billingDependentLocality]", formObject.billingDependentLocality)
        await page.waitForTimeout(100)
        await page.fill("input[name=billingLocality]", formObject.billingLocality)
        await page.waitForTimeout(100)
        await page.fill("input[name=billingPostalCode]", formObject.billingPostalCode)
        await page.waitForTimeout(500)
        const payButton = page.locator('button[data-testid="hosted-payment-submit-button"]');
        // Now click the button
        await payButton.click();
        console.log('Reaced redirection');

        await page.waitForTimeout(400)

        // Expect the page to navigate to success or failure URL
        console.log('Reaced redirection');
        await page.waitForURL(/paymentSuccess|paymentFail/, { timeout: 15000 });
        // Click the "back to home" or "finish" button
        const endCheckout = page.getByRole('button', { name: /back to home|finish/i });
        console.log('Reaced button click');
        await endCheckout.click();
        await page.waitForTimeout(400)
        await expect(page).toHaveURL(/home/)
    } catch (error) {
        console.error('Checkout Failed')
        throw error
    }
}