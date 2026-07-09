import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authApi } from "@/api/auth-api";
import { setAuthToken } from "@/hooks/useAuth";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { toast } from "sonner";

// Mock authApi
vi.mock("@/api/auth-api", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

// Mock setAuthToken & AUTH_ME_QUERY_KEY
vi.mock("@/hooks/useAuth", () => ({
  setAuthToken: vi.fn(),
  AUTH_ME_QUERY_KEY: ["auth", "me"],
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render email login form by default", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByText("Welcome back. Please enter your details.")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("should switch to phone number form when 'Via Phone' is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const viaPhoneButton = screen.getByRole("button", { name: "Via Phone" });
    await user.click(viaPhoneButton);

    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
  });

  it("should show validation error for invalid email address", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole("button", { name: "Log In" });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    });
  });

  it("should show validation error for invalid Egyptian phone number", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const viaPhoneButton = screen.getByRole("button", { name: "Via Phone" });
    await user.click(viaPhoneButton);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const submitButton = screen.getByRole("button", { name: "Log In" });

    await user.type(phoneInput, "0123456789");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid Egyptian phone number (10 digits).")).toBeInTheDocument();
    });
  });

  it("should display validation error if password is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole("button", { name: "Log In" });

    await user.type(emailInput, "user@university.edu");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });
  });

  it("should call login API and redirect on successful form submission", async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.login).mockResolvedValueOnce({
      data: {
        token: "successful-login-jwt-token",
        expiresAt: "2026-07-09T12:00:00Z",
        userId: "user-123",
        fullName: "Test User",
        verificationStatus: 2,
      },
      success: true,
      message: "Logged in",
      timestamp: "2026-07-09T12:00:00Z",
    });

    renderWithProviders(<LoginForm redirectTo="/marketplace" />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole("button", { name: "Log In" });

    await user.type(emailInput, "test@university.edu");
    await user.type(passwordInput, "secret123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: "test@university.edu",
        password: "secret123",
      });
      expect(setAuthToken).toHaveBeenCalledWith("successful-login-jwt-token");
      expect(toast.success).toHaveBeenCalledWith("Logged in successfully.", expect.any(Object));
      expect(mockPush).toHaveBeenCalledWith("/marketplace");
    });
  });

  it("should show error toast if login fails", async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.login).mockRejectedValueOnce(new Error("Invalid credentials"));

    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole("button", { name: "Log In" });

    await user.type(emailInput, "test@university.edu");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});
