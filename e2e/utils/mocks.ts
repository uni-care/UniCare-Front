import type { Page, Route } from "@playwright/test";

/**
 * Backend mocking helpers.
 *
 * The frontend talks to two surfaces:
 *   - Next.js BFF routes under `/api/auth/*` (login/register/logout/token)
 *   - The backend proxied under `/api/v1/*` (categories, items, profile, ...)
 *
 * These helpers intercept both so e2e tests run without a live API.
 */

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });

export interface MockCategory {
  id: string;
  name: string;
  description?: string;
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  itemType: number;
  status: string;
  ownerId: string;
  ownerName: string;
  availableFrom: string;
  availableTo: string;
  location: string;
  imageUrls: string[];
  isFavorited: boolean;
  favoriteCount: number;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export const sampleCategories: MockCategory[] = [
  { id: "cat-1", name: "Textbooks", description: "Course books" },
  { id: "cat-2", name: "Lab Tools", description: "Laboratory equipment" },
];

export function makeItem(overrides: Partial<MockItem> = {}): MockItem {
  return {
    id: "item-1",
    title: "Calculus Textbook",
    description: "Barely used, 8th edition.",
    price: 150,
    currency: "EGP",
    itemType: 1,
    status: "Available",
    ownerId: "owner-1",
    ownerName: "Sara Ahmed",
    availableFrom: "",
    availableTo: "",
    location: "Computer Science",
    imageUrls: [],
    isFavorited: false,
    favoriteCount: 0,
    categoryId: "cat-1",
    categoryName: "Textbooks",
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
    ...overrides,
  };
}

/** Signed-out session: `/api/auth/token` returns no token. */
export async function mockLoggedOut(page: Page) {
  await page.route("**/api/auth/token", (route) =>
    json(route, 200, { token: null }),
  );
}

/** Signed-in session: token endpoint + profile both resolve. */
export async function mockLoggedIn(
  page: Page,
  profile: Record<string, unknown> = {
    id: "owner-1",
    fullName: "Test Student",
    email: "student@university.edu",
  },
) {
  await page.route("**/api/auth/token", (route) =>
    json(route, 200, { token: "fake-jwt-token" }),
  );
  await page.route("**/api/v1/profile/me", (route) =>
    json(route, 200, { success: true, data: profile }),
  );
}

/** Marketplace data endpoints. */
export async function mockMarketplace(
  page: Page,
  {
    categories = sampleCategories,
    items = [makeItem()],
  }: { categories?: MockCategory[]; items?: MockItem[] } = {},
) {
  await page.route("**/api/v1/Categories", (route) =>
    json(route, 200, categories),
  );
  await page.route("**/api/v1/Items*", (route) => {
    if (route.request().method() !== "GET") return route.continue();
    return json(route, 200, {
      items,
      pageNumber: 1,
      pageSize: 20,
      totalCount: items.length,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });
}

/** Mock the login BFF route to succeed with a token. */
export async function mockLoginSuccess(page: Page) {
  await page.route("**/api/auth/login", (route) =>
    json(route, 200, {
      success: true,
      data: { token: "fake-jwt-token" },
    }),
  );
}

/** Mock the login BFF route to fail with a message. */
export async function mockLoginFailure(
  page: Page,
  message = "Invalid credentials",
) {
  await page.route("**/api/auth/login", (route) =>
    json(route, 401, { error: message }),
  );
}
