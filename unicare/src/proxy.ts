import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Backend API Proxy (Authorization injection)
  if (pathname.startsWith("/api/v1") || pathname.startsWith("/hubs/chat")) {
    const token = request.cookies.get("auth_token")?.value;
    const requestHeaders = new Headers(request.headers);
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
    const backendUrl =
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5111").trim();
    const url = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      backendUrl,
    );
    requestHeaders.set("host", url.host);

    console.log(`[Proxy] Path: ${pathname} | Token: ${token ? "Found" : "Missing"} | Target: ${url.toString()}`);

    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Do not apply locale routing to local API routes (like /api/auth)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Locale Routing
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except _next, _vercel, and static assets
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
