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
  FiHome,
} from 'react-icons/fi'
import { HeaderSearch } from './header-search'
import { LiveIndicator } from '@/components/ui/live-indicator'

function DrawerMenuItem({
  item,
  onChoose,
  depth = 0,
}: {
  item: DropdownNavItem | MainNavItem
  onChoose: () => void
  depth?: number
}) {
  const pathname = usePathname()
  const active = pathname === item.href
  const Icon = item.icon ? item.icon : FiInfo
  const [open, setOpen] = useState(false)

  if (item.dropdown && item.dropdown.length > 0) {
    return (
      <div className='w-full'>
        <div
          className={cn(
            'flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-100 transition-all duration-150',
            depth > 0 && 'pl-10',
            active && 'bg-blue-100',
          )}
          onClick={() => setOpen(!open)}
        >
          <div className='flex items-center gap-3'>
            <Icon className='h-5 w-5 text-gray-600 shrink-0' />
            <span className='text-sm font-semibold'>{item.label}</span>
          </div>
          <FiChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </div>
        {open && (
          <div className='bg-gray-50'>
            {item.dropdown.map((sub: DropdownNavItem) => (
              <DrawerMenuItem
                key={sub.href}
                item={sub}
                onChoose={onChoose}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Regular link item
  return (
    <Link
      href={item.href}
      onClick={onChoose}
      className={cn(
        'flex items-center gap-3 px-6 py-4 hover:bg-gray-100 transition-all duration-150',
        depth > 0 && 'pl-10 bg-gray-50',
        active && 'bg-blue-100 font-bold',
      )}
    >
      <Icon className='h-5 w-5 text-gray-600 shrink-0' />
      <span className='text-sm font-semibold'>{item.label}</span>
    </Link>
  )
}

// --- DropdownMenuItem component for nested dropdowns ---
function DropdownMenuItem({
  item,
  parentIsDropdown = false,
}: {
  item: DropdownNavItem | MainNavItem
  parentIsDropdown?: boolean
}) {
  const pathname = usePathname()
  const active = pathname === item.href
  const Icon = item.icon ? item.icon : FiInfo
  const [open, setOpen] = useState(false)
  const itemRef = useRef(null)

  // Show submenu on hover or focus
  const showSubmenu = () => setOpen(true)
  const hideSubmenu = () => setOpen(false)

  if (item.dropdown && item.dropdown.length > 0) {
    return (
      <div
        className={cn('relative group', parentIsDropdown ? 'w-full' : '')}
        onMouseEnter={showSubmenu}
        onMouseLeave={hideSubmenu}
        onFocus={showSubmenu}
        onBlur={hideSubmenu}
        ref={itemRef}
      >
        <button
          className={cn(
            'flex items-center gap-3 px-6 py-4 text-sm transition-all duration-150 font-semibold w-full cursor-pointer',
            active
              ? 'bg-gray-100 text-slate-900 font-bold'
              : 'text-slate-700 hover:bg-gray-100',
            'justify-between',
          )}
          type='button'
          aria-haspopup='menu'
          aria-expanded={open}
          tabIndex={0}
        >
          <span className='flex items-center gap-3'>
            <Icon className='h-5 w-5 text-gray-600 shrink-0' />
            <span className='flex-1'>{item.label}</span>
          </span>
          {/* Right arrow for nested dropdown */}
          <FiChevronDown
            className={cn(
              'ml-2 h-3 w-3 transition-transform',
              open && 'rotate-180',
              'transform',
              parentIsDropdown && 'rotate-[-90deg]',
            )}
          />
        </button>
        {/* Nested dropdown menu */}
        <div
          className={cn(
            'absolute z-50 min-w-[220px] bg-white shadow-2xl opacity-0 pointer-events-none transition-all duration-200 flex flex-col',
            open && 'opacity-100 pointer-events-auto',
            parentIsDropdown ? 'right-full top-0 mr-0' : 'left-0 top-full',
          )}
        >
          {item.dropdown.map((sub: DropdownNavItem) => (
            <DropdownMenuItem
              key={sub.href}
              item={sub}
              parentIsDropdown={true}
            />
          ))}
        </div>
      </div>
    )
  }
  // Otherwise, render a normal link
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-5 py-4 text-sm transition-all duration-150 font-semibold',
        active
          ? 'bg-gray-100 text-slate-900 font-bold'
          : 'text-slate-700 hover:bg-gray-100',
        'w-full cursor-pointer',
        // Ensure submenu items don't inherit parent hover states
        parentIsDropdown && 'bg-white hover:bg-gray-100',
      )}
    >
      <Icon className='h-5 w-5 text-gray-600 shrink-0' />
      <span className='flex-1'>{item.label}</span>
    </Link>
  )
}

export type DropdownNavItem = {
  label: string
  href: string
  icon?: any
  dropdown?: DropdownNavItem[]
}

export type MainNavItem = {
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
      {
        label: 'True Parents',
        href: '/about/true-parents',
        icon: FiUsers,
      },
      {
        label: 'Messages',
        href: '/messages/regional-director',
        icon: FiMail,
        dropdown: [
          {
            label: 'Regional Director',
            href: '/messages/regional-director',
            icon: FiUser,
          },
        ],
      },
    ],
  },
  {
    href: '/hj-media-works',
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
      {
        label: 'Letter to True Mother',
        href: '/letter-to-true-mother',
        icon: FiHeart,
      },
    ],
  },
  {
    href: '/about/history',
    label: 'History',
    desc: 'Our journey & milestones',
    icon: FiClock,
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
    desc: 'Get in touch with us',
    icon: FiPhone,
  },
  // Messages now nested under About
]

// Removed extraNavItems and related logic
type NavItem = (typeof mainNavItems)[number]

function DrawerList({
  items,
  onChoose,
}: {
  items: readonly (NavItem | DropdownNavItem)[]
  onChoose: () => void
}) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href
  return (
    <nav className='px-5 space-y-1'>
      {items.map((item) => {
        // If item has dropdown, use DrawerMenuItem for nested handling
        if (item.dropdown && item.dropdown.length > 0) {
          return (
            <div
              key={item.href}
              className='rounded-xl overflow-hidden bg-white border border-gray-200'
            >
              <DrawerMenuItem item={item} onChoose={onChoose} />
            </div>
          )
        }

        // Regular item rendering
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
                  'text-sm font-semibold leading-none',
                  active && 'text-foreground',
                )}
              >
                {item.label}
              </div>
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
            <div className='text-sm font-semibold leading-none'>{label}</div>
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
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href
  const isHome = pathname === '/'

  // Track scroll position to hide/show banner
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll() // Check initial position
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        {isHome && !isScrolled && (
          <div className='bg-gradient-to-r from-rose-300 via-pink-300 to-rose-400 text-gray-800 py-2 px-4 text-center text-sm shadow-sm transition-all duration-300'>
            <Link
              href='/letter-to-true-mother'
              className='block hover:text-white transition-all duration-200 cursor-pointer rounded-sm px-2 py-1 -mx-2 -my-1'
            >
              <p className='block lg:hidden font-medium tracking-wide'>
                💌 Send Your Letter to True Mother →
              </p>
              <p className='hidden lg:block font-medium tracking-wide'>
                💌{' '}
                <span className='underline decoration-2 underline-offset-2'>
                  Share your love with{' '}
                  <span className='font-semibold'>True Mother</span>
                </span>{' '}
                • Send heartfelt messages of comfort and encouragement →
              </p>
            </Link>
          </div>
        )}
        <header className='relative z-[900] w-full bg-background border-b'>
          <div className='mx-auto flex h-16 items-center px-4 md:px-12 gap-3 min-w-0'>
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
                {/* Home link - full text on lg+ screens */}
                <Link
                  href='/'
                  className={cn(
                    'hidden lg:flex text-sm font-medium rounded-full px-3 py-2 items-center gap-2 text-slate-700 transition-all duration-150',
                    'hover:-translate-y-0.5 hover:text-slate-800',
                    isActive('/') ? 'font-bold text-slate-900' : '',
                  )}
                >
                  Home
                </Link>

                {mainNavItems
                  .filter(
                    (item) =>
                      item.label !== 'Contact' &&
                      item.label !== 'News' &&
                      item.label !== 'Home',
                  ) // Exclude Contact, News, and Home from main nav
                  .map((item) =>
                    item.dropdown ? (
                      <div className='relative group' key={item.href}>
                        <button
                          className={cn(
                            'text-sm font-medium rounded-full px-3 py-2 flex items-center gap-2 text-slate-700 transition-all duration-150 cursor-pointer',
                            'hover:-translate-y-0.5 hover:text-slate-800',
                            isActive(item.href)
                              ? 'font-bold text-slate-900'
                              : '',
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
                        <div className='absolute left-0 top-full z-50 min-w-[240px] bg-white shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 flex flex-col gap-0'>
                          {item.dropdown.map((sub) => (
                            <DropdownMenuItem
                              key={sub.href}
                              item={sub}
                              parentIsDropdown
                            />
                          ))}
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

                {/* News link - full text on lg+ screens */}
                <Link
                  href='/news'
                  className={cn(
                    'hidden lg:flex text-sm font-medium rounded-full px-3 py-2 items-center gap-2 text-slate-700 transition-all duration-150',
                    'hover:-translate-y-0.5 hover:text-slate-800',
                    isActive('/news') ? 'font-bold text-slate-900' : '',
                  )}
                >
                  News
                </Link>

                {/* Contact link - full text on lg+ screens */}
                <Link
                  href='/contact'
                  className={cn(
                    'hidden lg:flex text-sm font-medium rounded-full px-3 py-2 items-center gap-2 text-slate-700 transition-all duration-150',
                    'hover:-translate-y-0.5 hover:text-slate-800',
                    isActive('/contact') ? 'font-bold text-slate-900' : '',
                  )}
                >
                  Contact
                </Link>
              </nav>

              {/* Home icon button - ONLY on md screens */}
              <Link
                href='/'
                aria-label='Home'
                className={cn(
                  'hidden md:flex lg:hidden h-10 w-10 items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer shrink-0 transition-all duration-150',
                  'hover:-translate-y-0.5',
                  isActive('/')
                    ? 'bg-gray-200 text-slate-900'
                    : 'text-slate-700',
                )}
              >
                <FiHome className='h-4 w-4' strokeWidth={2.5} />
              </Link>

              {/* News icon button - ONLY on md screens */}
              <Link
                href='/news'
                aria-label='News'
                className={cn(
                  'hidden md:flex lg:hidden h-10 w-10 items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer shrink-0 transition-all duration-150',
                  'hover:-translate-y-0.5',
                  isActive('/news')
                    ? 'bg-gray-200 text-slate-900'
                    : 'text-slate-700',
                )}
              >
                <FiFileText className='h-4 w-4' strokeWidth={2.5} />
              </Link>

              {/* Contact icon button - ONLY on md screens */}
              <Link
                href='/contact'
                aria-label='Contact us'
                className={cn(
                  'hidden md:flex lg:hidden h-10 w-10 items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer shrink-0 transition-all duration-150',
                  'hover:-translate-y-0.5',
                  isActive('/contact')
                    ? 'bg-gray-200 text-slate-900'
                    : 'text-slate-700',
                )}
              >
                <FiPhone className='h-4 w-4' strokeWidth={2.5} />
              </Link>

              <button
                type='button'
                aria-label='Open menu'
                onClick={() => setIsOpen(true)}
                className='md:hidden h-12 w-12 inline-flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer shrink-0'
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
                {/* All main navigation items with their nested dropdowns */}
                <DrawerList
                  items={mainNavItems}
                  onChoose={() => setIsOpen(false)}
                />
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
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
