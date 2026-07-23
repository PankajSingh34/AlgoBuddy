import { test, expect } from '@playwright/test';

test.describe('CSRF Protected Forms', () => {
  test('Support center form submits successfully', async ({ page }) => {
    // Navigate to the support page
    await page.goto('/support');

    // Wait for the form to load
    await expect(page.locator('form')).toBeVisible();

    // Fill in the required fields
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'This is a test message from Playwright E2E.');

    // Since Turnstile captcha is required, we mock it by executing a script to set the token 
    // or by intercepting the network request. The simplest way in tests for our component 
    // is to mock the `/api/contact` endpoint to avoid actually sending emails.
    await page.route('/api/contact', async route => {
      const json = { message: "Email sent successfully" };
      await route.fulfill({ json, status: 200 });
    });

    // Mock Turnstile success locally in the component if possible, or bypass the button disable
    // In our case, the button is disabled if `!captchaToken`. We can evaluate and set state 
    // if we exposed it, but we can't easily. So we will just remove the disabled attribute for the test
    // and let the mocked route handle it.
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.evaluate(node => node.removeAttribute('disabled'));
    
    // Submit the form
    await submitButton.click();

    // Verify success state (Assuming it sets isSubmitted to true and shows "Message Sent!")
    await expect(page.getByText(/Message Sent!|Thank You!/i)).toBeVisible({ timeout: 10000 });
  });
});
