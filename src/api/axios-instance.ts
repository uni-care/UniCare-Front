import axios from "axios";
import { getAuthToken } from "./token-store";

const baseURL = "/";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const _message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      "Something went wrong. Please try again.";

    return Promise.reject(error);
  },
);
