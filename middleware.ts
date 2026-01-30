// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes publiques qui ne nécessitent pas d'authentification
  const publicPaths = ['/', '/login', '/auth/signin'];
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith('/auth/')
  );
  
  // Récupérer les cookies
  const userCookie = request.cookies.get('user')?.value;
  const roleCookie = request.cookies.get('role')?.value;
  const tokenCookie = request.cookies.get('token')?.value;
  
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = userCookie && roleCookie && tokenCookie;
  
  // Pour les routes publiques, laisser passer
  if (isPublicPath) {
    // Si l'utilisateur est déjà connecté et essaie d'accéder à une page d'authentification,
    // le rediriger vers son dashboard
    if (isAuthenticated && (pathname === '/login' || pathname === '/auth/signin')) {
      const redirectTo = roleCookie === 'ADMIN' || roleCookie === 'SUPERADMIN' ? '/admin' : '/user';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.next();
  }
  
  // Si non authentifié et essayant d'accéder à une route protégée
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Vérifier les permissions
  try {
    const role = roleCookie;
    
    // Routes admin
    if (pathname.startsWith('/admin')) {
      if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        // Rediriger les non-admins
        return NextResponse.redirect(new URL('/user', request.url));
      }
    }
    
    // Routes user
    if (pathname.startsWith('/user')) {
      // Tous les utilisateurs authentifiés peuvent accéder
      return NextResponse.next();
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // En cas d'erreur, rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/login',
    '/auth/:path*',
    // Ajoutez d'autres routes protégées si nécessaire
  ],
};