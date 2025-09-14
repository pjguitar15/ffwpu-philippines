'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Megaphone,
  Users,
  Activity,
  LogOut,
  Shield,
  User,
  KeyRound,
  Radio,
  Video,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'content_manager' | 'news_editor'
  name: string
}

const CACHE_KEY = 'adminUserCache.v1'
const CACHE_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours

function readCachedUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { user?: AdminUser; ts?: number }
    if (!parsed?.user || !parsed?.ts) return null
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null
    return parsed.user
  } catch {
    return null
  }
}
function writeCachedUser(user: AdminUser) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ user, ts: Date.now() }))
  } catch {}
}
function clearCachedUser() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {}
}

export function AdminSidebar() {
  // Start with a consistent SSR-safe state, then hydrate from cache on mount
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  useEffect(() => {
    const cached = readCachedUser()
    if (cached) setAdminUser(cached)
  }, [])

  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  // background revalidation
  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!res.ok) {
          clearCachedUser()
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        const user: AdminUser = 'user' in data ? data.user : data
        setAdminUser(user)
        writeCachedUser(user)
      } catch {
        // keep cached UI
      }
    })()
    return () => controller.abort()
  }, [router])

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CACHE_KEY) return
      const u = readCachedUser()
      setAdminUser(u)
      if (!u) router.push('/admin/login')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [router])

  const handleLogout = async () => {
    clearCachedUser()
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    })
    router.push('/admin/login')
  }

  const menuItems = useMemo(
    () => [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/news', label: 'News', icon: FileText },
      { href: '/admin/events', label: 'Events', icon: Megaphone },
      { href: '/admin/livestream', label: 'Livestream', icon: Radio },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Megaphone },
      {
        href: '/admin/word-of-the-day',
        label: 'Word of the Day',
        icon: Sparkles,
      },
      {
        href: '/admin/hj-media-works',
        label: 'HJ Media Works',
        icon: Video,
      },
    ],
    [],
  )
  const accountItems = useMemo(
    () => [
      {
        href: '/admin/change-password',
        label: 'Change Password',
        icon: KeyRound,
      },
    ],
    [],
  )
  const superAdminItems = useMemo(
    () => [
      { href: '/admin/admins', label: 'Admin Users', icon: Users },
      { href: '/admin/audit-log', label: 'Audit Log', icon: Activity },
    ],
    [],
  )

  const roleLabel = adminUser
    ? adminUser.role === 'super_admin'
      ? 'super admin'
      : adminUser.role
    : ''

  return (
    <div className='w-64 bg-card border-r h-screen flex flex-col'>
      {/* Brand bar (logo lockup: round emblem + text) */}
      <div className='ps-8 pt-7 pb-6 border-b flex justify-start items-center'>
        <Link href='/' className='flex items-center gap-3 group'>
          <Image
            src='/ffwpu-ph-logo.webp'
            alt='FFWPU Philippines'
            width={100}
            height={24}
            priority
            className='h-7 w-auto object-contain select-none'
          />
          {/* Optional label if you want extra text—remove if your image already has text */}
          {/* <span className="text-sm font-semibold tracking-wide text-foreground/90 group-hover:text-foreground">
            FFWPU Philippines
          </span> */}
        </Link>
      </div>

      {/* Account panel */}
      <div className='px-7 py-6 border-b'>
        <div className='flex items-center space-x-3'>
          <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
            {adminUser ? (
              adminUser.role === 'super_admin' ? (
                <Shield className='h-5 w-5' />
              ) : (
                <User className='h-5 w-5 text-muted-foreground' />
              )
            ) : (
              <User className='h-5 w-5 text-muted-foreground' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-medium text-sm truncate'>
              {adminUser?.name || 'Admin'}
            </p>
            <p className='text-xs text-muted-foreground capitalize'>
              {roleLabel.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-6 space-y-3'>
        {menuItems.map((item) => {
          const Icon = item.icon as any
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className='w-full justify-start h-10 px-4 cursor-pointer'
              >
                <Icon className='mr-3 h-4 w-4' />
                {item.label}
              </Button>
            </Link>
          )
        })}

        {/* Accounts Section */}
        <Separator className='my-4' />
        <div className='space-y-3'>
          <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4'>
            Accounts
          </p>
          {accountItems.map((item) => {
            const Icon = item.icon as any
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className='w-full justify-start h-10 px-4 cursor-pointer'
                >
                  <Icon className='mr-3 h-4 w-4' />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>

        {adminUser?.role === 'super_admin' && (
          <>
            <Separator className='my-4' />
            <div className='space-y-3'>
              <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4'>
                Super Admin
              </p>
              {superAdminItems.map((item) => {
                const Icon = item.icon as any
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + '/')
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className='w-full justify-start h-10 px-4 cursor-pointer'
                    >
                      <Icon className='mr-3 h-4 w-4' />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className='p-6 border-t'>
        <Button
          variant='ghost'
          className='w-full justify-start h-10 px-4'
          onClick={handleLogout}
        >
          <LogOut className='mr-3 h-4 w-4' />
          Logout
        </Button>
      </div>
    </div>
  )
}
