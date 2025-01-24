import { createMiddlewareClient } from '@/utils/supabase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { supabase, response } = createMiddlewareClient(req)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth pages are public
  const isAuthPage = req.nextUrl.pathname === '/login'
  if (isAuthPage) {
    if (session) {
      // If user is signed in, redirect to tickets
      return NextResponse.redirect(new URL('/tickets', req.url))
    }
    return response
  }

  // Home page is public
  const isHomePage = req.nextUrl.pathname === '/'
  if (isHomePage) {
    if (session) {
      // If user is signed in, redirect to tickets
      return NextResponse.redirect(new URL('/tickets', req.url))
    }
    return response
  }

  // API routes are public
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return response
  }

  // If no session and not a public page, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
