import { test, expect } from "@playwright/test";
import { mockLoggedOut } from "./utils/mocks";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await mockLoggedOut(page);
  });

  test("redirects the bare root to the default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en(\/)?$/);
  });

  test("renders the English hero content", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.getByRole("heading", { name: /Ecosystem/i }),
    ).toBeVisible();
    await expect(page.getByText("Community Driven").first()).toBeVisible();
  });

  test("hero CTA links point to the marketplace", async ({ page }) => {
    await page.goto("/en");
    const cta = page.getByRole("link", { name: /Enter the Ecosystem/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/en/marketplace");
  });

  test("has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/en");
    await expect(
      page.getByRole("heading", { name: /Ecosystem/i }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
});
