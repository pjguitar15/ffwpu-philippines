'use client'

import { useEffect, useState } from 'react'
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

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const mainNavItems = [
    { href: '/about', label: 'About' },
    { href: '/news', label: 'News' },
    { href: '/articles', label: 'Articles' },
    { href: '/newsletter', label: 'Newsletter' },
  ]

  const mobileNavItems = [
    // main
    { href: "/about", label: "About", desc: "Who we are & our mission", icon: FiInfo },
    { href: "/news", label: "News", desc: "Latest updates & reports", icon: FiFileText },
    { href: "/articles", label: "Articles", desc: "Providence reads & insights", icon: FiBookOpen },
    { href: "/newsletter", label: "Newsletter", desc: "Stay connected weekly", icon: FiMail },
    // mobile-only extras
    { href: "/global-news", label: "Global News", desc: "Watch weekly HQ video", icon: FiVideo },
    { href: "/contact", label: "Contact", desc: "Reach out to our team", icon: FiPhone },
    { href: "/about/history", label: "Our History", desc: "Roots of our movement", icon: FiClock },
    { href: "/about/true-parents", label: "True Parents", desc: "Rev. Moon & Holy Mother Han", icon: FiHeart },
    { href: "/privacy", label: "Privacy Policy", desc: "How we handle data", icon: FiShield },
    { href: "/terms", label: "Terms of Service", desc: "Site use & policies", icon: FiFile },
  ]

  const isActive = (href: string) => pathname === href

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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

          {/* Right: main links (left) + burger (right) */}
          <div className='ml-auto flex items-center gap-2'>
            <nav className='hidden md:flex items-center gap-6'>
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium cursor-pointer transition-none',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground px-4 py-2 rounded-full uppercase font-bold'
                      : 'text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Burger button using react-icons */}
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

        {/* Mobile drawer */}
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
              {/* header */}
              <div className='flex items-center justify-between p-4 border-b'>
                <span className='text-lg font-semibold'>Menu</span>
                <button
                  type='button'
                  aria-label='Close menu'
                  onClick={() => setIsOpen(false)}
                  className='h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-accent transition-none'
                >
                  <FiX className='h-6 w-6' strokeWidth={2.5} />
                </button>
              </div>

              {/* nav */}
              <nav className='p-5 mt-2 space-y-1'>
                {[
                  // main
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
                    href: '/articles',
                    label: 'Articles',
                    desc: 'Providence reads & insights',
                    icon: FiBookOpen,
                  },
                  {
                    href: '/newsletter',
                    label: 'Newsletter',
                    desc: 'Stay connected weekly',
                    icon: FiMail,
                  },
                  // mobile-only extras
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
                ].map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
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
                        <div className='mt-1 text-xs text-foreground/70'>
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </>
        )}
      </header>
    </>
  )
}
