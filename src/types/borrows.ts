import { LoanStatus } from "./loans";

export interface BorrowItemResult {
  transactionId: string;
  itemId: string;

  ownerId: string;
  ownerFullName: string;
  ownerEmail?: string;

  agreedPrice: number;

  borrowedAt: string;
  returnDueDate?: string;
  returnedAt?: string;

  status: LoanStatus;
  statusLabel: string;

  isOverdue: boolean;
}

export interface PagedBorrowsResult {
  items: BorrowItemResult[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface GetBorrowsParams {
  status?: LoanStatus;
  ownerId?: string;
  loanedFrom?: string;
  loanedTo?: string;
  returnDueFrom?: string;
  returnDueTo?: string;
  sortBy?: number;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
