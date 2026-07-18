import { test, expect } from "@playwright/test";
import {
  mockLoggedOut,
  mockLoginFailure,
  mockLoginSuccess,
} from "./utils/mocks";

test.describe("Login flow", () => {
  test.beforeEach(async ({ page }) => {
    await mockLoggedOut(page);
  });

  test("renders the login form with email selected by default", async ({
    page,
  }) => {
    await page.goto("/en/login");
    await expect(
      page.getByRole("heading", { name: /Welcome Back/i }),
    ).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
  });

  test("switches between email and phone contact methods", async ({ page }) => {
    await page.goto("/en/login");

    await expect(page.locator("#email")).toBeVisible();

    await page.getByRole("button", { name: "Via Phone" }).click();
    await expect(page.locator("#phoneNumber")).toBeVisible();
    await expect(page.getByText("+20")).toBeVisible();

    await page.getByRole("button", { name: "Via Email" }).click();
    await expect(page.locator("#email")).toBeVisible();
  });

  test("shows a validation error for an invalid email", async ({ page }) => {
    await page.goto("/en/login");

    await page.locator("#email").fill("not-an-email");
    await page.locator("#password").fill("something");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(
      page.getByText(/Please enter a valid email address/i),
    ).toBeVisible();
  });

  test("toggles password visibility", async ({ page }) => {
    await page.goto("/en/login");

    const password = page.locator("#password");
    await password.fill("secret123");
    await expect(password).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show password" }).click();
    await expect(password).toHaveAttribute("type", "text");
  });

  test("successful login redirects home and drops the login page", async ({
    page,
  }) => {
    await mockLoginSuccess(page);
    await page.goto("/en/login");

    await page.locator("#email").fill("student@university.edu");
    await page.locator("#password").fill("Password123");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.getByText(/Logged in successfully/i)).toBeVisible();
  });

  test("failed login surfaces an error toast and stays on the login page", async ({
    page,
  }) => {
    await mockLoginFailure(page, "Invalid credentials");
    await page.goto("/en/login");

    await page.locator("#email").fill("student@university.edu");
    await page.locator("#password").fill("WrongPass1");
    await page.getByRole("button", { name: "Log In" }).click();

    // An error toast (sonner) is shown and the user is not redirected.
    await expect(page.locator("[data-sonner-toast]")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("links to the register page", async ({ page }) => {
    await page.goto("/en/login");
    await page.getByRole("link", { name: "Sign Up" }).click();
    await expect(page).toHaveURL(/\/en\/register/);
  });
});
