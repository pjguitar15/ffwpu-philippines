import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const publicAdminPaths = [
  '/admin/login',
  '/admin/set-password',
  '/admin/verify-change-password',
]

async function verify(token: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard /admin paths (but not the API auth routes)
  if (pathname.startsWith('/admin')) {
    if (publicAdminPaths.includes(pathname)) return NextResponse.next()
    const token = req.cookies.get('admin_token')?.value
    if (!token || !(await verify(token))) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
