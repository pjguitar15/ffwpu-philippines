'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
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
  FiChevronDown,
  FiUsers,
  FiStar,
  FiMail,
  FiUser,
} from 'react-icons/fi'
import {
  FaChurch,
  FaUsers,
  FaStar,
  FaPrayingHands,
  FaCalendarAlt,
  FaLaptop,
  FaRocket,
  FaHeart,
} from 'react-icons/fa'
//
import { HeaderSearch } from './header-search'
import { LiveIndicator } from '@/components/ui/live-indicator'

const IN_TOP_NAV_ON_XL = new Set<string>([
  '/about/true-parents',
  '/hj-testimonies',
])

type DropdownNavItem = {
  label: string
  href: string
  icon?: any
}

type MainNavItem = {
  href: string
  label: string
  desc: string
  icon: any
  dropdown?: DropdownNavItem[]
}

export const mainNavItems: MainNavItem[] = [
  {
    href: '/',
    label: 'Home',
    desc: 'Welcome & featured highlights',
    icon: FiFileText,
  },
  // About dropdown nav
  {
    href: '/about',
    label: 'About',
    desc: 'Who we are & our mission',
    icon: FiInfo,
    dropdown: [
      {
        label: 'FFWPU Philippines',
        href: '/about',
        icon: FiInfo,
      },
      // {
      //   label: 'Blessed Family Department',
      //   href: '/about/bfd/blessed-family-department',
      //   icon: FiUsers,
      // },
      // {
      //   label: 'Cosmic Blessing',
      //   href: '/about/bfd/cosmic-blessing',
      //   icon: FiStar,
      // },
      // {
      //   label: 'Cheon Shim Won',
      //   href: '/about/cheon-shim-won/what-is-csw',
      //   icon: FiHeart,
      // },
      // {
      //   label: 'CSW Schedules',
      //   href: '/about/cheon-shim-won/schedules',
      //   icon: FiClock,
      // },
      // {
      //   label: 'How to Join CSW Online',
      //   href: '/about/cheon-shim-won/how-to-join-online',
      //   icon: FiInfo,
      // },
      // {
      //   label: 'Heavenly Top Gun',
      //   href: '/about/htg/about-heavenly-top-gun',
      //   icon: FiInfo,
      // },
      {
        label: 'True Parents',
        href: '/about/true-parents',
        icon: FiUsers,
      },
    ],
  },
  {
    href: '/media',
    label: 'Media',
    desc: 'Videos & testimonies',
    icon: FiVideo,
    dropdown: [
      {
        label: 'HJ MediaWorks',
        href: '/hj-media-works',
        icon: FiVideo,
      },
      {
        label: 'HJ Testimonies',
        href: '/hj-testimonies',
        icon: FiBookOpen,
      },
    ],
  },
  {
    href: '/news',
    label: 'News',
    desc: 'Latest updates & reports',
    icon: FiFileText,
  },
  {
    href: '/messages',
    label: 'Messages',
    desc: 'Important communications',
    icon: FiMail,
    dropdown: [
      {
        label: 'Regional Director',
        href: '/messages/regional-director',
        icon: FiUser,
      },
    ],
  },
]

export const extraNavItems = [
  {
    href: '/about/history',
    label: 'Our History',
    desc: 'Roots of our movement',
    icon: FiClock,
  },
] as const

const leftoverExtras = extraNavItems.filter(
  (i) => !['/hj-media-works', '/hj-testimonies'].includes(i.href),
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
        const Icon = item.icon ? item.icon : FiInfo
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
          groupActive && 'ring-blue-100',
        )}
      >
        <Link
          href={parent?.href || '#'}
          onClick={onChoose}
          className={cn(
            'flex-1 flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-gray-100',
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
          className='px-4 py-4 cursor-pointer hover:bg-gray-100 border-l'
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
  const isHome = pathname === '/'

  // FIX: make header fixed and measured, overlay/drawer use full viewport (under header by z-index)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerH, setHeaderH] = useState(0)
  useEffect(() => {
    const measure = () =>
      setHeaderH(headerRef.current?.getBoundingClientRect().height ?? 0)
    measure()
    const ro = new ResizeObserver(measure)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

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
      {/* FIXED header above everything */}
      <div ref={headerRef} className='fixed inset-x-0 top-0 z-[900]'>
        {isHome && (
          <div className='bg-gradient-to-r from-blue-800 via-cyan-800 to-sky-800 text-white py-2 px-4 text-center text-sm shadow-sm'>
            <p className='block lg:hidden font-medium tracking-wide'>
              ✨ Sunday Service • 10:00 AM (Manila)
            </p>
            <p className='hidden lg:block font-medium tracking-wide'>
              ✨ Join us for our{' '}
              <span className='font-semibold'>Weekly Sunday Service</span> •
              Every Sunday at 10:00 AM (Manila)
            </p>
          </div>
        )}
        <header className='relative z-[900] w-full bg-background border-b'>
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
              <LiveIndicator className='hidden md:inline-flex shrink-0' />

              <Suspense
                fallback={
                  <div className='hidden lg:block h-9 w-[clamp(12rem,28vw,22rem)] rounded-full bg-muted/60' />
                }
              >
                <div className='hidden lg:block min-w-[12rem] ms-3'>
                  <HeaderSearch variant='desktop' className='h-9 w-full' />
                </div>
              </Suspense>
            </div>

            <div className='ml-auto flex items-center gap-2 sm:gap-3 min-w-0'>
              <nav className='hidden md:flex items-center gap-2'>
                {mainNavItems.map((item) =>
                  item.dropdown ? (
                    <div className='relative group' key={item.href}>
                      <button
                        className={cn(
                          'text-sm font-medium rounded-full px-3 py-2 flex items-center gap-2 text-slate-700 transition-all duration-150 cursor-pointer',
                          'hover:-translate-y-0.5 hover:text-slate-800',
                          isActive(item.href) ? 'font-bold text-slate-900' : '',
                        )}
                        type='button'
                        aria-haspopup='menu'
                        aria-expanded='false'
                        tabIndex={0}
                      >
                        {item.label}
                        <FiChevronDown className='ml-1 h-3 w-3' />
                      </button>
                      {/* Dropdown menu, visible instantly on hover */}
                      <div className='absolute left-0 top-full z-50 min-w-[240px] bg-white shadow-2xl py-2 px-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 flex flex-col gap-0'>
                        {item.dropdown.map((sub) => {
                          const active = isActive(sub.href)
                          const Icon = sub.icon ? sub.icon : FiInfo
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150',
                                active
                                  ? 'bg-gray-100 text-slate-900 font-bold'
                                  : 'text-slate-700 hover:bg-gray-100',
                              )}
                            >
                              <Icon className='h-5 w-5 text-blue-400 shrink-0' />
                              <span className='flex-1'>{sub.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-sm font-medium rounded-full px-3 py-2 flex items-center gap-2 text-slate-700 transition-all duration-150',
                        'hover:-translate-y-0.5 hover:text-slate-800',
                        isActive(item.href) ? 'font-bold text-slate-900' : '',
                      )}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <div className='hidden xl:flex items-center gap-2'>
                  {desktopExtrasXL.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-sm font-medium rounded-full p-3 flex items-center gap-2 text-slate-700 transition-all duration-150',
                        'hover:-translate-y-0.5 hover:text-slate-800',
                        isActive(item.href) ? 'font-bold text-slate-900' : '',
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
                className='h-12 w-12 inline-flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer shrink-0'
              >
                <FiMenu className='h-5 w-5' strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer so content starts below the fixed header (prevents layout jump) */}
      <div aria-hidden style={{ height: headerH }} />

      {isOpen && (
        <>
          {/* Overlay UNDER header, full screen */}
          <button
            aria-label='Close menu overlay'
            onClick={() => setIsOpen(false)}
            className='fixed inset-0 z-[800] bg-black/40'
          />

          {/* Drawer ABOVE header */}
          <div
            className='fixed top-0 right-0 bottom-0 z-[1000] w-full sm:w-[400px] bg-background shadow-xl flex flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
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
                    className='h-10 w-10 inline-flex items-center justify-center hover:bg-gray-100 rounded-full'
                  >
                    <FiX className='h-6 w-6' strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Drawer search — md and below */}
              <div className='md:block lg:hidden'>
                <Suspense
                  fallback={
                    <div className='p-4 border-b'>
                      <div className='h-10 rounded-xl bg-muted/60' />
                    </div>
                  }
                >
                  <div className='p-4 border-b'>
                    <HeaderSearch
                      variant='drawer'
                      onNavigate={() => setIsOpen(false)}
                    />
                  </div>
                </Suspense>
              </div>

              {/* PRIMARY (mobile) */}
              <div className='md:hidden space-y-1 pt-3'>
                {/* Home link */}
                <DrawerList
                  items={mainNavItems.filter((item) => item.label === 'Home')}
                  onChoose={() => setIsOpen(false)}
                />
                {/* About dropdown */}
                <DrawerGroup
                  label='About'
                  parent={mainNavItems.find((item) => item.label === 'About')}
                  childrenItems={(
                    mainNavItems.find((item) => item.label === 'About')
                      ?.dropdown || []
                  ).map((sub) => ({
                    ...sub,
                    desc: '',
                    icon: sub.icon || FiInfo,
                  }))}
                  onChoose={() => setIsOpen(false)}
                  icon={FiInfo}
                />
                {/* News link */}
                <DrawerList
                  items={mainNavItems.filter((item) => item.label === 'News')}
                  onChoose={() => setIsOpen(false)}
                />
                {/* Messages dropdown */}
                <DrawerGroup
                  label='Messages'
                  parent={mainNavItems.find(
                    (item) => item.label === 'Messages',
                  )}
                  childrenItems={(
                    mainNavItems.find((item) => item.label === 'Messages')
                      ?.dropdown || []
                  ).map((sub) => ({
                    ...sub,
                    desc: '',
                    icon: sub.icon || FiInfo,
                  }))}
                  onChoose={() => setIsOpen(false)}
                  icon={FiUsers}
                />
                {/* Contact link only in burger menu */}
                <DrawerList
                  items={[
                    {
                      href: '/contact',
                      label: 'Contact',
                      desc: 'Reach out to our team',
                      icon: FiPhone,
                    },
                  ]}
                  onChoose={() => setIsOpen(false)}
                />
                {/* Media dropdown */}
                <DrawerGroup
                  label='Media'
                  parent={mainNavItems.find((item) => item.label === 'Media')}
                  childrenItems={(
                    mainNavItems.find((item) => item.label === 'Media')
                      ?.dropdown || []
                  ).map((sub) => ({
                    ...sub,
                    desc: '',
                    icon: sub.icon || FiVideo,
                  }))}
                  onChoose={() => setIsOpen(false)}
                  icon={FiVideo}
                />
                {leftoverExtras.length > 0 && (
                  <DrawerList
                    items={leftoverExtras}
                    onChoose={() => setIsOpen(false)}
                  />
                )}
              </div>

              {/* SECONDARY (drawer on md+) */}
              <div className='hidden md:block space-y-1 pt-3'>
                {/* Contact link in large screen drawer */}
                <DrawerList
                  items={[
                    {
                      href: '/contact',
                      label: 'Contact',
                      desc: 'Reach out to our team',
                      icon: FiPhone,
                    },
                  ]}
                  onChoose={() => setIsOpen(false)}
                />
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
