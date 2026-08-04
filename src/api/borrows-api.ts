import { axiosInstance } from "./axios-instance";
import type { ApiResponse } from "@/types/loans";
import type { PagedBorrowsResult, GetBorrowsParams } from "@/types/borrows";

export const borrowsApi = {
  /** GET /api/v1/borrows — list paginated borrow requests for current user */
  getBorrows: async (
    params: GetBorrowsParams,
    token: string
  ): Promise<ApiResponse<PagedBorrowsResult>> => {
    const { data } = await axiosInstance.get<ApiResponse<PagedBorrowsResult>>(
      "/api/v1/borrows",
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  },
};
