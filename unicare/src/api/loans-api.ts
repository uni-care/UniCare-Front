import { axiosInstance } from "./axios-instance";
import type { ApiResponse, PagedLoansResult, GetLoansParams } from "@/types/loans";

export const loansApi = {
  /** GET /api/v1/loans — list paginated loans with filtering and sorting */
  getLoans: async (
    params: GetLoansParams,
    token: string
  ): Promise<ApiResponse<PagedLoansResult>> => {
    const { data } = await axiosInstance.get<ApiResponse<PagedLoansResult>>(
      "/api/v1/loans",
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  },
};
