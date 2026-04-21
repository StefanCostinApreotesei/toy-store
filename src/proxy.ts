import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/rate-limit";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit auth login attempts (POST only — not session checks)
  if (pathname.startsWith("/api/auth") && request.method === "POST") {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { success } = rateLimit(`auth:${ip}`, 15, 60000);
    if (!success) {
      return NextResponse.json(
        { error: "Prea multe încercări. Încercați din nou mai târziu." },
        { status: 429 }
      );
    }
  }

  // Rate limit general API
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(`api:${ip}`, 60, 60000);
    if (!success) {
      return NextResponse.json(
        { error: "Limita de cereri depășită." },
        { status: 429 }
      );
    }
  }

  // Protect admin routes (except login page and auth API)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/auth")
  ) {
    const token =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
