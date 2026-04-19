export interface RegisterPayload {
  firstName: string;
  lastName: string;
  password: string;
  role: "student" | "alumni";
  email?: string;
  phoneNumber?: string;
}

export interface LoginPayload {
  password: string;
  email?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  refreshToken?: string;
}
