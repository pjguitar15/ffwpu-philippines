'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FiInfo, FiChevronDown } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import type { DropdownNavItem, MainNavItem } from './header'

interface DropdownMenuItemProps {
  item: DropdownNavItem | MainNavItem
  parentIsDropdown?: boolean
}

export function DropdownMenuItem({
  item,
  parentIsDropdown = false,
}: DropdownMenuItemProps) {
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