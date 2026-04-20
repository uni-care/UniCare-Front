"use client";

import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth-api";
import type { UserProfile } from "@/features/auth/types";

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
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
      const token = getAuthToken();

      if (!token) {
        return null;
      }

      try {
        return await authApi.getCurrentProfile(token);
      } catch {
        clearAuthToken();
        return null;
      }
    },
    retry: false,
  });

  const signOut = useCallback(async () => {
    const token = getAuthToken();

    try {
      if (token) {
        await authApi.logout(token);
      }
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
