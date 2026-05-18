import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/user.json';

/**
 * Signs into the application with valid credentials via the API, and validates the 
 * login response.
 * 
 * Steps:
 * 1. Log in directly via the API
 * 2. Obtain the auth token from the API response
 * 3. Inject the auth token into the browser
 * 4. Save the authentication state
 */
setup('Should authenticate with correct credentials', async ({ request, page }) => {
    // Send an authentication request using the API endpoint (obtained from Swagger docs)
    const loginResponse = await request.post('/Account/v1/Login', {
        data: {
            userName: process.env.DEMOQA_USERNAME!,
            password: process.env.DEMOQA_PASSWORD!,
        }
    });
    // Verify that the response is successful (status: 200-299) and that the status text is OK for success
    expect(loginResponse.ok()).toBeTruthy(); 
    expect(loginResponse.statusText()).toEqual('OK');

    // Convert the login response to JSON
    const loginBody = await loginResponse.json();

    /**
     * Launch a browser page. Why?
     * - localStorage only exists inside a browser
     * - request cannot set localStorage
     */
    await page.goto('/');

    /**
     * Inject the token into localStorage so that the application knows the user is
     * logged in
     * - page.evaluate() runs JavaScript inside the browser page
     */
    await page.evaluate(token => {
        localStorage.setItem('token', token);
    }, loginBody.token);

    /**
     * Store the authentication state in the specified authFile
     * 
     * Why not use request.storageState({ path: authFile })?
     * - Request is not a browser, so it has no page, no localStorage, and no UI session
     */
    await page.context().storageState({ path: authFile });
});