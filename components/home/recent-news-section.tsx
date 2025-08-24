'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NewsItem } from '@/data/news'
import { HighlightTitle } from '../ui/highlight-title'
import Image from 'next/image'

type Props = {
  sampleNews: NewsItem[]
}

export function RecentNewsSection({ sampleNews }: Props) {
  return (
    <section className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <span className='text-xs font-semibold text-white bg-gray-700 mx-auto px-4 py-1 rounded-full'>
            Local News Update
          </span>
          <HighlightTitle
            text='Updates on the Philippine Providence'
            highlightedText='Philippine Providence'
            as='h2'
            className='text-2xl md:text-4xl mt-3'
            gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-800 bg-clip-text text-transparent'
          />
          <p className='text-muted-foreground'>
            Stay updated with our community happenings
          </p>
        </div>
        <Button
          variant='outline'
          asChild
          className='cursor-pointer bg-transparent'
        >
          <Link href='/news'>View All News</Link>
        </Button>
      </div>

      {/* Parent flex container */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[1fr]'>
        {/* FEATURED (spans 2 cols on desktop) */}
        {sampleNews[0] && (
          <Link
            href={`/news/${sampleNews[0].slug}`}
            className='relative group rounded-xl overflow-hidden ring-1 ring-black/10
                 md:col-span-2 md:row-span-2
                 aspect-[16/9] md:aspect-auto md:h-[500px] bg-black/80'
          >
            <Image
              src={sampleNews[0].image}
              alt={sampleNews[0].title}
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
                  {sampleNews[0].tags?.[0]}
                </Badge>
              </div>
              <h3 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 md:mb-2 line-clamp-2'>
                {sampleNews[0].title}
              </h3>
              <div className='text-white/85 text-xs sm:text-sm mb-2'>
                {sampleNews[0].author} &middot;{' '}
                {new Date(sampleNews[0].date).toLocaleDateString()}
              </div>
              <div className='overflow-hidden relative'>
                <p className='text-white/90 text-sm sm:text-base line-clamp-2 md:line-clamp-3 transition-[max-height] duration-300 md:group-hover:line-clamp-none md:group-hover:max-h-32 max-h-12'>
                  {sampleNews[0].content}
                </p>
                <div className='absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:group-hover:opacity-0 transition-opacity duration-300' />
              </div>
            </div>
          </Link>
        )}

        {/* TWO CARDS (stack under feature on mobile; right column on desktop) */}
        {sampleNews.slice(1, 3).map((item) => (
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
                <p className='text-white/90 text-xs sm:text-sm line-clamp-1 md:line-clamp-2'>
                  {item.content}
                </p>
                <div className='absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none md:opacity-0' />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
