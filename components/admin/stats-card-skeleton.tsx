'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StatsCardSkeletonProps {
  customCardClass?: string
  iconBg?: string
}

export function StatsCardSkeleton({ 
  customCardClass = 'bg-gradient-to-br from-gray-300 to-gray-400',
  iconBg = 'bg-white/20'
}: StatsCardSkeletonProps) {
  return (
    <Card
      className={`overflow-hidden border-0 shadow-sm transition-all duration-300 ${customCardClass} relative`}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-0.5 pt-2.5 px-5'>
        <div className='flex-1'>
          {/* Title skeleton */}
          <div className='h-4 w-20 bg-white/30 rounded mb-1 animate-pulse'></div>
          {/* Divider skeleton */}
          <div className='mt-1 h-px w-10 bg-white/40 rounded-full' />
        </div>
        {/* Icon skeleton */}
        <div className={`p-2.5 rounded-full ${iconBg}`}>
          <div className='h-6 w-6 bg-white/30 rounded animate-pulse'></div>
        </div>
      </CardHeader>

      <CardContent className='pt-0.5 pb-2.5 px-5'>
        {/* Value skeleton */}
        <div className='h-8 md:h-10 w-16 bg-white/30 rounded mb-1 animate-pulse'></div>
        {/* Subtitle skeleton */}
        <div className='h-3 w-24 bg-white/20 rounded animate-pulse'></div>
      </CardContent>
    </Card>
  )
}