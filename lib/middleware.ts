import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookieSesion = request.cookies.get("admin_session")?.value;
  const urlActual = request.nextUrl.pathname;

  // 1. Control de Puertas (Redirecciones)
  if (urlActual.startsWith("/admin") && !cookieSesion) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((urlActual.startsWith("/login") || urlActual.startsWith("/registro")) && cookieSesion) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2. Preparamos la respuesta para inyectarle los escudos
  const response = NextResponse.next();

  // 3. Sliding Session y Control de Caché (Solo para el Admin)
  if (urlActual.startsWith("/admin")) {
    
    // Si está navegando, le recargamos 30 minutos de inactividad
    if (cookieSesion) {
      response.cookies.set("admin_session", cookieSesion, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 60 // 30 minutos extras desde este momento
      });
    }

    // Evita que el navegador guarde la pantalla privada.
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // 4. Cabeceras de Seguridad Globales (Anti-Hacking)
  response.headers.set('X-Frame-Options', 'DENY'); 
  response.headers.set('X-Content-Type-Options', 'nosniff'); 
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); 
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); 

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/registro"],
};