import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/user.json';

/**
 * Signs into the application with valid credentials
 */
setup('Should authenticate with correct credentials', async ({ request }) => {
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

    // Store the authentication state in the specified authFile
    await request.storageState({ path: authFile });
});