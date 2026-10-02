import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth'

// Toutes les pages /admin exigent une session administrateur, sauf la page de connexion.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (pathname === '/admin/connexion') return NextResponse.next()
  if (verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next()
  const url = new URL('/admin/connexion', request.url)
  url.searchParams.set('next', pathname + search)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
