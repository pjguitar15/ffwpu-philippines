'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  FiMenu,
  FiX,
  FiInfo,
  FiFileText,
  FiBookOpen,
  FiVideo,
  FiPhone,
  FiClock,
  FiHeart,
  FiShield,
  FiChevronDown,
} from 'react-icons/fi'
import { Sparkles } from 'lucide-react'
import { HeaderSearch } from './header-search'
import { LiveIndicator } from '@/components/ui/live-indicator'

const IN_TOP_NAV_ON_XL = new Set<string>([
  '/about/true-parents',
  '/hj-testimonies',
])

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
] as const

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
] as const

const mediaItems = extraNavItems.filter(
  (i) => i.href === '/hj-media-works' || i.href === '/hj-testimonies',
)
const trueParentsParent = extraNavItems.find(
  (i) => i.href === '/about/true-parents',
)
const trueParentsKids = extraNavItems.filter(
  (i) => i.href === '/holy-mother-han' || i.href === '/true-father',
)
const leftoverExtras = extraNavItems.filter(
  (i) =>
    ![
      '/hj-media-works',
      '/hj-testimonies',
      '/about/true-parents',
      '/holy-mother-han',
      '/true-father',
    ].includes(i.href),
)
const desktopExtrasXL = extraNavItems.filter((i) =>
  IN_TOP_NAV_ON_XL.has(i.href),
)
const drawerExtrasAlways = extraNavItems.filter(
  (i) => !IN_TOP_NAV_ON_XL.has(i.href),
)
const drawerExtrasXLHidden = extraNavItems.filter((i) =>
  IN_TOP_NAV_ON_XL.has(i.href),
)

type NavItem = (typeof mainNavItems)[number] | (typeof extraNavItems)[number]

function DrawerList({
  items,
  onChoose,
}: {
  items: readonly NavItem[]
  onChoose: () => void
}) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href
  return (
    <nav className='px-5 space-y-1'>
      {items.map((item) => {
        const Icon = item.icon as any
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onChoose}
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
}

function DrawerGroup({
  label,
  parent,
  childrenItems,
  onChoose,
  defaultOpen,
  icon: Icon,
}: {
  label: string
  parent?: NavItem
  childrenItems: readonly NavItem[]
  onChoose: () => void
  defaultOpen?: boolean
  icon?: any
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(Boolean(defaultOpen))
  useEffect(() => {
    if (
      !open &&
      (parent?.href === pathname ||
        childrenItems.some((c) => c.href === pathname))
    )
      setOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  const groupActive =
    (parent && pathname === parent.href) ||
    childrenItems.some((c) => c.href === pathname)

  return (
    <div className='px-5'>
      <div
        className={cn(
          'flex items-stretch rounded-xl overflow-hidden ring-1 ring-transparent hover:ring-blue-200',
          groupActive && 'ring-blue-300',
        )}
      >
        <Link
          href={parent?.href || '#'}
          onClick={onChoose}
          className={cn(
            'flex-1 flex items-center gap-3 px-6 py-4 cursor-pointer bg-transparent hover:bg-blue-100',
            groupActive && 'bg-blue-100',
          )}
        >
          {Icon ? <Icon className='mt-0.5 h-5 w-5 text-foreground/80' /> : null}
          <div className='flex-1'>
            <div className='text-md font-semibold leading-none'>{label}</div>
            {parent?.desc && (
              <div className='mt-1 text-xs text-foreground/70'>
                {parent.desc}
              </div>
            )}
          </div>
        </Link>
        <button
          type='button'
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className='px-4 py-4 cursor-pointer hover:bg-blue-100 border-l'
        >
          <FiChevronDown
            className={cn('h-5 w-5 transition-transform', open && 'rotate-180')}
          />
        </button>
      </div>
      {open && (
        <div className='mt-1'>
          <DrawerList items={childrenItems} onChoose={onChoose} />
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  // lock page scroll when drawer open
  useEffect(() => {
    if (!isOpen) return
    const { body, documentElement: html } = document
    const prevBody = body.style.overflow
    const prevHtml = html.style.overflow
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prevBody
      html.style.overflow = prevHtml
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className='sticky top-[env(safe-area-inset-top,0px)] z-50'>
        <div className='bg-gradient-to-r from-blue-800 via-cyan-800 to-sky-800 text-white py-2 px-4 text-center text-sm shadow-sm'>
          <p className='block lg:hidden font-medium tracking-wide'>
            ✨ Sunday Service • 10:00 AM (Manila)
          </p>
          <p className='hidden lg:block font-medium tracking-wide'>
            ✨ Join us for our{' '}
            <span className='font-semibold'>Weekly Sunday Service</span> • Every
            Sunday at 10:00 AM (Manila)
          </p>
        </div>

        <header className='w-full bg-background border-b'>
          <div className='container mx-auto flex h-16 items-center px-4 gap-3 min-w-0'>
            <div className='flex items-center gap-3 min-w-0'>
              <Link href='/' className='flex items-center space-x-2 shrink-0'>
                <Image
                  src='/ffwpu-ph-logo.webp'
                  alt='FFWPU Philippines Logo'
                  width={130}
                  height={130}
                  priority
                  className='h-8 w-auto md:h-7 lg:h-8 shrink-0'
                  sizes='(min-width: 1024px) 144px, (min-width: 768px) 128px, 112px'
                />
              </Link>

              <Suspense
                fallback={
                  <div className='hidden md:block h-9 w-[clamp(12rem,28vw,22rem)] rounded-full bg-muted/60' />
                }
              >
                <div className='hidden md:block min-w-[12rem] w-[clamp(12rem,28vw,24rem)] ms-3'>
                  <HeaderSearch variant='desktop' className='h-9 w-full' />
                </div>
              </Suspense>

              <LiveIndicator className='hidden md:inline-flex shrink-0' />
            </div>

            <div className='ml-auto flex items-center gap-2 sm:gap-3 min-w-0'>
              <nav className='hidden lg:flex items-center gap-2'>
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
                <div className='hidden xl:flex items-center gap-2'>
                  {desktopExtrasXL.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-sm font-medium hover:bg-blue-100 rounded-full p-3 flex items-center gap-2',
                        isActive(item.href) ? 'font-bold' : 'text-foreground',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
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
        </header>
      </div>

      {isOpen && (
        <>
          <button
            aria-label='Close menu overlay'
            onClick={() => setIsOpen(false)}
            className='fixed inset-0 z-40 bg-black/40'
          />
          <div
            className='fixed right-0 top-0 z-50 h-dvh w-[300px] sm:w-[400px] bg-background shadow-xl flex flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
            role='dialog'
            aria-modal='true'
          >
            <div className='flex-1 overflow-y-auto overscroll-contain'>
              <div className='sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b'>
                <div className='flex items-center justify-between p-4'>
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
              </div>

              {/* Drawer search — mobile only */}
              <div className='md:hidden'>
                <Suspense
                  fallback={
                    <div className='p-4 border-b'>
                      <div className='h-10 rounded-xl bg-muted/60' />
                    </div>
                  }
                >
                  <div className='p-4 border-b'>
                    {/* 👇 close drawer on any search navigation */}
                    <HeaderSearch
                      variant='drawer'
                      onNavigate={() => setIsOpen(false)}
                    />
                  </div>
                </Suspense>
              </div>

              {/* PRIMARY (mobile) */}
              <div className='md:hidden space-y-1'>
                <DrawerList
                  items={mainNavItems}
                  onChoose={() => setIsOpen(false)}
                />
                <DrawerGroup
                  label='Media'
                  childrenItems={mediaItems}
                  onChoose={() => setIsOpen(false)}
                  icon={FiVideo}
                />
                <DrawerGroup
                  label='True Parents'
                  parent={trueParentsParent}
                  childrenItems={trueParentsKids}
                  onChoose={() => setIsOpen(false)}
                  icon={FiHeart}
                />
                {leftoverExtras.length > 0 && (
                  <DrawerList
                    items={leftoverExtras}
                    onChoose={() => setIsOpen(false)}
                  />
                )}
              </div>

              {/* SECONDARY (drawer on md+) */}
              <div className='hidden md:block space-y-1'>
                {drawerExtrasAlways.length > 0 && (
                  <DrawerList
                    items={drawerExtrasAlways}
                    onChoose={() => setIsOpen(false)}
                  />
                )}
                {drawerExtrasXLHidden.length > 0 && (
                  <div className='xl:hidden'>
                    <DrawerList
                      items={drawerExtrasXLHidden}
                      onChoose={() => setIsOpen(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
