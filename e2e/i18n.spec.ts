import { test, expect } from "@playwright/test";
import { mockLoggedOut } from "./utils/mocks";

test.describe("Internationalization", () => {
  test.beforeEach(async ({ page }) => {
    await mockLoggedOut(page);
  });

  test("English locale is LTR", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("Arabic locale is RTL and shows translated content", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByText("يديره المجتمع")).toBeVisible();
  });

  test("language switcher toggles between en and ar", async ({ page }) => {
    await page.goto("/en");

    await page.getByRole("button", { name: /العربية/ }).first().click();
    await expect(page).toHaveURL(/\/ar(\/)?$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.getByRole("button", { name: /English/ }).first().click();
    await expect(page).toHaveURL(/\/en(\/)?$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });
});
