import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_DURATION_SECONDS,
  createAdminSessionToken,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from '@/lib/adminAuth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const username = String(body?.username || '')
  const password = String(body?.password || '')

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: 'Credenciais administrativas não configuradas.' },
      { status: 503 },
    )
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json(
      { error: 'Usuário ou senha inválidos.' },
      { status: 401 },
    )
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createAdminSessionToken(username),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  })

  return response
}
