import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const publicAdminPaths = [
  '/admin/login',
  '/admin/set-password',
  '/admin/verify-change-password',
]

const publicMemberPaths = ['/login', '/register']

const memberProtectedPaths = [
  '/profile',
  '/messages',
  // Add other member-only paths as needed
]

async function verify(token: string) {
  const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET || 'dev-secret',
  )
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Guard /admin paths
  if (pathname.startsWith('/admin')) {
    if (publicAdminPaths.includes(pathname)) return NextResponse.next()

    const adminToken = req.cookies.get('admin_token')?.value
    if (!adminToken) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    const adminPayload = await verify(adminToken)
    if (
      !adminPayload ||
      !['super_admin', 'content_manager', 'news_editor'].includes(
        adminPayload.role as string,
      )
    ) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Guard member-protected paths
  if (memberProtectedPaths.some((path) => pathname.startsWith(path))) {
    const memberToken = req.cookies.get('member_token')?.value
    if (!memberToken) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    const memberPayload = await verify(memberToken)
    if (!memberPayload || memberPayload.role !== 'member') {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/messages/:path*'],
}
