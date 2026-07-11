export enum LoanStatus {
  PendingApproval = 1,
  AwaitingHandover = 2,
  Active = 3,
  Overdue = 4,
  Returned = 5,
  Cancelled = 6,
}

export enum LoanSortBy {
  LoanDate = 1,
  ReturnDueDate = 2,
  Status = 3,
}

export interface LoanItemResult {
  transactionId: string;
  itemId: string;
  borrowerId: string;
  borrowerFullName: string;
  borrowerEmail?: string;
  agreedPrice: number;
  loanedAt: string;
  returnDueDate?: string;
  returnedAt?: string;
  status: LoanStatus;
  statusLabel: string;
  isOverdue: boolean;
}

export interface PagedLoansResult {
  items: LoanItemResult[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  errors?: string[];
  timestamp: string;
}

export interface GetLoansParams {
  status?: LoanStatus;
  borrowerId?: string;
  loanedFrom?: string;
  loanedTo?: string;
  returnDueFrom?: string;
  returnDueTo?: string;
  sortBy?: LoanSortBy;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
