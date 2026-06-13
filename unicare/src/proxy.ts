import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  // Clone request headers and add Authorization header if token is present
  const requestHeaders = new Headers(request.headers);
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  // Rewrite /api/v1/... requests to the backend API URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5111";
  const url = new URL(request.nextUrl.pathname + request.nextUrl.search, backendUrl);

  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
}

// Intercept only /api/v1/ routes (excluding our Next.js API routes under /api/auth)
export const config = {
  matcher: ["/api/v1/:path*"],
};
