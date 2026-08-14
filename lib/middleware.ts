import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookieSesion = request.cookies.get("admin_session")?.value;
  const urlActual = request.nextUrl.pathname;

  // 1. Si intenta entrar a /admin sin estar logueado -> Al Login
  if (urlActual.startsWith("/admin") && !cookieSesion) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Si ya está logueado y quiere entrar al /login o /registro -> Al Admin
  if ((urlActual.startsWith("/login") || urlActual.startsWith("/registro")) && cookieSesion) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/registro"],
};