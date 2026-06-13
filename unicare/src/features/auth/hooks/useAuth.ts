"use client";

import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth-api";
import type { UserProfile } from "@/features/auth/types";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

// In-memory token storage (XSS-resistant, does not persist in localStorage)
let inMemoryToken: string | null = null;

export const getAuthToken = () => {
  return inMemoryToken;
};

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
};

export const clearAuthToken = () => {
  inMemoryToken = null;
};

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
        // Fetch the user profile (cookie is automatically sent via the Next.js proxy)
        const profile = await authApi.getCurrentProfile();

        // Restore token in-memory for SignalR / client-side calls
        try {
          const res = await fetch("/api/auth/token");
          if (res.ok) {
            const tokenData = await res.json();
            if (tokenData.token) {
              setAuthToken(tokenData.token);
            }
          }
        } catch (tokenErr) {
          console.error("Failed to restore token in-memory:", tokenErr);
        }

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

