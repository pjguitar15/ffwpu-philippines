'use client'

import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Phone,
  FileText,
  Info,
  Clock,
  Heart,
  ArrowRight,
} from 'lucide-react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'

type NavItem = {
  href: string
  label: string
  desc: string
  icon: React.ComponentType<{ className?: string }>
}

const mainNavItems: NavItem[] = [
  {
    href: '/about/true-parents',
    label: 'True Parents',
    desc: 'Rev. Moon & Holy Mother Han',
    icon: Sparkles,
  },
  {
    href: '/contact',
    label: 'Contact',
    desc: 'Reach out to our team',
    icon: Phone,
  },
]

const extraNavItems: NavItem[] = [
  {
    href: '/news',
    label: 'News',
    desc: 'Latest updates & reports',
    icon: FileText,
  },
  {
    href: '/about',
    label: 'About',
    desc: 'Who we are & our mission',
    icon: Info,
  },
  {
    href: '/about/history',
    label: 'Our History',
    desc: 'Roots of our movement',
    icon: Clock,
  },
  {
    href: '/about/true-parents',
    label: 'True Parents',
    desc: 'Rev. Moon & Holy Mother Han',
    icon: Heart,
  },
]

function dedupe(items: NavItem[]) {
  const seen = new Set<string>()
  return items.filter((i) =>
    seen.has(i.href) ? false : (seen.add(i.href), true),
  )
}

export function QuickLinksSection() {
  const links = dedupe([...mainNavItems, ...extraNavItems])

  return (
    <section className='relative py-10 sm:py-12'>
      <div className='px-4 md:px-0'>
        {/* Dark surface with soft glow */}
        <div className='relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ring-1 ring-white/10'>
          <div className='container mx-auto'>
            {/* soft glows */}
            <div
              aria-hidden
              className='pointer-events-none absolute -top-24 -right-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl'
            />
            <div
              aria-hidden
              className='pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl'
            />

            <div className='px-5 sm:px-8 py-8 sm:py-10'>
              {/* Header */}
              <div className='text-center space-y-2 mb-8 md:mb-10'>
                <Eyebrow className='text-white/70'>Keep Exploring</Eyebrow>
                <HighlightTitle
                  as='h2'
                  text='Find more on our site'
                  highlightedText='more'
                  className='text-2xl md:text-4xl text-white'
                  uppercase
                  gradientClassName='bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-200 bg-clip-text text-transparent'
                />
                <p className='text-sm text-white/70 max-w-xl mx-auto'>
                  Quick paths to helpful pages and resources.
                </p>
              </div>

              {/* Compact tiles */}
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
                {links.map(({ href, label, desc, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-label={label}
                    className='group relative rounded-xl border border-white/10 bg-white/5 p-3 md:p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/15 to-indigo-400/10 ring-1 ring-white/10 transition-transform group-hover:scale-[1.03]'>
                        <Icon className='h-5 w-5 text-cyan-300' />
                      </div>
                      <div className='min-w-0'>
                        <div className='flex items-center gap-1.5'>
                          <span className='font-semibold truncate'>
                            {label}
                          </span>
                          <ArrowRight className='h-4 w-4 text-white/60 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition' />
                        </div>
                        <p className='hidden sm:block mt-0.5 text-xs text-white/70 line-clamp-2'>
                          {desc}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
