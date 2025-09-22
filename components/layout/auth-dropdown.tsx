'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FiUser, FiLogIn, FiUserPlus, FiChevronDown } from 'react-icons/fi'

interface AuthDropdownProps {
  variant?: 'desktop' | 'mobile' | 'medium'
  onNavigate?: () => void
}

export function AuthDropdown({ variant = 'desktop', onNavigate }: AuthDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleOptionClick = () => {
    setIsOpen(false)
    onNavigate?.()
  }

  // Mobile version (integrated into drawer)
  if (variant === 'mobile') {
    return (
      <div className="w-full">
        <div
          className={cn(
            'flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-100 transition-all duration-150',
            isOpen && 'bg-blue-50',
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex items-center gap-3'>
            <FiUser className='h-5 w-5 text-gray-600 shrink-0' />
            <span className='text-sm font-semibold'>Account</span>
          </div>
          <FiChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </div>
        {isOpen && (
          <div className='bg-gray-50'>
            <Link
              href="/login"
              onClick={handleOptionClick}
              className="flex items-center gap-3 px-6 py-3 pl-14 hover:bg-gray-100 transition-all duration-150 cursor-pointer"
            >
              <FiLogIn className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold">Sign In</span>
            </Link>
            <Link
              href="/register"
              onClick={handleOptionClick}
              className="flex items-center gap-3 px-6 py-3 pl-14 hover:bg-gray-100 transition-all duration-150 cursor-pointer"
            >
              <FiUserPlus className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold">Create Account</span>
            </Link>
          </div>
        )}
      </div>
    )
  }

  // Medium screen dropdown version
  if (variant === 'medium') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'h-10 w-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shrink-0 transition-all duration-150',
            'hover:-translate-y-0.5',
            isOpen && 'bg-blue-700'
          )}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <FiUser className="h-4 w-4" strokeWidth={2.5} />
        </button>

        {isOpen && (
          <div className={cn(
            'absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50',
            'animate-in slide-in-from-top-2 fade-in-0 duration-200'
          )}>
            <Link
              href="/login"
              onClick={handleOptionClick}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                'border-b border-gray-100'
              )}
            >
              <FiLogIn className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium">Sign In</div>
              </div>
            </Link>

            <Link
              href="/register"
              onClick={handleOptionClick}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            >
              <FiUserPlus className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">Create Account</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    )
  }

  // Desktop version (default)
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
          'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm',
          'hover:from-blue-700 hover:to-blue-800 hover:shadow-md hover:-translate-y-0.5',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isOpen && 'from-blue-700 to-blue-800 shadow-md'
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <FiUser className="h-4 w-4" />
        <span>Account</span>
        <FiChevronDown 
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          'absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50',
          'animate-in slide-in-from-top-2 fade-in-0 duration-200'
        )}>
          {/* Login Option */}
          <Link
            href="/login"
            onClick={handleOptionClick}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
              'border-b border-gray-100'
            )}
          >
            <FiLogIn className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-medium">Sign In</div>
              <div className="text-xs text-gray-500">Access your account</div>
            </div>
          </Link>

          {/* Sign Up Option */}
          <Link
            href="/register"
            onClick={handleOptionClick}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
          >
            <FiUserPlus className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium">Create Account</div>
              <div className="text-xs text-gray-500">Join our community</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}