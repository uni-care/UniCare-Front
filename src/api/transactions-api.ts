import { axiosInstance } from "./axios-instance";
import type {
  CreateTransactionPayload,
  TransactionResponse,
  ActiveTransaction,
  HandoverCode,
  HandoverStatus,
  VerifyCodePayload,
  VerifyCodeResponse,
  RespondToTransactionResponse,
} from "@/types/transactions";

const BASE = "/api/v1/transactions";

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

  /** POST /api/v1/transactions/{id}/respond — owner approve or decline request */
  respond: async (
    transactionId: string,
    isApproved: boolean,
    token: string
  ): Promise<RespondToTransactionResponse> => {
    const { data } = await axiosInstance.post<RespondToTransactionResponse>(
      `${BASE}/${transactionId}/respond`,
      { isApproved },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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

  /** GET /api/v1/transactions/all — list all user transactions (pending, active, etc.) */
  getAll: async (
    token: string,
  ): Promise<ActiveTransaction[]> => {
    const { data } = await axiosInstance.get<ActiveTransaction[]>(
      `${BASE}/all`,
      {
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

  /** GET /api/v1/handover/status */
  getHandoverStatus: async (
    transactionId: string,
    type: number,
    token: string,
  ): Promise<HandoverStatus> => {
    const { data } = await axiosInstance.get<HandoverStatus>(
      `/api/v1/handover/status`,
      {
        params: { transactionId, type },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  },
};
