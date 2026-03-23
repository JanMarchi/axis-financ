import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;

  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Rotas autenticadas
  const isAppRoute = pathname.startsWith('/(app)') || pathname.startsWith('/dashboard');

  // Se não tem token e tenta acessar rota protegida
  if (!accessToken && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se tem token e tenta acessar rota pública, redireciona para dashboard
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
