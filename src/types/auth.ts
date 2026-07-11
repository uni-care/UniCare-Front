export enum RegistrationMethod {
  Email = 0,
  Phone = 1,
  Google = 2,
}

export enum VerificationStatus {
  NotSubmitted = 0,
  Pending = 1,
  Verified = 2,
  Rejected = 3,
}

export interface RegisterPayload {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  googleIdToken?: string;
  registrationMethod: RegistrationMethod;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  expiresAt: string;
  userId: string;
  fullName: string;
  email?: string;
  verificationStatus: VerificationStatus;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  universityName?: string;
  facultyName?: string;
  profilePictureUrl?: string;
  verificationStatus: VerificationStatus;
  isVerifiedStudent: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  errors?: string[];
  timestamp: string;
}

export type AuthResponse = ApiResponse<AuthResponseData>;
