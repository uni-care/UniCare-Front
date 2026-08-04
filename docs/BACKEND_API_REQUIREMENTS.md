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

## 3. SUMMARY ACTION TABLE FOR BACKEND TEAM

| Priority | Endpoint | Gap / Description | Required Action |
| :--- | :--- | :--- | :--- |
| **P0** | `GET /api/v1/transactions/all` | Missing user profile IDs & names. | Include `ownerId`, `ownerFullName`, `requesterId`, `requesterFullName`, `itemTitle`, and `chatId`. |
| **P0** | `GET /api/v1/transactions/active` | Missing user profile IDs & names. | Include `ownerId`, `ownerFullName`, `requesterId`, `requesterFullName`, `itemTitle`, and `chatId`. |
| **P0** | `POST /api/v1/chats/for-transaction` | Fails with 400 when body lacks `ownerId`. | Infer `ownerId` & `requesterId` from DB transaction entity server-side. |
| **P1** | `GET /api/v1/Items/{id}` | Null `ownerName` on item details. | Enforce user entity `JOIN` to always return valid owner name. |

---
*Report created: August 4, 2026 — UniCare Frontend Engineering Team.*
