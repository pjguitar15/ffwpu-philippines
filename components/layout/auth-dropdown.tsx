'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiChevronDown,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi'

interface AuthDropdownProps {
  variant?: 'desktop' | 'mobile' | 'medium'
  onNavigate?: () => void
}

interface UserData {
  id: string
  email: string
  member?: {
    fullName: string
    givenName: string
    familyName: string
  }
}

export function AuthDropdown({
  variant = 'desktop',
  onNavigate,
}: AuthDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Check login status by calling the member API
  const checkLoginStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/member/me', {
        cache: 'no-store',
      })

      if (response.ok) {
        const result = await response.json()
        setUserData({
          id: result.user.id,
          email: result.user.email,
          member: {
            fullName: result.member.fullName,
            givenName: result.member.givenName,
            familyName: result.member.familyName,
          },
        })
      } else {
        setUserData(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUserData(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial check and refresh when trigger changes
  useEffect(() => {
    checkLoginStatus()
  }, [refreshTrigger])

  // Listen for login/logout events and route changes
  useEffect(() => {
    const handleAuthChange = () => {
      setRefreshTrigger((prev) => prev + 1)
    }

    // Listen for custom auth events
    window.addEventListener('auth-login', handleAuthChange)
    window.addEventListener('auth-logout', handleAuthChange)

    // Also refresh when route changes (user might login/logout on different pages)
    const handleRouteChange = () => {
      setTimeout(() => {
        setRefreshTrigger((prev) => prev + 1)
      }, 100) // Small delay to ensure cookies are updated
    }

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('auth-login', handleAuthChange)
      window.removeEventListener('auth-logout', handleAuthChange)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // Refresh auth state when component becomes visible (focus events)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setRefreshTrigger((prev) => prev + 1)
      }
    }

    const handleFocus = () => {
      setRefreshTrigger((prev) => prev + 1)
    }

    // Listen for storage changes (if JWT is stored in localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-token' || e.key === null) {
        setRefreshTrigger((prev) => prev + 1)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Expose refresh function globally (for debugging or manual refresh)
  useEffect(() => {
    ;(window as any).refreshAuth = () => {
      setRefreshTrigger((prev) => prev + 1)
    }

    return () => {
      delete (window as any).refreshAuth
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      <div className='w-full'>
        <div
          className={cn(
            'flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-100 transition-all duration-150',
            isOpen && 'bg-blue-50',
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex items-center gap-3'>
            <FiUser className='h-5 w-5 text-gray-600 shrink-0' />
            <span className='text-sm font-semibold'>
              {userData ? userData.member?.givenName || 'Member' : 'Account'}
            </span>
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
            {userData ? (
              <>
                {/* User Info Header - Mobile */}
                <div className='px-6 py-3 pl-14 bg-gray-100 border-b border-gray-200'>
                  <div className='text-sm font-medium text-gray-900'>
                    {userData.member?.fullName ||
                      `${userData.member?.givenName || ''} ${
                        userData.member?.familyName || ''
                      }`.trim() ||
                      'Member'}
                  </div>
                  <div className='text-xs text-gray-500 truncate'>
                    {userData.email}
                  </div>
                </div>

                <Link
                  href='/profile'
                  onClick={handleOptionClick}
                  className='flex items-center gap-3 px-6 py-3 pl-14 hover:bg-gray-100 transition-all duration-150 cursor-pointer'
                >
                  <FiUser className='h-4 w-4 text-blue-600' />
                  <span className='text-sm font-semibold'>My Profile</span>
                </Link>
                <Link
                  href='/settings'
                  onClick={handleOptionClick}
                  className='flex items-center gap-3 px-6 py-3 pl-14 hover:bg-gray-100 transition-all duration-150 cursor-pointer'
                >
                  <FiSettings className='h-4 w-4 text-gray-600' />
                  <span className='text-sm font-semibold'>Settings</span>
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/member/logout', { method: 'POST' })
                    } catch (error) {
                      console.error('Logout error:', error)
                    } finally {
                      setUserData(null)
                      // Dispatch logout event for other components
                      window.dispatchEvent(new CustomEvent('auth-logout'))
                      handleOptionClick()
                      router.push('/')
                    }
                  }}
                  className='flex items-center gap-3 px-6 py-3 pl-14 hover:bg-gray-100 transition-all duration-150 cursor-pointer w-full text-left'
                >
                  <FiLogOut className='h-4 w-4 text-red-600' />
                  <span className='text-sm font-semibold'>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  onClick={handleOptionClick}
                  className='flex items-center gap-3 px-6 py-3 pl-14 hover:bg-gray-100 transition-all duration-150 cursor-pointer'
                >
                  <FiLogIn className='h-4 w-4 text-blue-600' />
                  <span className='text-sm font-semibold'>Sign In</span>
                </Link>
                <Link
                  href='/register'
                  onClick={handleOptionClick}
                  className='flex items-center gap-3 px-6 py-3 pl-14 hover:bg-gray-100 transition-all duration-150 cursor-pointer'
                >
                  <FiUserPlus className='h-4 w-4 text-green-600' />
                  <span className='text-sm font-semibold'>Create Account</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // Medium screen dropdown version
  if (variant === 'medium') {
    return (
      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'h-10 w-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shrink-0 transition-all duration-150',
            'hover:-translate-y-0.5',
            isOpen && 'bg-blue-700',
            isLoading && 'opacity-50 cursor-not-allowed',
          )}
          aria-haspopup='menu'
          aria-expanded={isOpen}
          disabled={isLoading}
        >
          <FiUser className='h-4 w-4' strokeWidth={2.5} />
        </button>

        {isOpen && (
          <div
            className={cn(
              'absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50',
              'animate-in slide-in-from-top-2 fade-in-0 duration-200',
            )}
          >
            {userData ? (
              <>
                {/* User Info Header - Medium */}
                <div className='px-4 py-3 border-b border-gray-100 bg-gray-50'>
                  <div className='text-sm font-medium text-gray-900 truncate'>
                    {userData.member?.givenName || 'Member'}
                  </div>
                  <div className='text-xs text-gray-500 truncate'>
                    {userData.email}
                  </div>
                </div>

                <Link
                  href='/profile'
                  onClick={handleOptionClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                  )}
                >
                  <FiUser className='h-4 w-4 text-blue-600' />
                  <div>
                    <div className='font-medium'>My Profile</div>
                  </div>
                </Link>

                <Link
                  href='/settings'
                  onClick={handleOptionClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                    'border-b border-gray-100',
                  )}
                >
                  <FiSettings className='h-4 w-4 text-gray-600' />
                  <div>
                    <div className='font-medium'>Settings</div>
                  </div>
                </Link>

                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/member/logout', { method: 'POST' })
                    } catch (error) {
                      console.error('Logout error:', error)
                    } finally {
                      setUserData(null)
                      // Dispatch logout event for other components
                      window.dispatchEvent(new CustomEvent('auth-logout'))
                      handleOptionClick()
                      router.push('/')
                    }
                  }}
                  className='flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer w-full text-left'
                >
                  <FiLogOut className='h-4 w-4 text-red-600' />
                  <div>
                    <div className='font-medium'>Sign Out</div>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  onClick={handleOptionClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                    'border-b border-gray-100',
                  )}
                >
                  <FiLogIn className='h-4 w-4 text-blue-600' />
                  <div>
                    <div className='font-medium'>Sign In</div>
                  </div>
                </Link>

                <Link
                  href='/register'
                  onClick={handleOptionClick}
                  className='flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer'
                >
                  <FiUserPlus className='h-4 w-4 text-green-600' />
                  <div>
                    <div className='font-medium'>Create Account</div>
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // Desktop version (default)
  return (
    <div className='relative' ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
          'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm',
          'hover:from-blue-700 hover:to-blue-800 hover:shadow-md hover:-translate-y-0.5',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isOpen && 'from-blue-700 to-blue-800 shadow-md',
          isLoading && 'opacity-50 cursor-not-allowed',
        )}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        disabled={isLoading}
      >
        <FiUser className='h-4 w-4' />
        <span>
          {userData ? userData.member?.givenName || 'Member' : 'Account'}
        </span>
        <FiChevronDown
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50',
            'animate-in slide-in-from-top-2 fade-in-0 duration-200',
          )}
        >
          {userData ? (
            <>
              {/* User Info Header */}
              <div className='px-4 py-3 border-b border-gray-100 bg-gray-50'>
                <div className='text-sm font-medium text-gray-900'>
                  {userData.member?.fullName ||
                    `${userData.member?.givenName || ''} ${
                      userData.member?.familyName || ''
                    }`.trim() ||
                    'Member'}
                </div>
                <div className='text-xs text-gray-500 truncate'>
                  {userData.email}
                </div>
              </div>

              {/* Profile Option */}
              <Link
                href='/profile'
                onClick={handleOptionClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                )}
              >
                <FiUser className='h-4 w-4 text-blue-600' />
                <div>
                  <div className='font-medium'>My Profile</div>
                  <div className='text-xs text-gray-500'>View your details</div>
                </div>
              </Link>

              {/* Logout Option */}
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/auth/member/logout', { method: 'POST' })
                  } catch (error) {
                    console.error('Logout error:', error)
                  } finally {
                    setUserData(null)
                    // Dispatch logout event for other components
                    window.dispatchEvent(new CustomEvent('auth-logout'))
                    setIsOpen(false)
                    onNavigate?.()
                    router.push('/')
                  }
                }}
                className='flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer w-full text-left'
              >
                <FiLogOut className='h-4 w-4 text-red-600' />
                <div>
                  <div className='font-medium'>Sign Out</div>
                  <div className='text-xs text-gray-500'>End your session</div>
                </div>
              </button>
            </>
          ) : (
            <>
              {/* Login Option */}
              <Link
                href='/login'
                onClick={handleOptionClick}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                  'border-b border-gray-100',
                )}
              >
                <FiLogIn className='h-4 w-4 text-blue-600' />
                <div>
                  <div className='font-medium'>Sign In</div>
                  <div className='text-xs text-gray-500'>
                    Access your account
                  </div>
                </div>
              </Link>

              {/* Sign Up Option */}
              <Link
                href='/register'
                onClick={handleOptionClick}
                className='flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer'
              >
                <FiUserPlus className='h-4 w-4 text-green-600' />
                <div>
                  <div className='font-medium'>Create Account</div>
                  <div className='text-xs text-gray-500'>
                    Join our community
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}