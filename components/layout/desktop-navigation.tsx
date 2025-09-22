'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FiChevronDown, FiHome, FiFileText, FiPhone } from 'react-icons/fi'
import { AuthDropdown } from './auth-dropdown'
import type { MainNavItem } from './header'
import { DropdownMenuItem } from './dropdown-menu-item'

interface DesktopNavigationProps {
  mainNavItems: MainNavItem[]
  isActive: (href: string) => boolean
}

export function DesktopNavigation({ mainNavItems, isActive }: DesktopNavigationProps) {
  return (
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

      {/* Main Navigation Items (About, Media) */}
      {mainNavItems
        .filter(
          (item) =>
            item.label !== 'Contact' &&
            item.label !== 'News' &&
            item.label !== 'Home',
        )
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
              {/* Dropdown menu */}
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

      {/* Auth Dropdown - Modern pill button */}
      <div className="hidden lg:flex ml-2">
        <AuthDropdown variant="desktop" />
      </div>
    </nav>
  )
}