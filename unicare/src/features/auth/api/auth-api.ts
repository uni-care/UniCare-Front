import { axiosInstance } from "@/lib/api/axios-instance";

import type { AuthResponse, LoginPayload, RegisterPayload } from "@/features/auth/types";

export const AUTH_ENDPOINTS = {
  register: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
} as const;

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.register, payload);
    return data;
  },
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.login, payload);
    return data;
  },
};
