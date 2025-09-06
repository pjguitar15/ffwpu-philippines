'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// react-icons
import {
  FiMenu,
  FiX,
  FiInfo,
  FiFileText,
  FiBookOpen,
  FiMail,
  FiVideo,
  FiPhone,
  FiClock,
  FiHeart,
  FiShield,
  FiFile,
} from 'react-icons/fi'
import { Sparkles, Search as SearchIcon } from 'lucide-react'
import { HeaderSearch } from './header-search'
import { LiveIndicator } from '@/components/ui/live-indicator'

export const mainNavItems = [
  {
    href: '/',
    label: 'Home',
    desc: 'Welcome & featured highlights',
    icon: FiFileText,
  },
  {
    href: '/about',
    label: 'About',
    desc: 'Who we are & our mission',
    icon: FiInfo,
  },
  {
    href: '/news',
    label: 'News',
    desc: 'Latest updates & reports',
    icon: FiFileText,
  },
  {
    href: '/contact',
    label: 'Contact',
    desc: 'Reach out to our team',
    icon: FiPhone,
  },
]

export const extraNavItems = [
  {
    href: '/about/true-parents',
    label: 'True Parents',
    desc: 'Rev. Moon & Holy Mother Han',
    icon: FiHeart,
  },
  {
    href: '/holy-mother-han',
    label: 'Holy Mother Han',
    desc: 'Learn about Holy Mother Han',
    icon: Sparkles,
  },
  {
    href: '/true-father',
    label: 'True Father',
    desc: 'Rev. Sun Myung Moon',
    icon: FiShield,
  },
  {
    href: '/about/history',
    label: 'Our History',
    desc: 'Roots of our movement',
    icon: FiClock,
  },
  {
    href: '/hj-media-works',
    label: 'HJ MediaWorks',
    desc: 'Videos & media content',
    icon: FiVideo,
  },
  {
    href: '/hj-testimonies',
    label: 'HJ Testimonies',
    desc: 'Personal stories & interviews',
    icon: FiBookOpen,
  },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  // Search is handled by HeaderSearch (wrapped in Suspense). No direct useSearchParams here.

  const isActive = (href: string) => pathname === href

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const DrawerList = ({ items }: { items: typeof mainNavItems }) => (
    <nav className='p-5 mt-2 space-y-1'>
      {items.map((item, index) => {
        const Icon = item.icon as any
        const active = isActive(item.href)
        return (
          <Link
            key={index}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-6 py-4 cursor-pointer transition-none',
              'hover:bg-blue-100',
              active && 'bg-blue-100',
            )}
          >
            <Icon
              className='mt-0.5 h-5 w-5 text-foreground/80'
              aria-hidden='true'
            />
            <div className='flex-1'>
              <div
                className={cn(
                  'text-md font-semibold leading-none',
                  active && 'text-foreground',
                )}
              >
                {item.label}
              </div>
              {item.desc && (
                <div className='mt-1 text-xs text-foreground/70'>
                  {item.desc}
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      <div className='bg-gradient-to-r from-blue-800 via-cyan-800 to-sky-800 text-white py-2 px-4 text-center text-sm shadow-sm'>
        {/* Mobile / Tablet (short) */}
        <p className='block lg:hidden font-medium tracking-wide'>
          ✨ Sunday Service • 10:00 AM (Manila)
        </p>

        {/* Desktop (exact original text) */}
        <p className='hidden lg:block font-medium tracking-wide'>
          ✨ Join us for our{' '}
          <span className='font-semibold'>Weekly Sunday Service</span> • Every
          Sunday at 10:00 AM (Manila)
        </p>
      </div>

      <header className='sticky top-0 z-50 w-full bg-background border-b'>
        <div className='container mx-auto flex h-16 items-center px-4 gap-3 min-w-0'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2 shrink-0'>
            <div className='flex flex-col'>
              <Image
                src='/ffwpu-ph-logo.webp'
                alt='FFWPU Philippines Logo'
                width={130}
                height={130}
                priority
                className='h-8 w-auto md:h-7 lg:h-8 shrink-0'
                sizes='(min-width: 1024px) 144px, (min-width: 768px) 128px, 112px'
              />
            </div>
          </Link>

          {/* Live Indicator (can hide on tight widths if needed) */}
          <LiveIndicator className='hidden sm:inline-flex ml-1 shrink-0' />

          {/* Desktop search: flexible, capped width, no large fixed margin */}
          <Suspense
            fallback={
              <div className='hidden md:block flex-1 min-w-0 h-9 rounded-full bg-muted/60' />
            }
          >
            <div className='hidden md:flex flex-1 min-w-0 justify-center'>
              <HeaderSearch
                variant='desktop'
                className='w-full max-w-[clamp(14rem,40vw,28rem)]' // 224px → 40vw → 448px
              />
            </div>
          </Suspense>

          {/* Right: nav + burger */}
          <div className='ml-auto flex items-center gap-2 sm:gap-3 min-w-0'>
            <nav className='hidden lg:flex items-center gap-4'>
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium hover:bg-blue-100 rounded-full px-3 py-2 flex items-center gap-2',
                    isActive(item.href) ? 'font-bold' : 'text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type='button'
              aria-label='Open menu'
              onClick={() => setIsOpen(true)}
              className='h-12 w-12 inline-flex items-center justify-center hover:bg-blue-100 rounded-full cursor-pointer shrink-0'
            >
              <FiMenu className='h-5 w-5' strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {isOpen && (
          <>
            <button
              aria-label='Close menu overlay'
              onClick={() => setIsOpen(false)}
              className='fixed inset-0 z-40 bg-black/40'
            />
            <div
              className='fixed right-0 top-0 z-50 h-dvh w-[300px] sm:w-[400px] bg-background shadow-xl flex flex-col'
              role='dialog'
              aria-modal='true'
            >
              <div className='flex items-center justify-between p-4 border-b'>
                <span className='text-lg font-semibold'>Menu</span>
                <button
                  type='button'
                  aria-label='Close menu'
                  onClick={() => setIsOpen(false)}
                  className='h-10 w-10 inline-flex items-center justify-center hover:bg-blue-100 rounded-full'
                >
                  <FiX className='h-6 w-6' strokeWidth={2.5} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className='flex-1 overflow-y-auto overscroll-contain'>
                {/* Drawer search — mobile only */}
                {isOpen && (
                  <div className='md:hidden'>
                    <Suspense
                      fallback={
                        <div className='p-4 border-b'>
                          <div className='h-10 rounded-xl bg-muted/60' />
                        </div>
                      }
                    >
                      <div className='p-4 border-b'>
                        <HeaderSearch variant='drawer' />
                      </div>
                    </Suspense>
                  </div>
                )}

                {/* Drawer links */}
                <div className='md:hidden'>
                  <DrawerList items={[...mainNavItems, ...extraNavItems]} />
                </div>
                <div className='hidden md:block'>
                  <DrawerList items={extraNavItems as any} />
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  )
}
