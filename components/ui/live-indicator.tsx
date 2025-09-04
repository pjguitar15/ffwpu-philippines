'use client'

import { useState, useEffect } from 'react'

interface LiveIndicatorProps {
  className?: string
}

interface LivestreamData {
  isActive: boolean
  url: string
  title: string
}

export function LiveIndicator({ className = '' }: LiveIndicatorProps) {
  const [livestream, setLivestream] = useState<LivestreamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch livestream status
    const fetchLivestreamStatus = async () => {
      try {
        const response = await fetch('/api/livestream')
        if (response.ok) {
          const data = await response.json()
          setLivestream(data)
        }
      } catch (error) {
        console.error('Error fetching livestream status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLivestreamStatus()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchLivestreamStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (livestream?.url) {
      window.open(livestream.url, '_blank', 'noopener,noreferrer')
    }
  }

  // Don't render anything if loading, not active, or no URL
  if (isLoading || !livestream?.isActive || !livestream?.url) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-red-700 transition-colors shadow-sm ${className}`}
      title={`Watch ${livestream.title || 'Live Stream'}`}
    >
      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      LIVE
    </button>
  )
}
