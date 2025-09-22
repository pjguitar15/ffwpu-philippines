'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FiHome, FiFileText, FiPhone } from 'react-icons/fi'
import { AuthDropdown } from './auth-dropdown'

interface IconButtonsProps {
  isActive: (href: string) => boolean
}

export function IconButtons({ isActive }: IconButtonsProps) {
  return (
    <>
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

      {/* Auth dropdown for medium screens */}
      <div className="hidden md:flex lg:hidden">
        <AuthDropdown variant="medium" />
      </div>
    </>
  )
}