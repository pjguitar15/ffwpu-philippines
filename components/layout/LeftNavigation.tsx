'use client'

import { FiList, FiGitBranch, FiHome, FiUsers, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface LeftNavigationProps {
  currentMemberId?: string
}

export default function LeftNavigation({ currentMemberId }: LeftNavigationProps) {
  const pathname = usePathname()
  const [persistedMemberId, setPersistedMemberId] = useState<string | null>(null)

  // Extract member ID from pathname
  const urlMemberId = (() => {
    // Check if we're on a profile page
    const profileMatch = pathname.match(/^\/profile\/([a-f0-9]{24})$/)
    if (profileMatch) return profileMatch[1]
    
    // Check if we're on a specific family tree page
    const familyTreeMatch = pathname.match(/^\/members\/spiritual-family-tree\/([a-f0-9]{24})$/)
    if (familyTreeMatch) return familyTreeMatch[1]
    
    return null
  })()

  // Get the member ID from props, URL, or persisted state
  const extractedMemberId = currentMemberId || urlMemberId || persistedMemberId

  // Persist member ID to localStorage when we have one
  useEffect(() => {
    try {
      const memberIdToStore = currentMemberId || urlMemberId
      if (memberIdToStore) {
        localStorage.setItem('lastViewedMemberId', memberIdToStore)
        setPersistedMemberId(memberIdToStore)
      } else {
        // Load from localStorage on mount
        const stored = localStorage.getItem('lastViewedMemberId')
        if (stored) {
          setPersistedMemberId(stored)
        }
      }
    } catch (error) {
      // localStorage might not be available (SSR, privacy mode, etc.)
      console.log('LocalStorage not available:', error)
    }
  }, [currentMemberId, urlMemberId])

  const navigationItems: NavigationItem[] = [
    {
      label: 'Profile',
      href: '/profile',
      icon: (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <FiUser className="h-3 w-3 text-white" />
          </div>
        </div>
      )
    },
    {
      label: 'Show All Members',
      href: '/members',
      icon: <FiList className="h-5 w-5" />
    },
    {
      label: 'Spiritual Leaders Network', 
      href: '/members/spiritual-family-tree',
      icon: <FiUsers className="h-5 w-5" />
    },
  ]

  // Add current member's family tree if we have an ID
  if (extractedMemberId) {
    const isCurrentContext = currentMemberId || urlMemberId
    navigationItems.push({
      label: isCurrentContext ? 'My Family Tree' : 'Last Viewed Tree',
      href: `/members/spiritual-family-tree/${extractedMemberId}`,
      icon: <FiGitBranch className="h-5 w-5" />
    })
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40 overflow-y-auto hidden lg:block">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="flex items-center space-x-2">
          <img 
            src="/ffwpu-ph-logo.webp" 
            alt="FFWPU Philippines" 
            className="h-8 w-8"
          />
          <span className="font-semibold text-gray-900">FFWPU PH</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = (() => {
              // Exact matches first
              if (pathname === item.href) return true
              
              // Profile pages
              if (item.href === '/profile' && pathname.startsWith('/profile')) return true
              
              // Members page (exact match only)
              if (item.href === '/members' && pathname === '/members') return true
              
              // Spiritual Leaders Network (exact match only, not individual trees)
              if (item.href === '/members/spiritual-family-tree' && pathname === '/members/spiritual-family-tree') return true
              
              // My Family Tree (individual tree pages)
              if (item.href.startsWith('/members/spiritual-family-tree/') && pathname === item.href) return true
              
              return false
            })()
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-150",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <div className={cn(
                  "flex-shrink-0",
                  isActive ? "text-blue-700" : "text-gray-500"
                )}>
                  {item.icon}
                </div>
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Family Federation for World Peace and Unification - Philippines
        </div>
      </div>
    </div>
  )
}