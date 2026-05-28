'use client'

import Image from 'next/image'
import * as React from 'react'
import { cn } from '@/lib/utils'

type NewsImageProps = {
  src?: string | null
  alt: string
  title?: string
  tag?: string
  date?: string
  priority?: boolean
  sizes?: string
  className?: string
  imageClassName?: string
  placeholderClassName?: string
}

export function NewsImage({
  src,
  alt,
  priority,
  sizes = '100vw',
  className,
  imageClassName,
  placeholderClassName,
}: NewsImageProps) {
  const cleanSrc = typeof src === 'string' ? src.trim() : ''
  const hasSrc = cleanSrc.length > 0
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    setFailed(false)
  }, [cleanSrc])

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100 text-slate-900',
        className,
      )}
    >
      {hasSrc && !failed ? (
        <Image
          src={cleanSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover object-center', imageClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={cn(
            'absolute inset-0 h-full w-full bg-slate-50',
            placeholderClassName,
          )}
          role='img'
          aria-label={alt}
        >
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_78%_76%,rgba(245,158,11,0.16),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_46%,#e2e8f0_100%)]' />
          <div className='absolute inset-0 opacity-[0.42] [background-image:linear-gradient(rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.055)_1px,transparent_1px)] [background-size:28px_28px]' />
          <div className='absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/80 to-transparent' />
          <div className='absolute left-5 top-5 h-10 w-10 rounded-full border border-slate-300/70 bg-white/70 shadow-sm backdrop-blur-sm' />
          <div className='absolute left-7 top-7 h-6 w-6 rounded-full bg-sky-100/90 ring-1 ring-sky-200/80' />
          <div className='absolute right-5 top-5 h-px w-20 bg-slate-300/80' />
          <div className='absolute right-5 top-8 h-px w-12 bg-slate-300/60' />
        </div>
      )}
    </div>
  )
}
