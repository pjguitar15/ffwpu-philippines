import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcrypt'

const authSecret = process.env.AUTH_SECRET || 'dev-secret'
console.log(
  'AUTH_SECRET available:',
  !!process.env.AUTH_SECRET,
  'Using secret:',
  authSecret.substring(0, 10) + '...',
)
const secret = new TextEncoder().encode(authSecret)

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

export type JwtPayload = {
  sub: string
  email: string
  role: 'super_admin' | 'content_manager' | 'news_editor' | 'member'
  memberId?: string // Optional for admin users
}

export async function createToken(payload: JwtPayload, ttl = '2h') {
  // Parse TTL to hours
  let hours = 2 // default
  if (ttl.endsWith('h')) {
    hours = parseInt(ttl.slice(0, -1))
  } else if (ttl.endsWith('d')) {
    hours = parseInt(ttl.slice(0, -1)) * 24
  }

  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * hours
  return new SignJWT({ ...payload, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setExpirationTime(exp)
    .sign(secret)
}

export async function verifyToken<T = JwtPayload>(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload as unknown as T
}
