import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create a response and supabase client
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove: (name, options) => {
          response.cookies.delete(name)
        },
      },
    },
  )

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup']
  if (publicRoutes.includes(pathname)) {
    return response
  }

  // Check if user is authenticated
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Get user role from session metadata
  const role = session.user?.user_metadata?.role

  // Role-based routing
  if (role === 'admin' || role === 'agent') {
    // Redirect to agent dashboard if trying to access customer routes
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/agent', request.url))
    }
  } else {
    // Customer role - redirect to dashboard if trying to access agent routes
    if (pathname.startsWith('/agent')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
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
