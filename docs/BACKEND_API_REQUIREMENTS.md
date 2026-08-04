# UniCare Backend API Requirements & Integration Gap Analysis Report

## Executive Summary
This document provides a comprehensive integration report for the backend engineering team. 

Following recent updates, the frontend application has completely removed client-side storage fallbacks (`localStorage`) and now integrates directly with the backend endpoints, including the `GET /api/v1/transactions/all` (`GetAllTransactionsQuery`) endpoint.

To achieve seamless data hydration, error-free chat initialization, and complete real-time transaction visibility across borrower and lender dashboards, the backend engineering team needs to implement the specific schema and logic enhancements detailed below.

---

## 1. FINDINGS & INTEGRATED ENDPOINTS

### Integrated: `GET /api/v1/transactions/all`
* **Status:** Integrated into frontend (`transactionsApi.getAll`).
* **Functionality:** Provides all transactions associated with the user across all statuses (`PendingApproval`, `AwaitingHandover`, `Active`, `Completed`, `Cancelled`).
* **Frontend Utilization:** Successfully used to display pending transaction requests in **My Borrows** and **My Loans** without relying on client-side state persistence.

---

## 2. REQUIRED BACKEND SCHEMA ENHANCEMENTS

### Issue 1: Missing User Metadata in `GET /api/v1/transactions/all` & `GET /api/v1/transactions/active`
**Priority:** `P0 - Critical`

#### Current Response Payload:
```json
{
  "transactionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "itemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "type": 1,
  "status": 1,
  "agreedPrice": 0,
  "rentalReturnDue": "2026-08-04T12:00:00Z",
  "isOwner": false,
  "createdAt": "2026-08-04T12:00:00Z"
}
```

#### Required Fields to Add:
1. `ownerId` (GUID): UUID of the item owner. (Required for initializing chat via `POST /api/v1/chats/for-transaction`).
2. `ownerFullName` (string): Full name of the item owner.
3. `requesterId` (GUID): UUID of the requesting user.
4. `requesterFullName` (string): Full name of the borrower/requester.
5. `itemTitle` (string): Title of the item.
6. `chatId` (GUID / string, optional): Existing chat room ID for this transaction if already created.

#### Proposed Response Payload:
```json
{
  "transactionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "itemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "itemTitle": "Digital Multimeter Kit",
  "type": 1,
  "status": 1,
  "agreedPrice": 0,
  "rentalReturnDue": "2026-08-04T12:00:00Z",
  "isOwner": false,
  "ownerId": "e1b2c3d4-5678-90ab-cdef-1234567890ab",
  "ownerFullName": "Ahmed Hassan",
  "requesterId": "f9e8d7c6-5432-10fe-dcba-0987654321ba",
  "requesterFullName": "Sarah Mohamed",
  "chatId": "a1b2c3d4-0000-1111-2222-333344445555",
  "createdAt": "2026-08-04T12:00:00Z"
}
```

---

### Issue 2: Payload Validation in `POST /api/v1/chats/for-transaction`
**Priority:** `P0 - Critical`

#### Problem:
When the client calls `POST /api/v1/chats/for-transaction` with empty `ownerId` or `requesterId`, the server throws an **Axios HTTP 400 Bad Request** error.

#### Recommended Action:
1. **Server-Side Entity Lookup:** In `GetOrCreateChatForTransactionCommandHandler`, perform a repository lookup for `Transaction` using `transactionId`.
2. Automatically derive `ownerId` and `requesterId` from the database record if they are missing or empty in the request body.
3. Guarantee idempotency: If a conversation exists for the given `transactionId`, return `200 OK` with `chatId`.

---

### Issue 3: Owner Name Association in `GET /api/v1/Items/{id}`
**Priority:** `P1 - High`

#### Problem:
`GET /api/v1/Items/{id}` occasionally returns `ownerName: null` for items created via seed scripts or items without explicit user JOIN queries.

#### Recommended Action:
Update `GetItemByIdQueryHandler` to perform a SQL `JOIN` or EF Core `.Include(x => x.Owner)` to ensure `ownerId` and `ownerName` (or `ownerFullName`) are always populated.

---

### Issue 4: Validation Rejection for Free Items (`AgreedPrice = 0`) in `POST /api/v1/transactions`
**Priority:** `P0 - Critical`

#### Problem:
In `CreateTransactionCommandValidator.cs`, the FluentValidation rule is currently set to:
```csharp
RuleFor(x => x.AgreedPrice)
    .GreaterThan(0).WithMessage("AgreedPrice must be greater than zero.");
```
This forces free resource requests (`agreedPrice = 0`) to fail validation with a `400 Bad Request`. As a client-side workaround, the frontend was forced to pass `agreedPrice = 1` for free items.

#### Negative Side-Effects of sending `1` instead of `0`:
1. **Misleading UI & Receipts:** Free items display price as `1 EGP` / `1 جنيه` instead of `Free` / `مجاني` on receipts and handover verification screens.
2. **Distorted Financial Reports:** System totals, user borrowing stats, and transaction ledgers miscalculate free peer-to-peer exchanges as paid transactions.

#### Recommended Action:
Update `CreateTransactionCommandValidator.cs` to allow zero:
```csharp
RuleFor(x => x.AgreedPrice)
    .GreaterThanOrEqualTo(0).WithMessage("AgreedPrice cannot be negative.");
```

---

### Issue 5: Unified Querying & Server-Side Status Filtering in `GET /api/v1/borrows` & `GET /api/v1/loans`
**Priority:** `P1 - High`

#### Problem:
Currently, `GET /api/v1/borrows` and `GET /api/v1/loans` only return active or completed loan entities and omit pending transaction requests (`PendingApproval`). 
To display all user activity, the frontend is forced to execute 3 parallel API requests (`borrows` + `transactions/active` + `transactions/all`), merge the arrays in client memory, and perform client-side filtering (`.filter(...)`) and pagination (`.slice(...)`).

#### Negative Side-Effects of Client-Side Hybrid Filtering:
1. **Inaccurate Server-Side Pagination:** When filtering on the client after fetching `pageSize = 10`, a filter tab may only display 2 items on Page 1 instead of a full page of 10 items.
2. **Excess Network Traffic:** The frontend must download all historical user transactions for every tab or status filter change.

#### Recommended Action:
1. Update `GetBorrowsQueryHandler` and `GetLoansQueryHandler` to query both `Transactions` and `Loans` tables directly in SQL.
2. Implement true SQL-level status filtering (`WHERE Status = @Status`) and `OFFSET / FETCH NEXT` server-side pagination so a single clean endpoint (`GET /api/v1/borrows?status=1&pageNumber=1&pageSize=10`) satisfies all dashboard tab views.

### Issue 6: Counterpart Name Metadata in Handover Code Endpoint (`GET /api/v1/transactions/{id}/code`)
**Priority:** `P1 - High`

#### Problem:
When calling `GET /api/v1/transactions/{id}/code`, the response returns the handover token, PIN, type, and expiration, but omits the full names of the Issuer (`ownerFullName`) and Verifier (`requesterFullName`). The frontend currently has to perform fallback lookups across `loans` endpoints to display the borrower/owner's real name on the Handover page.

#### Recommended Action:
Include counterpart full names in `GenerateHandoverResult` DTO returned by `GET /api/v1/transactions/{id}/code`:
```json
{
  "handoverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "pin": "123456",
  "type": 1,
  "expiresAt": "2026-08-04T12:30:00Z",
  "generatedForUserId": "e1b2c3d4-5678-90ab-cdef-1234567890ab",
  "generatedForFullName": "Ahmed Hassan",
  "verifiedByUserId": "f9e8d7c6-5432-10fe-dcba-0987654321ba",
  "verifiedByFullName": "Sarah Mohamed"
}
```

---

## 3. SUMMARY ACTION TABLE FOR BACKEND TEAM

| Priority | Endpoint | Gap / Description | Required Action |
| :--- | :--- | :--- | :--- |
| **P0** | `GET /api/v1/transactions/all` | Missing user profile IDs & names. | Include `ownerId`, `ownerFullName`, `requesterId`, `requesterFullName`, `itemTitle`, and `chatId`. |
| **P0** | `GET /api/v1/transactions/active` | Missing user profile IDs & names. | Include `ownerId`, `ownerFullName`, `requesterId`, `requesterFullName`, `itemTitle`, and `chatId`. |
| **P0** | `POST /api/v1/chats/for-transaction` | Fails with 400 when body lacks `ownerId`. | Infer `ownerId` & `requesterId` from DB transaction entity server-side. |
| **P0** | `POST /api/v1/transactions` | Rejects `agreedPrice = 0` for free items. | Change `.GreaterThan(0)` to `.GreaterThanOrEqualTo(0)` in `CreateTransactionCommandValidator`. |
| **P1** | `GET /api/v1/Items/{id}` | Null `ownerName` on item details. | Enforce user entity `JOIN` to always return valid owner name. |
| **P1** | `GET /api/v1/borrows` & `GET /api/v1/loans` | Hybrid client-side filtering & missing pending requests. | Include pending transactions in SQL query and support true server-side status filtering & pagination. |
| **P1** | `GET /api/v1/transactions/{id}/code` | Missing counterpart full names on handover card. | Include `generatedForFullName` and `verifiedByFullName` in `GenerateHandoverResult` response. |

---
*Report created: August 4, 2026 — UniCare Frontend Engineering Team.*
