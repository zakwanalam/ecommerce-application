import { test, expect } from '@playwright/test';
import { checkout } from './checkout';
import { login } from './login';

test('search for Nike and click first result', async ({ page }) => {

    await login({page})

    await page.type('input[id="searchInput"]', 'nike', { delay: 100 }); 
    const resultsSelector = 'form#result-div';
    await page.waitForSelector(resultsSelector, { state: 'visible' });

    await page.waitForTimeout(1000)
    const firstResult = `${resultsSelector} > div:first-child`;
    await page.click(firstResult);

    await page.waitForTimeout(3000)

    const productSizeSelector = await page.$$('#productSizes button');
    const randomIndex = Math.floor(Math.random() * productSizeSelector.length)
    //select a random size button and click
    await productSizeSelector[randomIndex].click()

    const buyNowButton = await page.locator("#buynow")
    await buyNowButton.click()

    await checkout({page})
});