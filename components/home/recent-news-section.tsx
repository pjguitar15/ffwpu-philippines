'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NewsItem } from '@/data/news'
import { HighlightTitle } from '../ui/highlight-title'
import Image from 'next/image'
import { ArrowRight, Newspaper, ChevronDown } from 'lucide-react'
import * as React from 'react'
import { excerptFromHtml } from '@/lib/text'

type Props = {
  sampleNews: NewsItem[]
}

export function RecentNewsSection({ sampleNews }: Props) {
  const [visible, setVisible] = React.useState(3) // initially show 3 (feature + 2)
  const canLoadMore = visible < sampleNews.length

  const feature = sampleNews[0]
  const side = sampleNews.slice(1, Math.min(3, visible))
  const rest = sampleNews.slice(3, visible)

  return (
    <section className='space-y-8 px-4 md:px-0'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0'>
        <div className='space-y-2'>
          <span className='text-xs font-semibold text-white bg-gray-700 mx-auto px-4 py-1 rounded-full'>
            Local News Update
          </span>
          <HighlightTitle
            text='Updates on the Philippine Providence'
            highlightedText='Philippine Providence'
            as='h2'
            uppercase
            className='text-2xl md:text-4xl mt-3'
            gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-800 bg-clip-text text-transparent'
          />
          <p className='text-muted-foreground'>
            Stay updated with our community happenings
          </p>
        </div>

        <Button
          asChild
          variant='outline'
          className='group cursor-pointer rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 px-4'
        >
          <Link
            href='/news'
            aria-label='View all news'
            className='inline-flex items-center'
          >
            <Newspaper className='mr-2 h-4 w-4' />
            View All News
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[1fr]'>
        {/* FEATURED (spans 2 cols & 2 rows) */}
        {feature && (
          <Link
            href={`/news/${feature.slug}`}
            className='relative group rounded-xl overflow-hidden ring-1 ring-black/10
                       md:col-span-2 md:row-span-2
                       aspect-[16/9] md:aspect-auto md:h-[500px] bg-black/80'
          >
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              priority
              sizes='(max-width: 768px) 100vw, 66vw'
              className='object-cover object-center opacity-85 md:group-hover:scale-105 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:group-hover:from-black/90 md:group-hover:via-black/60 transition-colors duration-300' />
            <div className='relative z-10 flex flex-col justify-end h-full p-5 md:p-8'>
              <div className='mb-2'>
                <Badge
                  variant='secondary'
                  className='bg-white/85 text-black font-semibold'
                >
                  {feature.tags?.[0]}
                </Badge>
              </div>
              <h3 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 md:mb-2 line-clamp-2'>
                {feature.title}
              </h3>
              <div className='text-white/85 text-xs sm:text-sm mb-2'>
                {feature.author} &middot;{' '}
                {new Date(feature.date).toLocaleDateString()}
              </div>
              <div className='overflow-hidden relative'>
                <p className='text-white/90 text-sm sm:text-base line-clamp-2 md:line-clamp-3 transition-[max-height] duration-300 md:group-hover:line-clamp-none md:group-hover:max-h-32 max-h-12'>
                  {excerptFromHtml(feature.content, 180)}
                </p>
                <div className='absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:group-hover:opacity-0 transition-opacity duration-300' />
              </div>
            </div>
          </Link>
        )}

        {/* TWO SIDE CARDS (to the right on desktop) */}
        {side.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className='relative group rounded-xl overflow-hidden ring-1 ring-black/10
                       bg-black/80 min-h-0
                       aspect-[16/10] md:aspect-auto md:h-[240px]'
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover object-center opacity-85 md:group-hover:scale-105 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:group-hover:from-black/90 md:group-hover:via-black/60 transition-colors duration-300' />
            <div className='relative z-10 flex flex-col justify-end h-full p-4'>
              <div className='mb-1'>
                <Badge
                  variant='secondary'
                  className='bg-white/85 text-black font-semibold'
                >
                  {item.tags?.[0]}
                </Badge>
              </div>
              <h4 className='text-base sm:text-lg font-bold text-white mb-1 line-clamp-2'>
                {item.title}
              </h4>
              <div className='text-white/80 text-xs'>
                {item.author} &middot;{' '}
                {new Date(item.date).toLocaleDateString()}
              </div>
              <div className='overflow-hidden relative'>
                <p className='text-white/90 text-xs sm:text-sm line-clamp-1'>
                  {excerptFromHtml(item.content, 180)}
                </p>
                <div className='absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:opacity-0' />
              </div>
            </div>
          </Link>
        ))}

        {/* MORE CARDS (flow under the feature) */}
        {rest.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className='relative group rounded-xl overflow-hidden ring-1 ring-black/10
                       bg-black/80 min-h-0
                       aspect-[16/10] md:aspect-auto md:h-[240px]'
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover object-center opacity-85 md:group-hover:scale-105 transition-transform duration-500'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent md:group-hover:from-black/90 md:group-hover:via-black/60 transition-colors duration-300' />
            <div className='relative z-10 flex flex-col justify-end h-full p-4'>
              <div className='mb-1'>
                <Badge
                  variant='secondary'
                  className='bg-white/85 text-black font-semibold'
                >
                  {item.tags?.[0]}
                </Badge>
              </div>
              <h4 className='text-base sm:text-lg font-bold text-white mb-1 line-clamp-2'>
                {item.title}
              </h4>
              <div className='text-white/80 text-xs'>
                {item.author} &middot;{' '}
                {new Date(item.date).toLocaleDateString()}
              </div>
              <p className='text-white/90 text-xs sm:text-sm line-clamp-1'>
                {excerptFromHtml(item.content, 180)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Load more */}
      {canLoadMore && (
        <div className='flex justify-center'>
          <Button
            variant='outline'
            onClick={() =>
              setVisible((v) => Math.min(v + 3, sampleNews.length))
            }
            className='rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 inline-flex items-center cursor-pointer'
          >
            View more updates
            <ChevronDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      )}
    </section>
  )
}
