import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Automatically cleanup DOM after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock localized next-intl routing hooks
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  Link: React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    ({ children, href, ...props }, ref) => {
      return React.createElement("a", { ref, href: href?.toString(), ...props }, children);
    }
  ),
}));

// Mock toast notifications (sonner)
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn((msg) => msg),
    error: vi.fn((msg) => msg),
  },
}));

// Mock next-intl: resolve real English messages so components render the same
// copy users see. Namespace-aware, mirroring `useTranslations("Namespace")`.
vi.mock("next-intl", async () => {
  const messages = (await import("../../messages/en.json")).default as Record<
    string,
    Record<string, string>
  >;
  return {
    useTranslations: (namespace?: string) => (key: string) => {
      const scope = namespace ? messages[namespace] : undefined;
      return scope?.[key] ?? key;
    },
    useLocale: () => "en",
  };
});
