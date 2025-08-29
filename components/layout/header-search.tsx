'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiX } from 'react-icons/fi'
import { Search as SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  inputClassName?: string
  variant?: 'desktop' | 'drawer'
}

export function HeaderSearch({
  className,
  inputClassName,
  variant = 'desktop',
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
  }, [searchParams])

  const runSearch = () => {
    const term = searchTerm.trim()
    router.push(`/news${term ? `?q=${encodeURIComponent(term)}` : ''}`)
  }

  return (
    <div className={cn('relative', className)}>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && runSearch()}
        placeholder='Search news…'
        className={cn(
          variant === 'desktop'
            ? 'rounded-full border-2 bg-white pl-10 pr-9 py-2 text-sm focus:border-slate-300 font-medium'
            : 'w-full rounded-xl border-2 bg-white pl-10 pr-9 py-2.5 text-sm focus:border-slate-300',
          inputClassName,
        )}
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
  )
}
