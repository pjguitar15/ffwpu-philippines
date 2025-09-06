'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  PlayCircle,
  ExternalLink,
  Play,
  Mic,
  Clock,
  User,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { HighlightTitle } from '@/components/ui/highlight-title'

interface TestimonyVideo {
  _id: string
  title: string
  description?: string
  speaker: string
  duration: string
  category: 'personal' | 'family' | 'ministry' | 'blessing'
  videoId: string
  thumbnailUrl: string
  isActive: boolean
  order: number
  tags?: string[]
}

// Placeholder data - will be replaced with real YouTube links
const placeholderTestimonies: TestimonyVideo[] = [
  {
    _id: '1',
    title: 'Finding True Love Through the Blessing',
    description: 'A heartfelt testimony about discovering divine love and the transformative power of the Blessing ceremony.',
    speaker: 'Maria Santos',
    duration: '12:45',
    category: 'blessing',
    videoId: 'dQw4w9WgXcQ', // Placeholder YouTube ID
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isActive: true,
    order: 1,
    tags: ['blessing', 'marriage', 'love']
  },
  {
    _id: '2',
    title: 'My Journey from Darkness to Light',
    description: 'Personal story of spiritual awakening and finding purpose through True Parents\' teachings.',
    speaker: 'John Kim',
    duration: '18:30',
    category: 'personal',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isActive: true,
    order: 2,
    tags: ['spiritual growth', 'purpose', 'transformation']
  },
  {
    _id: '3',
    title: 'Building an Ideal Family',
    description: 'Sharing experiences about creating harmony and love in the family centered on Heavenly Parent.',
    speaker: 'Grace & David Lee',
    duration: '15:20',
    category: 'family',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isActive: true,
    order: 3,
    tags: ['family', 'harmony', 'children']
  },
  {
    _id: '4',
    title: 'Called to Serve: My Ministry Experience',
    description: 'How dedicating my life to serving others has brought immense joy and spiritual fulfillment.',
    speaker: 'Pastor Michael Cruz',
    duration: '22:15',
    category: 'ministry',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isActive: true,
    order: 4,
    tags: ['ministry', 'service', 'calling']
  },
  {
    _id: '5',
    title: 'Healing Through Forgiveness',
    description: 'A powerful testimony about overcoming pain and finding peace through the practice of forgiveness.',
    speaker: 'Anna Rodriguez',
    duration: '16:40',
    category: 'personal',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isActive: true,
    order: 5,
    tags: ['healing', 'forgiveness', 'peace']
  },
  {
    _id: '6',
    title: 'True Parents Changed My Life',
    description: 'Personal reflection on how meeting True Parents transformed my understanding of love and purpose.',
    speaker: 'Robert Chen',
    duration: '20:05',
    category: 'personal',
    videoId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isActive: true,
    order: 6,
    tags: ['true parents', 'transformation', 'love']
  }
]

function TestimonyRow({
  title,
  testimonies,
  onTestimonySelect,
}: {
  title: string
  testimonies: TestimonyVideo[]
  onTestimonySelect: (testimony: TestimonyVideo) => void
}) {
  const [hoveredTestimony, setHoveredTestimony] = useState<string | null>(null)
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return <User className='w-4 h-4' />
      case 'family':
        return <Sparkles className='w-4 h-4' />
      case 'ministry':
        return <Mic className='w-4 h-4' />
      case 'blessing':
        return <Sparkles className='w-4 h-4' />
      default:
        return <User className='w-4 h-4' />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal':
        return 'bg-blue-100 text-blue-700'
      case 'family':
        return 'bg-green-100 text-green-700'
      case 'ministry':
        return 'bg-purple-100 text-purple-700'
      case 'blessing':
        return 'bg-pink-100 text-pink-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
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
          {testimonies.map((testimony, index) => (
            <motion.div
              key={testimony._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className='relative flex-shrink-0 w-80 cursor-pointer group'
              onHoverStart={() => setHoveredTestimony(testimony._id)}
              onHoverEnd={() => setHoveredTestimony(null)}
              onClick={() => onTestimonySelect(testimony)}
            >
              <Card className='overflow-hidden bg-white border border-slate-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-xl'>
                <CardContent className='p-0'>
                  <div className='relative aspect-video'>
                    <Image
                      src={testimony.thumbnailUrl}
                      alt={testimony.title}
                      fill
                      className='object-cover transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300' />

                    {/* Category badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(testimony.category)}`}>
                      {getCategoryIcon(testimony.category)}
                      {testimony.category}
                    </div>

                    {/* Duration badge */}
                    <div className='absolute top-3 right-3 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {testimony.duration}
                    </div>

                    <AnimatePresence>
                      {hoveredTestimony === testimony._id && (
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
                      {testimony.title}
                    </h3>

                    <p className='text-sm text-slate-600 mb-2 flex items-center gap-1'>
                      <User className='w-3 h-3' />
                      {testimony.speaker}
                    </p>

                    {testimony.description && (
                      <p className='text-sm text-slate-600 line-clamp-2 mb-3'>
                        {testimony.description}
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
                        HJ Testimonies
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
          {testimonies.map((testimony, index) => (
            <motion.div
              key={testimony._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className='relative cursor-pointer group'
              onClick={() => onTestimonySelect(testimony)}
            >
              <Card className='overflow-hidden bg-white border border-slate-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl'>
                <CardContent className='p-0'>
                  <div className='relative aspect-video'>
                    <Image
                      src={testimony.thumbnailUrl}
                      alt={testimony.title}
                      fill
                      className='object-cover transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300' />

                    {/* Category badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(testimony.category)}`}>
                      {getCategoryIcon(testimony.category)}
                      {testimony.category}
                    </div>

                    {/* Duration badge */}
                    <div className='absolute top-3 right-3 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {testimony.duration}
                    </div>

                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <PlayCircle className='w-16 h-16 text-white drop-shadow-lg' />
                    </div>
                  </div>

                  <div className='p-4 bg-white'>
                    <h3 className='text-slate-900 font-semibold text-md line-clamp-2 mb-2'>
                      {testimony.title}
                    </h3>

                    <p className='text-sm text-slate-600 mb-2 flex items-center gap-1'>
                      <User className='w-3 h-3' />
                      {testimony.speaker}
                    </p>

                    {testimony.description && (
                      <p className='text-sm text-slate-600 line-clamp-2 mb-2'>
                        {testimony.description}
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

function TestimonyModal({
  testimony,
  isOpen,
  onClose,
}: {
  testimony: TestimonyVideo | null
  isOpen: boolean
  onClose: () => void
}) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Reset description state when modal opens with new testimony
  useEffect(() => {
    if (isOpen && testimony) {
      setShowFullDescription(false)
    }
  }, [isOpen, testimony])

  if (!testimony) return null

  const shouldTruncateDescription =
    testimony.description && testimony.description.length > 200
  const displayDescription =
    shouldTruncateDescription && !showFullDescription
      ? testimony.description!.substring(0, 200) + '...'
      : testimony.description

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return <User className='w-5 h-5' />
      case 'family':
        return <Sparkles className='w-5 h-5' />
      case 'ministry':
        return <Mic className='w-5 h-5' />
      case 'blessing':
        return <Sparkles className='w-5 h-5' />
      default:
        return <User className='w-5 h-5' />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal':
        return 'bg-blue-100 text-blue-700'
      case 'family':
        return 'bg-green-100 text-green-700'
      case 'ministry':
        return 'bg-purple-100 text-purple-700'
      case 'blessing':
        return 'bg-pink-100 text-pink-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='
          p-0 bg-white border border-slate-200 overflow-hidden
          sm:max-w-[92vw] md:max-w-4xl lg:max-w-6xl
          w-[92vw] md:w-auto
        '
      >
        <DialogTitle className='sr-only'>{testimony.title}</DialogTitle>

        {/* Video area: fixed 16:9, full width */}
        <div className='w-full bg-black'>
          <div className='relative aspect-video'>
            <iframe
              src={`https://www.youtube.com/embed/${testimony.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={testimony.title}
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
              <div className='flex items-center gap-3 mb-3'>
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getCategoryColor(testimony.category)}`}>
                  {getCategoryIcon(testimony.category)}
                  {testimony.category}
                </div>
                <div className='flex items-center gap-1 text-slate-600'>
                  <Clock className='w-4 h-4' />
                  <span className='text-sm'>{testimony.duration}</span>
                </div>
              </div>
              
              <h2 className='text-xl md:text-2xl font-bold mb-2 text-slate-900'>
                {testimony.title}
              </h2>
              
              <p className='text-slate-600 flex items-center gap-2 mb-3'>
                <User className='w-4 h-4' />
                <span className='font-medium'>{testimony.speaker}</span>
              </p>
            </div>
          </div>

          {testimony.description && (
            <div className='border-t border-slate-200 pt-4'>
              <h3 className='text-lg font-semibold mb-2 text-slate-900'>
                About this testimony
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

          {testimony.tags && testimony.tags.length > 0 && (
            <div className='border-t border-slate-200 pt-4 mt-4'>
              <h4 className='text-sm font-semibold mb-2 text-slate-900'>Tags</h4>
              <div className='flex flex-wrap gap-2'>
                {testimony.tags.map((tag, index) => (
                  <span
                    key={index}
                    className='px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function HJTestimoniesPage() {
  const [testimonies, setTestimonies] = useState<TestimonyVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTestimony, setSelectedTestimony] = useState<TestimonyVideo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulate loading and use placeholder data for now
    setTimeout(() => {
      setTestimonies(placeholderTestimonies)
      setLoading(false)
    }, 1000)
  }, [])

  const openTestimonyModal = (testimony: TestimonyVideo) => {
    setSelectedTestimony(testimony)
    setIsModalOpen(true)
  }

  const closeTestimonyModal = () => {
    setSelectedTestimony(null)
    setIsModalOpen(false)
  }

  // Filter testimonies by category
  const personalTestimonies = testimonies.filter(t => t.category === 'personal')
  const familyTestimonies = testimonies.filter(t => t.category === 'family')
  const ministryTestimonies = testimonies.filter(t => t.category === 'ministry')
  const blessingTestimonies = testimonies.filter(t => t.category === 'blessing')

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-pulse'>
            <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 rounded-full mx-auto mb-4'></div>
          </div>
          <p className='text-slate-700 text-lg'>Loading HJ Testimonies...</p>
        </div>
      </div>
    )
  }

  if (testimonies.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-slate-900'>
          <Mic className='w-24 h-24 text-slate-400 mx-auto mb-4' />
          <h2 className='text-2xl font-semibold mb-2'>No Testimonies Available</h2>
          <p className='text-slate-600'>
            Personal stories and testimonies will appear here once they are added.
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
          src='/church-community-gathering.png'
          alt='HJ Testimonies Banner'
          fill
          className='object-cover'
          priority
        />

        {/* Readability + color wash overlays */}
        <div className='pointer-events-none absolute inset-0 z-0'>
          {/* Base dark vignette for contrast */}
          <div className='absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/60 to-slate-950/90' />
          {/* Colorful radial washes (emerald/green theme for testimonies) */}
          <div className='absolute inset-0 opacity-60 [background:radial-gradient(720px_360px_at_85%_0%,rgba(34,197,94,0.18),transparent_60%),radial-gradient(820px_400px_at_0%_100%,rgba(168,85,247,0.16),transparent_60%)]' />
        </div>
        {/* Soft brand glows */}
        <div className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-tr from-emerald-400/20 to-green-400/12' />
        <div className='pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full blur-3xl bg-gradient-to-tr from-purple-400/15 to-blue-400/8' />

        <div className='relative container mx-auto px-4 md:px-6 py-14 md:py-16'>
          <div className='relative z-10 mx-auto max-w-5xl space-y-7'>
            {/* Eyebrow */}
            <p className='mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white/90 ring-1 ring-white/30 backdrop-blur-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]'>
              <Mic className='w-4 h-4' />
              Testimonies • Personal Stories & Faith
            </p>

            {/* Title */}
            <div className='space-y-3 text-left'>
              <HighlightTitle
                as='h1'
                text='HJ Testimonies'
                highlightedText='HJ Testimonies'
                uppercase={true}
                className='text-3xl md:text-5xl font-extrabold leading-tight tracking-wide text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.7)] whitespace-normal break-words text-balance'
                gradientClassName='bg-gradient-to-r from-emerald-400 via-green-300 to-purple-400 bg-clip-text text-transparent [text-shadow:0_0_20px_rgba(34,197,94,0.6)]'
              />

              <p className='text-base md:text-lg text-white/95 max-w-3xl leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]'>
                Hear powerful personal stories of faith, transformation, and divine love. 
                These heartfelt testimonies share experiences of finding purpose, building 
                ideal families, and living lives centered on Heavenly Parent&apos;s love.
              </p>
            </div>

            {/* CTA */}
            <div className='flex flex-col items-start justify-start gap-3 sm:flex-row sm:gap-4'>
              <Button
                asChild
                className='bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 ring-1 ring-white/10 shadow-[0_8px_30px_rgba(34,197,94,0.35)] text-base sm:text-base px-6 hover:shadow-[0_8px_30px_rgba(34,197,94,0.45)] transition-all duration-300'
              >
                <a
                  href='#testimonies'
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('testimonies')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className='inline-flex items-center gap-2'>
                    <Play className='w-5 h-5' />
                    Watch Testimonies
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimony Rows */}
      <div id='testimonies' className='py-16 bg-gray-50'>
        <div className='container mx-auto'>
          {personalTestimonies.length > 0 && (
            <TestimonyRow
              title='Personal Transformation'
              testimonies={personalTestimonies}
              onTestimonySelect={openTestimonyModal}
            />
          )}

          {blessingTestimonies.length > 0 && (
            <TestimonyRow
              title='Blessing & Marriage'
              testimonies={blessingTestimonies}
              onTestimonySelect={openTestimonyModal}
            />
          )}

          {familyTestimonies.length > 0 && (
            <TestimonyRow
              title='Family Life'
              testimonies={familyTestimonies}
              onTestimonySelect={openTestimonyModal}
            />
          )}

          {ministryTestimonies.length > 0 && (
            <TestimonyRow
              title='Ministry & Service'
              testimonies={ministryTestimonies}
              onTestimonySelect={openTestimonyModal}
            />
          )}
        </div>
      </div>

      <TestimonyModal
        testimony={selectedTestimony}
        isOpen={isModalOpen}
        onClose={closeTestimonyModal}
      />
    </div>
  )
}
