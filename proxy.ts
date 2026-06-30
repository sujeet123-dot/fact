import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret'
)
const COOKIE_NAME = 'factbrief_admin'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      await jwtVerify(token, secret)
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.delete(COOKIE_NAME)
      return res
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
