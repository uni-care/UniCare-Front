import { axiosInstance } from "./axios-instance";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from "@/types/auth";

export const AUTH_ENDPOINTS = {
  register: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  logout: "/api/v1/auth/logout",
  profile: "/api/v1/profile/me",
} as const;

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(
      AUTH_ENDPOINTS.register,
      payload,
    );
    return data;
  },
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(
      AUTH_ENDPOINTS.login,
      payload,
    );
    return data;
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post(AUTH_ENDPOINTS.logout, {});
  },
  getCurrentProfile: async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get<{
      data?: UserProfile;
      success: boolean;
      message?: string;
    }>(AUTH_ENDPOINTS.profile);

    if (!data.data) {
      throw new Error(data.message ?? "Failed to load profile.");
    }

    return data.data;
  },
};
