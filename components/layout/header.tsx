'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- NEW: header search state synced to ?q=
  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
  }, [searchParams])

  const runSearch = () => {
    const term = searchTerm.trim()
    const qs = term ? `?q=${encodeURIComponent(term)}` : ''
    router.push(`/news${qs}`)
    setIsOpen(false)
  }

  const mainNavItems = [
    {
      href: '/holy-mother-han',
      label: 'Holy Mother Han',
      desc: 'Learn about Holy Mother Han',
      icon: Sparkles,
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
      href: '/newsletter',
      label: 'Newsletter',
      desc: 'Stay connected weekly',
      icon: FiMail,
    },
    {
      href: '/contact',
      label: 'Contact',
      desc: 'Reach out to our team',
      icon: FiPhone,
    },
  ]

  const extraNavItems = [
    {
      href: '/global-news',
      label: 'Global News',
      desc: 'Watch weekly HQ video',
      icon: FiVideo,
    },
    {
      href: '/contact',
      label: 'Contact',
      desc: 'Reach out to our team',
      icon: FiPhone,
    },
    {
      href: '/about/history',
      label: 'Our History',
      desc: 'Roots of our movement',
      icon: FiClock,
    },
    {
      href: '/about/true-parents',
      label: 'True Parents',
      desc: 'Rev. Moon & Holy Mother Han',
      icon: FiHeart,
    },
    {
      href: '/privacy',
      label: 'Privacy Policy',
      desc: 'How we handle data',
      icon: FiShield,
    },
    {
      href: '/terms',
      label: 'Terms of Service',
      desc: 'Site use & policies',
      icon: FiFile,
    },
  ]

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
      {/* Announcement bar */}
      <div className='bg-primary text-primary-foreground py-2 px-4 text-center text-sm'>
        <p>
          Join us for our Weekly Sunday Service - Every Sunday at 10:00 AM
          Manila Time
        </p>
      </div>

      <header className='sticky top-0 z-50 w-full bg-background border-b'>
        <div className='container mx-auto flex h-16 items-center px-4'>
          {/* Left: Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='flex flex-col'>
              <Image
                src='/ffwpu-ph-logo.png'
                alt='FFWPU Philippines Logo'
                width={130}
                height={130}
                priority
              />
            </div>
          </Link>

          {/* Search Input */}
          <div className='hidden md:block ml-12'>
            <div className='relative'>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                placeholder='Search news…'
                className='rounded-full border border-slate-400 bg-white pl-10 pr-9 py-2 text-sm outline-none focus:border-slate-600'
              />
              <button
                aria-label='Search'
                onClick={runSearch}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
              >
                <SearchIcon className='h-4 w-4' />
              </button>
              {searchTerm && (
                <button
                  aria-label='Clear search'
                  onClick={() => setSearchTerm('')}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                >
                  <FiX className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>

          {/* Right: main links + search + burger */}
          <div className='ml-auto flex items-center gap-3'>
            {/* Desktop inline navigation */}
            <nav className='hidden md:flex items-center gap-6'>
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium cursor-pointer transition-none hover:bg-blue-100 rounded-full px-4 py-2',
                    isActive(item.href) ? 'font-bold' : 'text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* Burger */}
            <button
              type='button'
              aria-label='Open menu'
              onClick={() => setIsOpen(true)}
              className='h-12 w-12 inline-flex items-center justify-center transition-none hover:bg-blue-100 rounded-full cursor-pointer'
            >
              <FiMenu className='h-5 w-5' strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Drawer */}
        {isOpen && (
          <>
            {/* overlay */}
            <button
              aria-label='Close menu overlay'
              onClick={() => setIsOpen(false)}
              className='fixed inset-0 z-40 bg-black/40'
            />
            {/* panel */}
            <div
              className='fixed right-0 top-0 z-50 h-dvh w-[300px] sm:w-[400px] bg-background shadow-xl outline-none'
              role='dialog'
              aria-modal='true'
            >
              <div className='flex items-center justify-between p-4 border-b'>
                <span className='text-lg font-semibold'>Menu</span>
                <button
                  type='button'
                  aria-label='Close menu'
                  onClick={() => setIsOpen(false)}
                  className='h-10 w-10 inline-flex items-center justify-center hover:bg-blue-100 transition-none cursor-pointer rounded-full'
                >
                  <FiX className='h-6 w-6' strokeWidth={2.5} />
                </button>
              </div>

              {/* NEW: Mobile/desktop drawer search */}
              <div className='p-4 border-b'>
                <div className='relative'>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                    placeholder='Search news…'
                    className='w-full rounded-xl border bg-white pl-10 pr-9 py-2.5 text-sm outline-none focus:border-slate-300'
                  />
                  <button
                    aria-label='Search'
                    onClick={runSearch}
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
                  >
                    <SearchIcon className='h-4 w-4' />
                  </button>
                  {searchTerm && (
                    <button
                      aria-label='Clear search'
                      onClick={() => setSearchTerm('')}
                      className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                    >
                      <FiX className='h-4 w-4' />
                    </button>
                  )}
                </div>
              </div>

              {/* lists */}
              <div className='md:hidden'>
                <DrawerList items={[...mainNavItems, ...extraNavItems]} />
              </div>
              <div className='hidden md:block'>
                <DrawerList items={extraNavItems as any} />
              </div>
            </div>
          </>
        )}
      </header>
    </>
  )
}
