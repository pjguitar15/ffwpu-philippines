"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Mail, Eye, Filter, Lock, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PAPER_COLORS } from '@/constants/letter-to-true-mother'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { resourceLimits } from 'worker_threads'

interface Letter {
  _id: string
  name: string
  region: string
  content: string
  createdAt: string
  color: string
  rotation: number
  position: { x: number; y: number }
  isPublic: boolean
}

function LetterCard({
  letter,
  index,
  onClick,
}: {
  letter: Letter
  index: number
  onClick: (letter: Letter) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Generate a consistent random rotation for each letter based on its ID
  const rotation = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return (hash % 5) - 2 // Random rotation between -2 and 2 degrees for subtle poster effect
  }, [letter._id])

  // Get a random pastel color from PAPER_COLORS constant
  const pastelColor = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return PAPER_COLORS[Math.abs(hash) % PAPER_COLORS.length]
  }, [letter._id])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        delay: index * 0.02,
        duration: 0.3,
        ease: 'easeOut',
      }}
      className='cursor-pointer w-full max-w-xs'
      onClick={() => onClick(letter)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`${pastelColor} border-2 transition-all duration-200 ease-out relative ${
          isHovered ? 'shadow-lg scale-105 -translate-y-1' : 'shadow-md'
        }`}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Privacy indicator */}
        <div className='absolute top-2 right-2 z-10'>
          {letter.isPublic ? (
            <Badge
              variant='secondary'
              className='bg-green-100 text-green-800 border-green-300'
            >
              <Globe className='w-3 h-3 mr-1' />
              Public
            </Badge>
          ) : (
            <Badge
              variant='secondary'
              className='bg-amber-100 text-amber-800 border-amber-300'
            >
              <Lock className='w-3 h-3 mr-1' />
              Private
            </Badge>
          )}
        </div>

        {/* Corner fold effect */}
        <div className='absolute top-0 right-0 w-5 h-5 bg-white opacity-40 transform rotate-45 translate-x-2.5 -translate-y-2.5'></div>

        {/* Paper tape effect - realistic positioning */}
        <div
          className='absolute w-12 h-6 bg-white/70 opacity-90 shadow-sm border border-gray-200/50'
          style={{
            top: '-8px',
            left: '20%',
            transform: `rotate(${rotation * 0.5}deg)`,
          }}
        >
          {/* Tape texture lines */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-full h-px bg-gray-200/30'></div>
          </div>
        </div>

        <CardContent className='p-4 flex flex-col relative'>
          {/* Enhanced dot pattern for note-like texture */}
          <div className='absolute inset-0 opacity-3 pointer-events-none'>
            <div className='grid grid-cols-10 gap-3 h-full w-full p-4'>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className='w-1 h-1 bg-gray-500 rounded-full'></div>
              ))}
            </div>
          </div>

          {/* Handwritten note header */}
          <div className='relative z-10 mb-2'>
            <p className='text-xs font-handwriting text-gray-500 italic text-center'>
              Dear True Mother,
            </p>
          </div>

          {/* Message content - main area */}
          <div className='flex-1 overflow-hidden relative z-10 mb-2'>
            <p className='text-sm text-gray-800 font-handwriting leading-relaxed line-clamp-3 font-medium'>
              "{letter.content}"
            </p>
          </div>

          {/* Signature section */}
          <div className='relative z-10 mt-auto'>
            <div className='text-right mb-1'>
              <p className='text-xs font-handwriting text-gray-600 italic'>
                With love,
              </p>
            </div>

            {/* Author signature area */}
            <div className='space-y-1 border-t border-gray-300/50 pt-1'>
              <div className='flex items-center justify-between'>
                <p className='text-xs font-bold text-gray-700 font-handwriting flex items-center gap-1'>
                  💝 {letter.name}
                </p>
                <p className='text-xs text-gray-500 font-handwriting'>
                  {new Date(letter.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit',
                  })}
                </p>
              </div>
              <p className='text-xs text-gray-600 font-handwriting flex items-center gap-1'>
                📍 {letter.region}
              </p>
            </div>
          </div>

          {/* Heart decoration */}
          <div className='absolute top-3 right-8 opacity-20'>
            <span className='text-red-400 text-lg'>💕</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ViewLetterModal({
  letter,
  isOpen,
  onClose,
}: {
  letter: Letter | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!letter) return null

  // Get same pastel color logic as letter card
  const pastelColor = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return PAPER_COLORS[Math.abs(hash) % PAPER_COLORS.length]
  }, [letter._id])

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key='view-letter-modal'>
          {/* Blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm cursor-pointer'
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className='fixed inset-0 z-[9999] flex items-center justify-center p-4'
          >
            {/* Note-style modal */}
            <div
              className={`${pastelColor} border-2 shadow-2xl rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative cursor-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Privacy indicator */}
              <div className='absolute top-4 left-4 z-20'>
                {letter.isPublic ? (
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-800 border-green-300'
                  >
                    <Globe className='w-3 h-3 mr-1' />
                    Public Letter
                  </Badge>
                ) : (
                  <Badge
                    variant='secondary'
                    className='bg-amber-100 text-amber-800 border-amber-300'
                  >
                    <Lock className='w-3 h-3 mr-1' />
                    Private Letter
                  </Badge>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className='absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-gray-300 hover:border-gray-400 transition-all duration-200 group cursor-pointer'
              >
                <span className='text-gray-600 group-hover:text-gray-800 text-xl'>
                  ×
                </span>
              </button>

              {/* Letter content */}
              <div className='p-8 pr-16'>
                <div className='mb-6'>
                  <p className='text-right text-lg font-handwriting text-gray-600 mb-4'>
                    {new Date(letter.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className='text-2xl font-handwriting text-gray-800 mb-6'>
                    Dear True Mother,
                  </p>
                </div>

                <div className='mb-6'>
                  <p className='text-xl font-handwriting text-gray-800 leading-relaxed whitespace-pre-wrap'>
                    {letter.content}
                  </p>
                </div>

                <div className='mt-8'>
                  <p className='text-xl font-handwriting text-gray-800 mb-4'>
                    With love and respect,
                  </p>
                  <div className='text-right'>
                    <p className='text-xl font-handwriting text-gray-800 font-semibold'>
                      💝 {letter.name}
                    </p>
                    <p className='text-base text-gray-500 font-handwriting'>
                      📍 {letter.region}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  )
}

export default function AdminLettersPage() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [filteredLetters, setFilteredLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [privacyFilter, setPrivacyFilter] = useState<
    'all' | 'public' | 'private'
  >('all')
  const [viewingLetter, setViewingLetter] = useState<Letter | null>(null)

  // Fetch all letters
  const fetchLetters = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/letters')
      const result = await response.json()

      if (result.success) {
        setLetters(result.data)
      } else {
        console.error('Failed to fetch letters:', result.error)
      }
    } catch (error) {
      console.error('Error fetching letters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLetters()
  }, [])

  // Filter letters based on search and privacy filter
  useEffect(() => {
    let filtered = letters

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (letter) =>
          letter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          letter.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply privacy filter
    if (privacyFilter !== 'all') {
      filtered = filtered.filter((letter) =>
        privacyFilter === 'public' ? letter.isPublic : !letter.isPublic,
      )
    }

    setFilteredLetters(filtered)
  }, [letters, searchTerm, privacyFilter])

  const handleViewLetter = (letter: Letter) => {
    setViewingLetter(letter)
  }

  const publicCount = letters.filter((l) => l.isPublic).length
  const privateCount = letters.filter((l) => !l.isPublic).length

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <AdminSidebar />

      <main className='flex-1 p-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Letters to True Mother
            </h1>
            <p className='text-gray-600'>
              View and manage all heartfelt messages sent to True Mother
            </p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Letters
                </CardTitle>
                <Mail className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{letters.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Public Letters
                </CardTitle>
                <Globe className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>
                  {publicCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Private Letters
                </CardTitle>
                <Lock className='h-4 w-4 text-amber-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-amber-600'>
                  {privateCount}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Search letters by name, region, or content...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select
              value={privacyFilter}
              onValueChange={(value: 'all' | 'public' | 'private') =>
                setPrivacyFilter(value)
              }
            >
              <SelectTrigger className='w-full sm:w-48'>
                <Filter className='h-4 w-4 mr-2' />
                <SelectValue placeholder='Filter by privacy' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Letters</SelectItem>
                <SelectItem value='public'>Public Only</SelectItem>
                <SelectItem value='private'>Private Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Letters Grid */}
          <div className='bg-white rounded-lg border p-6'>
            {isLoading ? (
              <div className='flex justify-center items-center py-20'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              </div>
            ) : filteredLetters.length === 0 ? (
              <div className='text-center py-20'>
                <Mail className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <p className='text-gray-500 font-handwriting text-xl'>
                  {searchTerm || privacyFilter !== 'all'
                    ? 'No letters match your filters.'
                    : 'No letters yet. Letters will appear here once they are submitted.'}
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'>
                {filteredLetters.map((letter, index) => (
                  <LetterCard
                    key={letter._id}
                    letter={letter}
                    index={index}
                    onClick={handleViewLetter}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View Letter Modal */}
        <ViewLetterModal
          letter={viewingLetter}
          isOpen={!!viewingLetter}
          onClose={() => setViewingLetter(null)}
        />
      </main>
    </div>
  )
}