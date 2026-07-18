import { test, expect } from "@playwright/test";
import { mockLoggedOut, mockMarketplace } from "./utils/mocks";

test.describe("Primary navigation", () => {
  test.beforeEach(async ({ page }) => {
    await mockLoggedOut(page);
    await mockMarketplace(page);
  });

  test("navbar links route to the main sections", async ({ page }) => {
    await page.goto("/en");

    const nav = page.getByRole("navigation");

    await nav.getByRole("link", { name: /Marketplace/i }).click();
    await expect(page).toHaveURL(/\/en\/marketplace/);

    await nav.getByRole("link", { name: /About/i }).click();
    await expect(page).toHaveURL(/\/en\/about/);

    await nav.getByRole("link", { name: /Contribute/i }).click();
    await expect(page).toHaveURL(/\/en\/contribute/);
  });

  test("shows a sign-in entry point when logged out", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.getByRole("link", { name: /Sign In|Join Ecosystem/i }).first(),
    ).toBeVisible();
  });

  test("unknown route renders the not-found page", async ({ page }) => {
    const response = await page.goto("/en/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
