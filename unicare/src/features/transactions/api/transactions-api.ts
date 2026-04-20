import { axiosInstance } from "@/lib/api/axios-instance";
import type {
  CreateTransactionPayload,
  TransactionResponse,
  ActiveTransaction,
  HandoverCode,
  HandoverStatus,
  VerifyCodePayload,
  VerifyCodeResponse,
} from "@/features/transactions/types";

const BASE = "/api/transactions";

export const transactionsApi = {
  /** POST /api/transactions — create a new transaction */
  create: async (
    payload: CreateTransactionPayload,
    token: string,
  ): Promise<TransactionResponse> => {
    const { data } = await axiosInstance.post<TransactionResponse>(
      BASE,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  },

  /** GET /api/transactions/active — list active transactions */
  getActive: async (
    userId: string,
    token: string,
  ): Promise<ActiveTransaction[]> => {
    const { data } = await axiosInstance.get<ActiveTransaction[]>(
      `${BASE}/active`,
      {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  },

  /** GET /api/transactions/{id}/code — get handover QR/PIN code */
  getCode: async (
    transactionId: string,
    generatedForUserId: string,
    verifiedByUserId: string,
    token: string,
  ): Promise<HandoverCode> => {
    const { data } = await axiosInstance.get<HandoverCode>(
      `${BASE}/${transactionId}/code`,
      {
        params: { generatedForUserId, verifiedByUserId },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  },

  /** POST /api/transactions/{id}/verify-code — verify a handover PIN */
  verifyCode: async (
    transactionId: string,
    payload: VerifyCodePayload,
    token: string,
  ): Promise<VerifyCodeResponse> => {
    const { data } = await axiosInstance.post<VerifyCodeResponse>(
      `${BASE}/${transactionId}/verify-code`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return data;
  },

  /** GET /api/transactions/{transactionId}/handover/status */
  getHandoverStatus: async (
    transactionId: string,
    type: number,
    token: string,
  ): Promise<HandoverStatus> => {
    const { data } = await axiosInstance.get<HandoverStatus>(
      `${BASE}/${transactionId}/handover/status`,
      {
        params: { type },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  },
};
