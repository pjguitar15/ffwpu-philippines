'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent 
} from '@/components/ui/dialog'
import { PlayCircle, ExternalLink, Play, Info, Plus, Check } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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
  onVideoSelect 
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
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 px-12">
        {title}
      </h2>
      
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-12 pb-4 scroll-smooth"
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
              className="relative flex-shrink-0 w-80 cursor-pointer group"
              onHoverStart={() => setHoveredVideo(video._id)}
              onHoverEnd={() => setHoveredVideo(null)}
              onClick={() => onVideoSelect(video)}
            >
              <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:z-10 group-hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
                    
                    <AnimatePresence>
                      {hoveredVideo === video._id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <h3 className="text-gray-900 font-semibold text-md line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    
                    {video.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {video.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-1"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        HJ Media Works
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Scroll indicators */}
        <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
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
  if (!video) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        // override default narrow max-width + remove padding
        className='
          p-0 bg-white border border-gray-200 overflow-hidden
          sm:max-w-[92vw] md:max-w-4xl lg:max-w-6xl
          w-[92vw] md:w-auto
        '
      >
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
        <div className='p-6 bg-white text-gray-900'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex-1'>
              <h2 className='text-xl md:text-2xl font-bold mb-3 text-gray-900'>
                {video.title}
              </h2>

              <div className='flex flex-wrap items-center gap-3 mb-2'>
                <Button className='bg-gray-900 text-white hover:bg-gray-800'>
                  <Play className='w-4 h-4 mr-2 fill-current' />
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Play on YouTube
                  </a>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='border-gray-300 text-gray-900 hover:bg-gray-50'
                >
                  <a
                    href={`https://www.youtube.com/@HJMediaWorks`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <ExternalLink className='w-4 h-4 mr-2' />
                    Visit HJ Media Works
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {video.description && (
            <div className='border-t border-gray-200 pt-4'>
              <h3 className='text-lg font-semibold mb-2 text-gray-900'>
                About this video
              </h3>
              <p className='text-gray-700 leading-relaxed'>
                {video.description}
              </p>
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
        const activeVideos = data.filter((video: YouTubeVideo) => video.isActive)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4"></div>
          </div>
          <p className="text-gray-700 text-lg">Loading HJ Media Works...</p>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-900">
          <PlayCircle className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Content Available</h2>
          <p className="text-gray-600">Videos will appear here once they are added.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <div className='relative overflow-hidden'>
        <Image
          src='/hj-media-works-banner.jpg'
          alt='HJ Media Works Banner'
          fill
          className='object-cover'
          priority
        />
        {/* Gradient overlay: dark on left → transparent by ~80% */}
        <div className='absolute inset-0 bg-gradient-to-r from-blue-900/90 from-100% lg:from-40% lg:to-pink-500/70 to-[80%]' />

        <div className='relative container mx-auto px-4 py-16'>
          <div className='space-y-6'>
            <div className='space-y-3 text-left'>
              <div className='inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-white'>
                <Image
                  src='/hj-media-works.jpg'
                  alt='HJ Media Works'
                  width={24}
                  height={24}
                  className='rounded'
                />
                Media • Inspiration & Growth
              </div>

              <h1 className='text-3xl md:text-5xl font-bold uppercase text-start'>
                <span className='text-white'>HJ </span>
                <span className='text-white'>
                  Media Works
                </span>
              </h1>
            </div>

            <p className='text-lg text-white/90 max-w-3xl leading-relaxed'>
              Discover our collection of inspiring videos that share messages of
              hope, love, and spiritual growth. Join us on a journey of faith
              and transformation through meaningful content that touches hearts
              and changes lives.
            </p>

            <Button
              asChild
              className='bg-red-600 hover:bg-red-700 px-10 py-5 text-md font-semibold shadow-lg'
            >
              <a
                href='https://www.youtube.com/@HJMediaWorks'
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='w-5 h-5 mr-2' />
                Subscribe on YouTube
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Video Rows */}
      <div className='py-16 bg-gray-50'>
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

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={closeVideoModal}
      />
    </div>
  )
}
