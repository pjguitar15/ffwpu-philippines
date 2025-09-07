'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  PlayCircle,
  ExternalLink,
  Play,
  Info,
  Plus,
  Check,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { HighlightTitle } from '@/components/ui/highlight-title'

interface YouTubeVideo {
  _id: string
  title: string
  description?: string
  videoId: string
  thumbnailUrl: string
  isActive: boolean
  order: number
}

function VideoRow({
  title,
  videos,
  onVideoSelect,
}: {
  title: string
  videos: YouTubeVideo[]
  onVideoSelect: (video: YouTubeVideo) => void
}) {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScrolling) return

    const container = scrollContainerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const containerWidth = rect.width
    const scrollWidth = container.scrollWidth
    const currentScroll = container.scrollLeft

    // Auto-scroll zones (last 10% of visible area)
    const rightZone = containerWidth * 0.9
    const leftZone = containerWidth * 0.1

    // Clear any existing auto-scroll
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }

    // Auto-scroll right when cursor is in right zone and there's more content
    if (x > rightZone && currentScroll < scrollWidth - containerWidth) {
      autoScrollRef.current = setInterval(() => {
        if (container.scrollLeft >= scrollWidth - containerWidth) {
          if (autoScrollRef.current) clearInterval(autoScrollRef.current)
          return
        }
        container.scrollLeft += 2
      }, 16)
    }
    // Auto-scroll left when cursor is in left zone and not at start
    else if (x < leftZone && currentScroll > 0) {
      autoScrollRef.current = setInterval(() => {
        if (container.scrollLeft <= 0) {
          if (autoScrollRef.current) clearInterval(autoScrollRef.current)
          return
        }
        container.scrollLeft -= 2
      }, 16)
    }
  }

  const handleMouseLeave = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    const container = scrollContainerRef.current
    if (!container) return

    setIsScrolling(true)
    container.scrollLeft += e.deltaY

    // Clear auto-scroll when user manually scrolls
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }

    // Re-enable auto-scroll after manual scroll ends
    setTimeout(() => setIsScrolling(false), 150)
  }

  return (
    <div className='mb-12'>
      <h2 className='text-xl md:text-2xl font-semibold text-slate-900 mb-6 px-4 md:px-12'>
        {title}
      </h2>

      <div className='relative'>
        {/* Desktop: Horizontal scrolling */}
        <div
          ref={scrollContainerRef}
          className='hidden md:flex gap-4 overflow-x-auto scrollbar-hide px-12 pb-4 scroll-smooth'
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className='relative flex-shrink-0 w-80 cursor-pointer group'
              onHoverStart={() => setHoveredVideo(video._id)}
              onHoverEnd={() => setHoveredVideo(null)}
              onClick={() => onVideoSelect(video)}
            >
              <Card className='overflow-hidden bg-white border border-slate-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-xl'>
                <CardContent className='p-0'>
                  <div className='relative aspect-video'>
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className='object-cover transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300' />

                    <AnimatePresence>
                      {hoveredVideo === video._id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='absolute inset-0 flex items-center justify-center'
                        >
                          <PlayCircle className='w-16 h-16 text-white drop-shadow-lg' />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className='p-4 bg-white'>
                    <h3 className='text-slate-900 font-semibold text-md line-clamp-2 mb-2'>
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className='text-sm text-slate-600 line-clamp-2 mb-2'>
                        {video.description}
                      </p>
                    )}

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='text-slate-700 hover:text-slate-900 hover:bg-slate-100 p-1'
                        >
                          <Play className='w-4 h-4 fill-current' />
                        </Button>
                      </div>

                      <span className='text-xs text-slate-500'>
                        HJ Media Works
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Vertical grid */}
        <div className='md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 px-4'>
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className='relative cursor-pointer group'
              onClick={() => onVideoSelect(video)}
            >
              <Card className='overflow-hidden bg-white border border-slate-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl'>
                <CardContent className='p-0'>
                  <div className='relative aspect-video'>
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className='object-cover transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300' />

                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <PlayCircle className='w-16 h-16 text-white drop-shadow-lg' />
                    </div>
                  </div>

                  <div className='p-4 bg-white'>
                    <h3 className='text-slate-900 font-semibold text-md line-clamp-2 mb-2'>
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className='text-sm text-slate-600 line-clamp-2 mb-2'>
                        {video.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicators - hide on mobile */}
        <div className='hidden md:block absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none' />
        <div className='hidden md:block absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none' />
      </div>
    </div>
  )
}

function VideoModal({
  video,
  isOpen,
  onClose,
}: {
  video: YouTubeVideo | null
  isOpen: boolean
  onClose: () => void
}) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Reset description state when modal opens with new video
  useEffect(() => {
    if (isOpen && video) {
      setShowFullDescription(false)
    }
  }, [isOpen, video])

  if (!video) return null

  const shouldTruncateDescription =
    video.description && video.description.length > 200
  const displayDescription =
    shouldTruncateDescription && !showFullDescription
      ? video.description!.substring(0, 200) + '...'
      : video.description

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        // override default narrow max-width + remove padding
        className='
          p-0 bg-white border border-slate-200 overflow-hidden
          sm:max-w-[92vw] md:max-w-4xl lg:max-w-6xl
          w-[92vw] md:w-auto
        '
      >
        <DialogTitle className='sr-only'>{video.title}</DialogTitle>

        {/* Video area: fixed 16:9, full width */}
        <div className='w-full bg-black'>
          <div className='relative aspect-video'>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='absolute inset-0 h-full w-full'
            />
          </div>
        </div>

        {/* Text / actions below the video */}
        <div className='p-6 bg-white text-slate-900 max-h-[40vh] overflow-y-auto'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex-1'>
              <h2 className='text-xl md:text-2xl font-bold mb-3 text-slate-900'>
                {video.title}
              </h2>
            </div>
          </div>

          {video.description && (
            <div className='border-t border-slate-200 pt-4'>
              <h3 className='text-lg font-semibold mb-2 text-slate-900'>
                About this video
              </h3>
              <div className='text-slate-700 leading-relaxed'>
                <p>{displayDescription}</p>
                {shouldTruncateDescription && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className='mt-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors duration-200'
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function HJMediaWorksPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/youtube-videos')

      if (response.ok) {
        const data = await response.json()
        const activeVideos = data.filter(
          (video: YouTubeVideo) => video.isActive,
        )
        setVideos(activeVideos)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const openVideoModal = (video: YouTubeVideo) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-pulse'>
            <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 rounded-full mx-auto mb-4'></div>
          </div>
          <p className='text-slate-700 text-lg'>Loading HJ Media Works...</p>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-slate-900'>
          <PlayCircle className='w-24 h-24 text-slate-400 mx-auto mb-4' />
          <h2 className='text-2xl font-semibold mb-2'>No Content Available</h2>
          <p className='text-slate-600'>
            Videos will appear here once they are added.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <section className='relative isolate overflow-hidden'>
        <Image
          src='/hj-media-works-banner.jpg'
          alt='HJ Media Works Banner'
          fill
          className='object-cover'
          priority
        />

        {/* Readability + color wash overlays */}
        <div className='pointer-events-none absolute inset-0 z-0'>
          {/* Base dark vignette for contrast - increased darkness */}
          <div className='absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/60 to-slate-950/90' />
          {/* Colorful radial washes (sky/cyan top-right, fuchsia bottom-left) - reduced opacity for more contrast */}
          <div className='absolute inset-0 opacity-60 [background:radial-gradient(720px_360px_at_85%_0%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(820px_400px_at_0%_100%,rgba(236,72,153,0.16),transparent_60%)]' />
        </div>
        {/* Soft brand glows - reduced opacity */}
        <div className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-tr from-sky-400/20 to-indigo-400/12' />
        <div className='pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full blur-3xl bg-gradient-to-tr from-fuchsia-400/15 to-emerald-400/8' />

        <div className='relative container mx-auto px-4 md:px-6 py-14 md:py-16'>
          <div className='relative z-10 mx-auto max-w-5xl space-y-7'>
            {/* Eyebrow */}
            <p className='mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white/90 ring-1 ring-white/30 backdrop-blur-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]'>
              <Image
                src='/hj-media-works.jpg'
                alt='HJ Media Works'
                width={16}
                height={16}
                className='rounded'
              />
              Media • Inspiration & Growth
            </p>

            {/* Title */}
            <div className='space-y-3 text-left'>
              <div className='flex items-center gap-3 md:gap-4'>
                <Image
                  src='/hj-media-works.jpg' // use a square asset if possible
                  alt='HJ Media Works logo'
                  width={56}
                  height={56}
                  priority
                  className='rounded-full bg-white/90 p-1 ring-1 ring-white/40 shadow-md'
                />
                <HighlightTitle
                  as='h1'
                  text='HJ Media Works'
                  highlightedText='HJ Media Works'
                  uppercase
                  className='text-3xl md:text-5xl font-extrabold leading-tight tracking-wide text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]'
                  gradientClassName='bg-gradient-to-r from-sky-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent [text-shadow:0_0_20px_rgba(56,189,248,0.6)]'
                />
              </div>

              <p className='text-base md:text-lg text-white/95 max-w-3xl leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]'>
                Discover our collection of inspiring videos that share messages
                of hope, love, and spiritual growth. Join us on a journey of
                faith and transformation through meaningful content that touches
                hearts and changes lives.
              </p>
            </div>

            {/* CTA */}
            <div className='flex flex-col items-start justify-start gap-3 sm:flex-row sm:gap-4'>
              <Button
                asChild
                className='bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 ring-1 ring-white/10 shadow-[0_8px_30px_rgba(34,211,238,0.35)] text-base sm:text-base px-6 hover:shadow-[0_8px_30px_rgba(34,211,238,0.45)] transition-all duration-300'
              >
                <a
                  href='https://www.youtube.com/@HJMediaWorks'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <span className='inline-flex items-center gap-2'>
                    <ExternalLink className='w-5 h-5' />
                    Subscribe on YouTube
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Rows */}
      <div className='py-16 bg-gray-50'>
        <div className='container mx-auto'>
          <VideoRow
            title='Featured Videos'
            videos={videos.slice(0, 6)}
            onVideoSelect={openVideoModal}
          />

          {videos.length > 6 && (
            <VideoRow
              title='More from HJ Media Works'
              videos={videos.slice(6)}
              onVideoSelect={openVideoModal}
            />
          )}
        </div>
      </div>

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={closeVideoModal}
      />
    </div>
  )
}
