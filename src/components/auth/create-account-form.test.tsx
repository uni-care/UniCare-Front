import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateAccountForm } from "./create-account-form";
import { authApi } from "@/api/auth-api";
import { RegistrationMethod } from "@/types/auth";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { toast } from "sonner";

// Mock authApi
vi.mock("@/api/auth-api", () => ({
  authApi: {
    register: vi.fn(),
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

describe("CreateAccountForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });



  it("should render student role and phone contact by default", () => {
    render(<CreateAccountForm />);

    expect(screen.getByRole("heading", { name: "Create Account" })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /i agree to/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
  });

  it("should toggle role selections", async () => {
    const user = userEvent.setup({ delay: null });
    render(<CreateAccountForm />);

    const alumniButton = screen.getByRole("button", { name: "Alumni" });
    const studentButton = screen.getByRole("button", { name: "Student" });

    // Click Alumni
    await user.click(alumniButton);
    expect(alumniButton).toHaveClass("bg-white text-primary");

    // Click Student
    await user.click(studentButton);
    expect(studentButton).toHaveClass("bg-primary/10");
  });

  it("should switch contact methods", async () => {
    const user = userEvent.setup({ delay: null });
    render(<CreateAccountForm />);

    const viaEmailButton = screen.getByRole("button", { name: "Via Email" });
    const viaPhoneButton = screen.getByRole("button", { name: "Via Phone" });

    // Switch to Email
    await user.click(viaEmailButton);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/phone number/i)).not.toBeInTheDocument();

    // Switch back to Phone
    await user.click(viaPhoneButton);
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
  });

  it("should display validation errors for empty inputs", async () => {
    const user = userEvent.setup({ delay: null });
    render(<CreateAccountForm />);

    const submitButton = screen.getByRole("button", { name: "Create Account" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("First name must be at least 2 characters.")).toBeInTheDocument();
      expect(screen.getByText("Last name must be at least 2 characters.")).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid Egyptian phone number (10 digits).")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument();
      expect(screen.getByText("You must accept the terms and privacy policy.")).toBeInTheDocument();
    });
  });

  it("should show validation error for weak passwords", async () => {
    const user = userEvent.setup({ delay: null });
    render(<CreateAccountForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole("button", { name: "Create Account" });

    // Missing uppercase, lowercase, numbers, and short
    await user.type(passwordInput, "short");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument();
    });
  });

  it("should validate that password and confirmPassword match", async () => {
    const user = userEvent.setup({ delay: null });
    render(<CreateAccountForm />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", { name: "Create Account" });

    await user.type(passwordInput, "StrongPass123");
    await user.type(confirmPasswordInput, "DifferentPass123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });
  });

  it("should call register API on successful submission and redirect to login after a timeout", async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout").mockImplementation((cb: any, delay?: number, ...args: any[]) => {
      if (delay === 2000) {
        cb(...args);
        return 9999 as any;
      }
      return originalSetTimeout(cb, delay, ...args);
    });

    const user = userEvent.setup();
    vi.mocked(authApi.register).mockResolvedValueOnce({
      success: true,
      message: "Account created",
      timestamp: "2026-07-09T12:00:00Z",
    });

    render(<CreateAccountForm />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/phone number/i), "1234567890"); // Slice converts input via format check
    await user.type(screen.getByLabelText(/^password$/i), "SecurePass123");
    await user.type(screen.getByLabelText(/confirm password/i), "SecurePass123");
    await user.click(screen.getByRole("checkbox", { name: /i agree to/i }));

    const submitButton = screen.getByRole("button", { name: "Create Account" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        fullName: "John Doe",
        password: "SecurePass123",
        registrationMethod: RegistrationMethod.Phone,
        phoneNumber: "1234567890",
        email: undefined,
      });
      expect(toast.success).toHaveBeenCalledWith("Account created successfully. You can now sign in.", expect.any(Object));
    });

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
    expect(mockPush).toHaveBeenCalledWith("/login");

    setTimeoutSpy.mockRestore();
  });

  it("should show error toast if API register fails", async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.register).mockRejectedValueOnce(new Error("Email already registered"));

    render(<CreateAccountForm />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.click(screen.getByRole("button", { name: "Via Email" }));
    await user.type(screen.getByLabelText(/email/i), "john@university.edu");
    await user.type(screen.getByLabelText(/^password$/i), "SecurePass123");
    await user.type(screen.getByLabelText(/confirm password/i), "SecurePass123");
    await user.click(screen.getByRole("checkbox", { name: /i agree to/i }));

    const submitButton = screen.getByRole("button", { name: "Create Account" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        fullName: "John Doe",
        password: "SecurePass123",
        registrationMethod: RegistrationMethod.Email,
        phoneNumber: undefined,
        email: "john@university.edu",
      });
      expect(toast.error).toHaveBeenCalledWith("Email already registered");
    });
  });

  it("should show validation error for invalid email address", async () => {
    const user = userEvent.setup();
    render(<CreateAccountForm />);

    await user.click(screen.getByRole("button", { name: "Via Email" }));
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid university email address.")).toBeInTheDocument();
    });
  });

  it("should show default error message if API register fails with non-Error object", async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.register).mockRejectedValueOnce("some string error");

    render(<CreateAccountForm />);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/phone number/i), "1234567890");
    await user.type(screen.getByLabelText(/^password$/i), "SecurePass123");
    await user.type(screen.getByLabelText(/confirm password/i), "SecurePass123");
    await user.click(screen.getByRole("checkbox", { name: /i agree to/i }));

    const submitButton = screen.getByRole("button", { name: "Create Account" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to create account. Please try again.");
    });
  });
});
