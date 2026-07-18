import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthRequiredModal from "./auth-required-modal";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      signIn: "Sign In",
      cancel: "Cancel",
    };
    return messages[key] || key;
  },
}));

// Mock routing router
const mockPush = vi.fn();
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
}));

describe("AuthRequiredModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock requestAnimationFrame
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  it("should not render anything if isOpen is false", () => {
    const { container } = render(
      <AuthRequiredModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render title and description when open", () => {
    render(
      <AuthRequiredModal
        isOpen={true}
        onClose={vi.fn()}
        title="Custom Title"
        description="Custom Description"
      />
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should call onClose after a delay when clicking close button", async () => {
    const mockOnClose = vi.fn();
    const setTimeoutSpy = vi.spyOn(window, "setTimeout").mockImplementation((cb: any) => {
      cb();
      return 0 as any;
    });

    const user = userEvent.setup();
    render(<AuthRequiredModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: /close authentication modal/i });
    await user.click(closeButton);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 220);
    expect(mockOnClose).toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
  });

  it("should call onClose after a delay when clicking overlay background", async () => {
    const mockOnClose = vi.fn();
    const setTimeoutSpy = vi.spyOn(window, "setTimeout").mockImplementation((cb: any) => {
      cb();
      return 0 as any;
    });

    const user = userEvent.setup();
    const { container } = render(<AuthRequiredModal isOpen={true} onClose={mockOnClose} />);

    // The outermost div is the overlay
    const overlay = container.firstChild as HTMLElement;
    await user.click(overlay);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 220);
    expect(mockOnClose).toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
  });

  it("should redirect to login with query param when clicking Sign In", async () => {
    const setTimeoutSpy = vi.spyOn(window, "setTimeout").mockImplementation((cb: any) => {
      cb();
      return 0 as any;
    });

    const user = userEvent.setup();
    render(
      <AuthRequiredModal
        isOpen={true}
        onClose={vi.fn()}
        redirectTo="/marketplace/items/123"
      />
    );

    const signInButton = screen.getByRole("button", { name: "Sign In" });
    await user.click(signInButton);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 220);
    expect(mockPush).toHaveBeenCalledWith("/login?redirectTo=%2Fmarketplace%2Fitems%2F123");

    setTimeoutSpy.mockRestore();
  });
});
