# UniCare Frontend Development Setup Guide

This document provides step-by-step instructions to configure, initialize, and run the UniCare Next.js frontend application locally for development.

---

## Prerequisites

Before starting, ensure you have the following software installed:

1. **Node.js** (v18.18.0 or higher, LTS recommended)
2. **npm** (v9.0.0 or higher)

---

## Environment Configuration

The application uses environment variables to target API endpoints. Create a `.env` file in the root of the frontend project (`unicare/.env`):

```env
# URL of the UniCare API Backend
NEXT_PUBLIC_API_URL=https://....
```

- **To target the deployed production backend:** Set `NEXT_PUBLIC_API_URL=https://....`
- **To target a local backend instance:** Set `NEXT_PUBLIC_API_URL=http://localhost:5111`

---

## Architecture and Directory Structure

The project uses a flattened Next.js App Router architecture:

```
src/
├── api/          # Centralized API client wrappers & Axios setup
├── app/          # Next.js App Router (pages & server-side API routes)
├── components/   # Modular UI components
├── hooks/        # Application-wide reusable React hooks (e.g. useAuth)
├── lib/          # Helper utilities & configuration (SignalR, Tailwind utils)
├── types/        # TypeScript interfaces & validation schemas
└── proxy.ts      # Next.js BFF proxy routing definition
```

### Authentication Injection

Session states are managed securely using HttpOnly cookies. When the frontend invokes `/api/v1/*` endpoints, the Next.js server-side BFF (`src/proxy.ts`) intercepts the request, reads the secure `auth_token` cookie, appends it as a `Bearer` token inside the `Authorization` header, and proxies the request to the backend.

---

## Running the Application

Follow these commands to install dependencies and boot the application:

1. Open your terminal at the root directory of the frontend project (`unicare`).
2. Install the necessary project dependencies:
   ```bash
   npm install
   ```
3. Boot up the local Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server address (typically `http://localhost:3000`).

---

## Production Build Verification

To verify the production build behavior or prepare for deployment:

1. Compile the production bundle:
   ```bash
   npm run build
   ```
2. Run the production build locally:
   ```bash
   npm run start
   ```
