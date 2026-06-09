import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = '4m_admin_session'
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8

type AdminSessionPayload = {
  sub: string
  exp: number
}

const getConfig = () => ({
  user: process.env.ADMIN_PANEL_USER || '',
  password: process.env.ADMIN_PANEL_PASSWORD || '',
  secret: process.env.ADMIN_SESSION_SECRET || '',
})

const safeCompare = (received: string, expected: string) => {
  const receivedHash = createHash('sha256').update(received).digest()
  const expectedHash = createHash('sha256').update(expected).digest()

  return timingSafeEqual(receivedHash, expectedHash)
}

const signPayload = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url')

export const isAdminAuthConfigured = () => {
  const config = getConfig()

  return Boolean(config.user && config.password && config.secret)
}

export const verifyAdminCredentials = (username: string, password: string) => {
  const config = getConfig()

  if (!isAdminAuthConfigured()) {
    return false
  }

  return (
    safeCompare(username, config.user) && safeCompare(password, config.password)
  )
}

export const createAdminSessionToken = (username: string) => {
  const { secret } = getConfig()
  const payload: AdminSessionPayload = {
    sub: username,
    exp: Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000,
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  )
  const signature = signPayload(encodedPayload, secret)

  return `${encodedPayload}.${signature}`
}

export const verifyAdminSessionToken = (token?: string) => {
  const { secret, user } = getConfig()

  if (!token || !isAdminAuthConfigured()) {
    return null
  }

  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signPayload(encodedPayload, secret)

  if (!safeCompare(signature, expectedSignature)) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as AdminSessionPayload

    if (payload.sub !== user || payload.exp < Date.now()) {
      return null
    }

    return {
      user: payload.sub,
    }
  } catch {
    return null
  }
}

export const getAdminSession = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  return verifyAdminSessionToken(token)
}
