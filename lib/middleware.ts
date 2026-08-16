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

  // 3. Control de Caché (Solo para el Admin)
  // Evita que el navegador guarde la pantalla privada. Si cierran sesión y le dan a "Atrás", la página se recargará y los botará.
  if (urlActual.startsWith("/admin")) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // 4. Cabeceras de Seguridad Globales (Anti-Hacking)
  response.headers.set('X-Frame-Options', 'DENY'); // Evita que clonen tu web en iframes (Clickjacking)
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Evita inyección de scripts maliciosos
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Protege de dónde vienen tus visitas
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // Fuerza el uso de HTTPS seguro

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/registro"],
};