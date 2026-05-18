# Playwright test suite for authenticating via API request

Welcome! This is a repository of Playwright tests that demonstrate authenticating via API request using [DemoQA](https://demoqa.com/), a demo website. This repo is my solution to Ch 1, exercise 7 in the [TAU Advanced Playwright course](https://github.com/ccdita/tau-advanced-playwright).

## How does this method work?

- `playwright.config.ts` defines auth setup as a project dependency to be run before all tests in other projects
- `auth.setup.ts` runs once, signing into the application via API POST and storing the authentication state in an `authFile`

**How is authentication state stored?**

Simply using the API `POST` HTTP request with valid credentials is not enough to log in and store the authentication state. The issue is that the `request` fixture is not a browser, and a browser is required to store the authentication state because it has a `localStorage` (which `request` doesn't, and cannot modify). As such, `auth.setup.ts` performs the following:

1. Logs into the application directly via the API: `request.post()` is called with the login API endpoint
2. Launches a browser (context)
3. Obtains the auth token from the API response and injects it into the browser
4. Stores the browser authentication state in the specified `authFile`

## Why authenticate using the API instead of the UI?

Authenticating via API is easier and faster than interacting with the UI. By authenticating via the API, we don't need to load the UI, which can slow tests down or occasionally fail.

## References
- [DemoQA Website](https://demoqa.com/)
- [Installation on Playwright Docs](https://playwright.dev/docs/intro)
- [Global setup and teardown on Playwright Docs](https://playwright.dev/docs/test-global-setup-teardown)
- [Authenticate with API request on Playwright Docs](https://playwright.dev/docs/auth#authenticate-with-api-request)
- [API testing on Playwright Docs](https://playwright.dev/docs/api-testing#writing-api-test)
- [APIResponse on Playwright Docs](https://playwright.dev/docs/api/class-apiresponse)
- [Book Store API on Swagger UI Docs](https://demoqa.com/swagger)