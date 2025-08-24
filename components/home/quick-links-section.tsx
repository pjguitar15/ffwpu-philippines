'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

const items = [
  {
    title: 'News',
    desc: 'Latest community updates and event reports.',
    href: '/news',
    img: 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Articles',
    desc: 'Providence insights and thoughtful reads.',
    href: '/articles',
    img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Newsletter',
    desc: 'Weekly inspiration and community updates.',
    href: '/newsletter',
    img: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1600&auto=format&fit=crop',
  },
]

export function QuickLinksSection() {
  return (
    <section className='py-4 bg-white'>
      <div className='container mx-auto'>
        {/* Header */}
        <div className='text-center space-y-4 mb-12 md:mb-16'>
          <h2 className='font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900'>
            Explore Our Community
          </h2>
          <p className='text-md md:text-lg text-gray-600 max-w-2xl mx-auto'>
            See how you can connect, grow, and share your gifts with our
            community.
          </p>
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8'>
          {items.map((it) => (
            <Card
              key={it.title}
              className='group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg py-0'
            >
              {/* Image */}
              <div className='relative aspect-[16/9] md:aspect-[3/2]'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.img}
                  alt={it.title}
                  className='block h-full w-full object-cover' /* block removes inline img whitespace */
                />
              </div>

              {/* Content */}
              <CardContent className='p-6'>
                <h3 className='font-heading text-xl md:text-2xl font-bold text-gray-900'>
                  {it.title}
                </h3>
                <p className='mt-2 text-sm md:text-base text-gray-600'>
                  {it.desc}
                </p>

                <Link
                  href={it.href}
                  className='mt-5 inline-flex items-center text-sm md:text-sm font-semibold text-blue-500 hover:text-blue-800 underline-offset-4 hover:underline'
                >
                  Learn more <span className='ml-1.5'>→</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
