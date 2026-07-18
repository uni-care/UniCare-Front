import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright end-to-end test configuration for the UniCare frontend.
 *
 * The dev server is booted automatically (see `webServer`) so `npm run test:e2e`
 * works from a clean checkout. Tests intercept backend calls with `page.route`
 * (see `e2e/utils/`), so a live API at NEXT_PUBLIC_API_URL is NOT required.
 */

const PORT = Number(process.env.E2E_PORT ?? 3000);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Fail the build on CI if test.only is committed.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Run e2e against a production build rather than the dev server: the dev
  // server compiles routes on demand, which makes the `load` event and
  // hydration timing unreliable under parallel test load. `next start` serves
  // pre-built, pre-rendered pages that load and hydrate fast and deterministically.
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
