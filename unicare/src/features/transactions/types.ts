/* ─── Transaction type enum values ─── */
export const TransactionType = { Lending: 1, Sale: 2, Return: 3 } as const;
export const TransactionStatus = {
  Pending: 1,
  Active: 2,
  AwaitingReturn: 3,
  Completed: 4,
  Cancelled: 5,
} as const;

/* ─── POST /api/transactions ─── */
export interface CreateTransactionPayload {
  itemId: string;
  ownerId: string;
  requesterId: string;
  type: number;
  agreedPrice: number;
  rentalReturnDue?: string;
}

export interface TransactionResponse {
  transactionId: string;
  status: number;
  type: number;
  createdAt: string;
}

/* ─── GET /api/transactions/active ─── */
export interface ActiveTransaction {
  transactionId: string;
  itemId: string;
  type: number;
  status: number;
  agreedPrice: number;
  rentalReturnDue: string;
  isOwner: boolean;
  createdAt: string;
}

/* ─── GET /api/transactions/{id}/code ─── */
export interface HandoverCode {
  handoverId: string;
  pin: string;
  qrPayload: string;
  type: number;
  expiresAt: string;
}

/* ─── GET /api/transactions/{transactionId}/handover/status ─── */
export interface HandoverStatus {
  handoverId: string;
  status: number;
  type: number;
  expiresAt: string;
  verifiedAt: string;
}

/* ─── POST /api/transactions/{id}/verify-code ─── */
export interface VerifyCodePayload {
  verifyingUserId: string;
  pin: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  newTransactionStatus: number;
  verifiedStage: number;
  verifiedAt: string;
}
