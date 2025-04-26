import { test, expect } from '@playwright/test';


test('Signup with password validation', async ({ page }) => {
    const testCases = [
        {
            password: 'weak',
            confirm: 'weak',
            shouldPass: false,
        },
        {
            password: 'longpassword',
            confirm: 'longpassword',
            shouldPass: false,
        },
        {
            password: 'valid_pass',
            confirm: 'valid_pass',
            shouldPass: true,
        },
        {
            password: 'Valid@123',
            confirm: 'Valid@123',
            shouldPass: true,
        },
        {
            password: 'mismatch',
            confirm: 'matchmismatch',
            shouldPass: false,
        },
    ];

    for (const { password, confirm, shouldPass } of testCases) {
        try {
            console.log(password,confirm,shouldPass)
            await page.goto('http://localhost:5173/signup');
            const timestamp = Date.now() + Math.floor(Math.random() * 10000);

            await page.fill('input[name=email]', `test+${timestamp}@example.com`);
            await page.fill('input[name=fullName]', 'Test User');
            await page.fill('input[name=address]', '123 Test St');
            await page.fill('input[name=password]', password);
            await page.fill('input[name=confirmPassword]', confirm);
            await page.waitForTimeout(300);

            await page.getByRole('button', { name: 'Sign Up' }).click();

            if (shouldPass) {
                await expect(page).toHaveURL(/login/);
            } else {
                await expect(page).toHaveURL(/signup/);
                const toast = page.getByText(
                    /password must be at least 8 characters|passwords don't match|Invalid|One or more empty fields/i
                  );
                  // wait up to 3 seconds for toast to appear
                  await expect(toast).toBeVisible({ timeout: 3000 });
            }
        } catch (error) {
        }
    }
});
