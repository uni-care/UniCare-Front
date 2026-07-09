import { describe, it, expect, beforeEach } from "vitest";
import { getAuthToken, setAuthToken, clearAuthToken } from "./token-store";

describe("token-store", () => {
  beforeEach(() => {
    clearAuthToken();
  });

  it("should return null initially", () => {
    expect(getAuthToken()).toBeNull();
  });

  it("should set and retrieve a token", () => {
    setAuthToken("mock-jwt-token");
    expect(getAuthToken()).toBe("mock-jwt-token");
  });

  it("should clear the token", () => {
    setAuthToken("mock-jwt-token");
    clearAuthToken();
    expect(getAuthToken()).toBeNull();
  });

  it("should support updating the token multiple times", () => {
    setAuthToken("token-1");
    expect(getAuthToken()).toBe("token-1");

    setAuthToken("token-2");
    expect(getAuthToken()).toBe("token-2");

    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
  });
});
