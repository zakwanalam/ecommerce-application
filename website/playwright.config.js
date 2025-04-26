import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test',  // (or wherever your tests are)
    use: {
        baseURL: 'http://localhost:5173',  // your website's local URL
        headless: true,
        viewport: { width: 1600, height: 900 }, 
    },
    projects: [
        {
            name: 'Google Chrome',
            use: {
                channel: 'chrome', // <- this forces Chrome
                headless: false,    // optional: show browser
            },// Will use browser window siz
        },
    ],
    webServer: {
        command: 'npm run dev', // your command to start frontend (adjust if needed)
        url: 'http://localhost:5173',
        timeout: 120 * 1000, // wait up to 2 minutes for server to start
        reuseExistingServer: !process.env.CI, // do not restart server if already running locally
    },
});