import { axiosInstance } from "./axios-instance";
import type { CategoryResponse } from "@/types/categories";

const BASE = "/api/Categories";

export const categoriesApi = {
  /** GET /api/v1/Categories — list all categories */
  getAll: async (): Promise<CategoryResponse[]> => {
    const { data } = await axiosInstance.get<CategoryResponse[]>(BASE);
    return data;
  },
};
