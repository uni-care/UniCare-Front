import { describe, it, expect, beforeEach, vi } from "vitest";
import { axiosInstance } from "./axios-instance";
import { setAuthToken, clearAuthToken } from "./token-store";

describe("axiosInstance Interceptors", () => {
  beforeEach(() => {
    clearAuthToken();
  });

  it("should not add Authorization header if token is not present", async () => {
    const mockAdapter = vi.fn().mockImplementation((config) => {
      return Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    });

    axiosInstance.defaults.adapter = mockAdapter;

    await axiosInstance.get("/test");

    expect(mockAdapter).toHaveBeenCalledOnce();
    const requestConfig = mockAdapter.mock.calls[0][0];
    expect(requestConfig.headers.Authorization).toBeUndefined();
  });

  it("should add Authorization header if token is present", async () => {
    setAuthToken("my-secret-jwt");

    const mockAdapter = vi.fn().mockImplementation((config) => {
      return Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    });

    axiosInstance.defaults.adapter = mockAdapter;

    await axiosInstance.get("/test");

    expect(mockAdapter).toHaveBeenCalledOnce();
    const requestConfig = mockAdapter.mock.calls[0][0];
    expect(requestConfig.headers.Authorization).toBe("Bearer my-secret-jwt");
  });

  it("should reject with error on request failure", async () => {
    const mockAdapter = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error("Network Error"));
    });

    axiosInstance.defaults.adapter = mockAdapter;

    await expect(axiosInstance.get("/test")).rejects.toThrow("Network Error");
  });
});
