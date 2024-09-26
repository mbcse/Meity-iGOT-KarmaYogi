import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware running on path:', request.nextUrl.pathname);

  const token = request.cookies.get('token')?.value;
  console.log('Token found:', !!token);

  // List of paths that don't require authentication
  const authPaths = ['/login', '/signup'];

  // Check if the requested path is in the auth paths (login/signup)
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));
  console.log('Is auth path:', isAuthPath);

  if (token && isAuthPath) {
    // If token exists and trying to access login/signup, redirect to home
    console.log('Token exists, redirecting from auth path to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && !isAuthPath) {
    // If no token and it's not an auth path, redirect to login
    console.log('No token, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Proceeding to next middleware/page');
  // Continue to the requested page
  return NextResponse.next();
}

// Apply the middleware to all routes except API, static assets, and certain paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|Karmayogi.svg|redfort.png|chatbot-anim.gif|Channels.png|chatholder.svg|next.svg|vercel.svg).*)',
  ],
};

