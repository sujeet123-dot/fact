import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { signToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const adminEmail = process.env.ADMIN_EMAIL!
  const adminPassword = process.env.ADMIN_PASSWORD!

  const emailMatch =
    email?.length === adminEmail.length &&
    timingSafeEqual(Buffer.from(email), Buffer.from(adminEmail))
  const passMatch =
    password?.length === adminPassword.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword))

  if (!emailMatch || !passMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signToken({ email })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
