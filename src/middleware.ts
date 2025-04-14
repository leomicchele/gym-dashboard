import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el token de autenticación de las cookies
  const authToken = request.cookies.get('Auth_token')?.value;
  
  // Verificar si la ruta actual es la de dashboard o alguna subruta
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  
  // Verificar si la ruta actual es la de autenticación
  const isAuthRoute = request.nextUrl.pathname === '/auth';
  
  // Si es una ruta protegida y no hay token, redirigir a la página de autenticación
  if (isDashboardRoute && !authToken) {
    // Redirigir a la página de login
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  // Si el usuario está autenticado y trata de acceder a la página de autenticación, redirigir al dashboard
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Continuar con la solicitud
  return NextResponse.next();
}

// Configurar las rutas que deben ser procesadas por el middleware
export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
}; 