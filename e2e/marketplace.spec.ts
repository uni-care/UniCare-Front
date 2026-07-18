import { test, expect } from "@playwright/test";
import {
  makeItem,
  mockLoggedOut,
  mockMarketplace,
} from "./utils/mocks";

test.describe("Marketplace", () => {
  test("renders items returned by the API", async ({ page }) => {
    await mockLoggedOut(page);
    await mockMarketplace(page, {
      items: [
        makeItem({ id: "a", title: "Calculus Textbook" }),
        makeItem({ id: "b", title: "Oscilloscope", categoryName: "Lab Tools" }),
      ],
    });

    await page.goto("/en/marketplace");

    await expect(page.getByText("Calculus Textbook")).toBeVisible();
    await expect(page.getByText("Oscilloscope")).toBeVisible();
  });

  test("filters items by search query", async ({ page }) => {
    await mockLoggedOut(page);
    await mockMarketplace(page, {
      items: [
        makeItem({ id: "a", title: "Calculus Textbook" }),
        makeItem({ id: "b", title: "Oscilloscope" }),
      ],
    });

    await page.goto("/en/marketplace");
    await expect(page.getByText("Calculus Textbook")).toBeVisible();

    await page
      .getByPlaceholder(/Search resources, textbooks, tools/i)
      .fill("Oscilloscope");

    await expect(page.getByText("Oscilloscope")).toBeVisible();
    await expect(page.getByText("Calculus Textbook")).toHaveCount(0);
  });

  test("shows an empty state when no items exist", async ({ page }) => {
    await mockLoggedOut(page);
    await mockMarketplace(page, { items: [] });

    await page.goto("/en/marketplace");

    // No item titles from the sample data should be present.
    await expect(page.getByText("Calculus Textbook")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /Marketplace/i }),
    ).toBeVisible();
  });
});
