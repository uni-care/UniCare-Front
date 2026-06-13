import axios from "axios";

const baseURL = "/";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  }
);
