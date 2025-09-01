import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcrypt'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')

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
  role: 'super_admin' | 'content_manager' | 'news_editor'
}

export async function createToken(payload: JwtPayload, ttl = '2h') {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * (ttl === '2h' ? 2 : 24)
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
