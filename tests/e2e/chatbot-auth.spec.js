import { test, expect } from '@playwright/test';

test.describe('Chatbot Authentication API', () => {
  test('Anonymous requests to /api/chatbot are blocked with 401', async ({ request }) => {
    // Send a POST request to the chatbot endpoint without any authentication headers or cookies
    const response = await request.post('/api/chatbot', {
      data: {
        message: "Hello world!",
        history: []
      }
    });

    // We expect our security fix in route.js to return a 401 Unauthorized
    expect(response.status()).toBe(401);
    
    const json = await response.json();
    expect(json.error).toMatch(/Authentication required/i);
  });
});
