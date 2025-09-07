'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiX } from 'react-icons/fi'
import { Search as SearchIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  inputClassName?: string
  variant?: 'desktop' | 'drawer'
  /** Called right before navigating (use to close the drawer on mobile) */
  onNavigate?: () => void
}

type Suggestion = {
  slug: string
  title: string
  date?: string
  image?: string
  tags?: string[]
}

export function HeaderSearch({
  className,
  inputClassName,
  variant = 'desktop',
  onNavigate,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
  }, [searchParams])

  const runSearch = () => {
    const term = searchTerm.trim()
    onNavigate?.() // 👈 close sidebar if provided
    router.push(`/news${term ? `?q=${encodeURIComponent(term)}` : ''}`)
    setOpen(false)
  }

  // Debounced suggest
  useEffect(() => {
    const term = searchTerm.trim()
    if (!term) {
      setSuggestions([])
      setOpen(false)
      setLoading(false)
      return
    }
    setLoading(true)
    setOpen(true)
    setActiveIndex(-1)
    const t = setTimeout(async () => {
      try {
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        const res = await fetch(`/api/news?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Suggest failed')
        const data: Suggestion[] = await res.json()
        setSuggestions(data)
      } catch {
        // ignore if aborted
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(t)
  }, [searchTerm])

  // click outside to close
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'Enter') runSearch()
      return
    }
    const count = suggestions.length + 1 /* + “see all results” row */
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % Math.max(count, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + Math.max(count, 1)) % Math.max(count, 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex === -1 || activeIndex === suggestions.length) {
        runSearch()
      } else {
        const s = suggestions[activeIndex]
        onNavigate?.() // 👈 close sidebar for suggestion via Enter
        router.push(`/news/${s.slug}`)
        setOpen(false)
      }
    }
  }

  const highlight = (text: string, needle: string) => {
    const n = needle.trim()
    if (!n) return text
    const parts = text.split(new RegExp(`(${escapeRegExp(n)})`, 'ig'))
    return parts.map((p, i) =>
      p.toLowerCase() === n.toLowerCase() ? (
        <mark key={i} className='bg-yellow-200 rounded px-0.5'>
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      ),
    )
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder='Search news…'
        aria-autocomplete='list'
        aria-expanded={open}
        aria-controls='news-suggest-listbox'
        role='combobox'
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
      {!!searchTerm && (
        <button
          aria-label='Clear search'
          onClick={() => {
            setSearchTerm('')
            setSuggestions([])
            setOpen(false)
          }}
          className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
        >
          <FiX className='h-4 w-4' />
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            'absolute left-0 right-0 top-full mt-1 z-50 overflow-hidden rounded-xl border bg-white shadow-xl',
            variant === 'drawer' ? 'w-full' : 'min-w-[280px]',
          )}
          role='listbox'
          id='news-suggest-listbox'
        >
          <div className='max-h-[60vh] overflow-auto'>
            {loading && (
              <div className='flex items-center gap-2 px-3 py-3 text-sm text-slate-600'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Searching…
              </div>
            )}

            {!loading && suggestions.length === 0 && (
              <div className='px-3 py-3 text-sm text-slate-500'>
                No quick matches.
              </div>
            )}

            {!loading &&
              suggestions.map((s, i) => (
                <Link
                  key={s.slug}
                  href={`/news/${s.slug}`}
                  className={cn(
                    'block px-3 py-2 text-sm hover:bg-blue-100 focus:bg-slate-50',
                    i === activeIndex ? 'bg-slate-100' : '',
                  )}
                  role='option'
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    onNavigate?.()
                    setOpen(false)
                  }} // 👈 close sidebar on click
                >
                  <div className='font-medium line-clamp-1'>
                    {highlight(s.title, searchTerm)}
                  </div>
                  <div className='mt-0.5 text-xs text-slate-500 flex items-center gap-2'>
                    {s.date ? new Date(s.date).toLocaleDateString() : null}
                    {!!s.tags?.length && (
                      <span className='inline-flex gap-1'>
                        {s.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className='rounded-full bg-slate-100 px-2 py-0.5'
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>

          {/* See all results row */}
          {searchTerm.trim() && (
            <button
              className={cn(
                'w-full text-left px-3 py-2 text-sm border-t bg-slate-50 hover:bg-slate-100',
                activeIndex === suggestions.length ? 'bg-slate-100' : '',
              )}
              onMouseEnter={() => setActiveIndex(suggestions.length)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={runSearch} // 👈 calls onNavigate inside
            >
              See all results for “{searchTerm.trim()}”
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
