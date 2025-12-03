// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Redirigir raíz a login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Permitir libre acceso a estas rutas
  if (pathname.startsWith("/login") || pathname.startsWith("/api/users/register")) {
    return NextResponse.next();
  }

  // Obtener cookie token
  const cookie = req.cookies.get("token")?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si estás guardando como JSON en la cookie:
  let parsed;
  try {
    parsed = JSON.parse(cookie);
  } catch (e) {
    parsed = { token: cookie }; 
  }

  const decoded = verifyToken(parsed.token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/:path*", "/dashboard/:path*"],
};
