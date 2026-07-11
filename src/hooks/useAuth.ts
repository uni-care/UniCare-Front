"use client";

import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/api/auth-api";
import type { UserProfile } from "@/types/auth";

import { getAuthToken, setAuthToken, clearAuthToken } from "@/api/token-store";

export { getAuthToken, setAuthToken, clearAuthToken };
export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<UserProfile | null>({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: async () => {
      try {
        // 1. Restore token in-memory first so subsequent API calls include the Authorization header
        let token = getAuthToken();
        if (!token) {
          try {
            const res = await fetch("/api/auth/token");
            if (res.ok) {
              const tokenData = await res.json();
              if (tokenData.token) {
                token = tokenData.token;
                setAuthToken(token);
              }
            }
          } catch (tokenErr) {
            console.error("Failed to restore token in-memory:", tokenErr);
          }
        }

        if (!token) {
          return null;
        }

        // 2. Fetch the user profile (Authorization header will be attached by Axios interceptor)
        const profile = await authApi.getCurrentProfile();

        return profile;
      } catch {
        clearAuthToken();
        return null;
      }
    },
    retry: false,
  });

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuthToken();
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
    }
  }, [queryClient]);

  return useMemo(
    () => ({
      user: user ?? null,
      isLoading: isLoading || isFetching,
      isAuthenticated: Boolean(user),
      signOut,
      reloadUser: refetch,
    }),
    [isFetching, isLoading, refetch, signOut, user]
  );
};
