import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authApi } from "@/api/auth-api";
import { getAuthToken, setAuthToken, clearAuthToken } from "@/api/token-store";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";

// Mock authApi
vi.mock("@/api/auth-api", () => ({
  authApi: {
    getCurrentProfile: vi.fn(),
    logout: vi.fn(),
  },
}));

// Helper to create wrapper for QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAuth hook", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    clearAuthToken();
    vi.clearAllMocks();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return null user if no token exists in memory or BFF", async () => {
    // BFF returns 401 or no token
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockFetch).toHaveBeenCalledWith("/api/auth/token");
    expect(authApi.getCurrentProfile).not.toHaveBeenCalled();
  });

  it("should restore token from BFF and fetch profile if not in memory", async () => {
    // BFF returns token successfully
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "bff-jwt-token" }),
    } as Response);

    const mockProfile = { id: "1", name: "John Doe", email: "john@uni.edu" };
    vi.mocked(authApi.getCurrentProfile).mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getAuthToken()).toBe("bff-jwt-token");
    expect(result.current.user).toEqual(mockProfile);
    expect(result.current.isAuthenticated).toBe(true);
    expect(authApi.getCurrentProfile).toHaveBeenCalledOnce();
  });

  it("should use in-memory token directly and skip BFF check if present", async () => {
    setAuthToken("existing-jwt-token");

    const mockProfile = { id: "2", name: "Jane Doe", email: "jane@uni.edu" };
    vi.mocked(authApi.getCurrentProfile).mockResolvedValueOnce(mockProfile);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(authApi.getCurrentProfile).toHaveBeenCalledOnce();
    expect(result.current.user).toEqual(mockProfile);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should clear token and return null if getCurrentProfile throws an error", async () => {
    setAuthToken("existing-jwt-token");
    vi.mocked(authApi.getCurrentProfile).mockRejectedValueOnce(new Error("Unauthorized"));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getAuthToken()).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should sign out successfully", async () => {
    setAuthToken("existing-jwt-token");
    const mockProfile = { id: "2", name: "Jane Doe", email: "jane@uni.edu" };
    vi.mocked(authApi.getCurrentProfile).mockResolvedValueOnce(mockProfile);
    vi.mocked(authApi.logout).mockResolvedValueOnce();

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Call sign out
    await result.current.signOut();

    expect(authApi.logout).toHaveBeenCalledOnce();
    expect(getAuthToken()).toBeNull();
    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
