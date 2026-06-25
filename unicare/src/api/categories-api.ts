import { axiosInstance } from "./axios-instance";
import type { CategoryResponse } from "@/types/categories";

const BASE = "/api/v1/Categories";

export const categoriesApi = {
  /** GET /api/Categories — list all categories */
  getAll: async (): Promise<CategoryResponse[]> => {
    const { data } = await axiosInstance.get<CategoryResponse[]>(BASE);
    return data;
  },
};
