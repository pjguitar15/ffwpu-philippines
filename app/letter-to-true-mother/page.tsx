'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { ClientMetadata } from '@/components/seo/client-metadata'
import { pageMetadataConfigs } from '@/lib/metadata'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Heart,
  Plus,
  Mail,
  PenTool,
  Sparkles,
  Send,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { LETTER_CONFIG, PAPER_COLORS } from '../../constants/letter-to-true-mother'
import { useToast } from '@/hooks/use-toast'
import './styles.css'

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
        delay: index * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      }}
      className='cursor-pointer w-full'
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

        <CardContent className='p-4 h-full flex flex-col relative overflow-hidden'>
          {/* Horizontal lines for notebook paper effect */}
          <div className='absolute inset-0 pointer-events-none'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='absolute w-full h-px bg-blue-300/50'
                style={{
                  top: `${20 + i * 14}px`,
                  left: '16px',
                  right: '16px',
                }}
              />
            ))}
          </div>

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
            <p className='text-xs text-gray-800 font-handwriting leading-relaxed line-clamp-3 font-medium break-words'>
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
                <p className='text-xs font-bold text-gray-700 font-handwriting flex items-center gap-1 truncate'>
                  💝 <span className='truncate'>{letter.name}</span>
                </p>
                <p className='text-xs text-gray-500 font-handwriting flex-shrink-0'>
                  {new Date(letter.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit',
                  })}
                </p>
              </div>
              <p className='text-xs text-gray-600 font-handwriting flex items-center gap-1 truncate'>
                📍 <span className='truncate'>{letter.region}</span>
              </p>
            </div>
          </div>

          {/* Heart decoration */}
          <div className='absolute top-3 right-8 opacity-20'>
            <span className='text-red-400 text-lg'>💕</span>
          </div>

          {/* Small decorative elements */}
          <div className='absolute bottom-3 left-3 opacity-10'>
            <div className='flex gap-1'>
              <div className='w-1 h-1 bg-pink-400 rounded-full' />
              <div className='w-1 h-1 bg-blue-400 rounded-full' />
              <div className='w-1 h-1 bg-purple-400 rounded-full' />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AddLetterModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    letter: Omit<
      Letter,
      '_id' | 'createdAt' | 'color' | 'rotation' | 'position'
    >,
  ) => Promise<void>
  isSubmitting?: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    content: '',
    isPublic: true,
  })
  const [wordCount, setWordCount] = useState(0)

  const handleContentChange = (value: string) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    if (words.length <= LETTER_CONFIG.MAX_WORDS) {
      setFormData((prev) => ({ ...prev, content: value }))
      setWordCount(words.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.name &&
      formData.region &&
      formData.content &&
      wordCount <= LETTER_CONFIG.MAX_WORDS
    ) {
      await onSubmit(formData)
      // Reset form only if submission was successful (modal will close)
      setFormData({ name: '', region: '', content: '', isPublic: true })
      setWordCount(0)
    }
  }

  // Get a soft pink pastel color for the notepad
  const noteColor = useMemo(() => {
    return 'bg-pink-50' // Use a pink pastel color like a notepad
  }, [])

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <React.Fragment key='add-letter-modal'>
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
            className='fixed inset-0 z-[9999] flex items-center justify-center p-0 lg:p-4'
          >
            {/* Note-style modal */}
            <div
              className={`${noteColor} overflow-y-scroll max-h-[90vh] relative cursor-auto shadow-lg letter-modal-scroll`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner fold effect */}
              <div className='absolute top-0 right-0 w-6 h-6 bg-white opacity-40 transform rotate-45 translate-x-3 -translate-y-3'></div>

              {/* Close button (X) */}
              <button
                onClick={onClose}
                className='absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-gray-300 hover:border-gray-400 transition-all duration-200 group cursor-pointer'
              >
                <svg
                  className='w-5 h-5 text-gray-600 group-hover:text-gray-800'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

              {/* Horizontal lines for lined paper effect */}
              <div className='absolute inset-0 pointer-events-none'>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className='absolute w-full h-px bg-blue-300/40'
                    style={{
                      top: `${60 + i * 24}px`,
                      left: '32px',
                      right: '32px',
                    }}
                  />
                ))}
                {/* Red margin line */}
                <div
                  className='absolute h-full w-px bg-red-300/50'
                  style={{
                    left: '80px',
                    top: '60px',
                    bottom: '60px',
                  }}
                />
              </div>

              {/* Subtle dot pattern background */}
              <div className='absolute inset-0 opacity-5 pointer-events-none rounded-lg overflow-hidden'>
                <div className='grid grid-cols-12 gap-4 h-full w-full p-6'>
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div
                      key={i}
                      className='w-1 h-1 bg-gray-400 rounded-full'
                    ></div>
                  ))}
                </div>
              </div>

              <div className='relative z-10 p-4 lg:p-8'>
                {/* Header */}
                <div className='text-center mb-4 md:mb-8'>
                  <h2 className='text-xl md:text-3xl font-handwriting font-bold text-gray-800 mb-1 md:mb-2'>
                    Write to True Mother
                  </h2>
                  <p className='text-sm md:text-lg font-handwriting text-gray-600 italic'>
                    Share your heartfelt message of love and encouragement
                  </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Letter format with handwritten styling */}
                  <div className='p-6 space-y-5'>
                    {/* Date line */}
                    <div className='text-right'>
                      <p className='text-base font-handwriting text-gray-600'>
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Greeting */}
                    <div>
                      <p className='text-lg font-handwriting text-gray-800 mb-4'>
                        Dear True Mother,
                      </p>
                    </div>

                    {/* Message content */}
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <label className='text-sm font-handwriting text-gray-600 italic'>
                          Your heartfelt message:
                        </label>
                        <span
                          className={`text-xs font-handwriting ${
                            wordCount > LETTER_CONFIG.MAX_WORDS
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {wordCount}/{LETTER_CONFIG.MAX_WORDS} words
                        </span>
                      </div>
                      <Textarea
                        id='content'
                        value={formData.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder='I want to tell you how much you mean to me...'
                        className='min-h-[140px] bg-white/80 border border-gray-200 rounded-lg resize-none font-handwriting text-lg text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 p-4'
                        required
                      />
                    </div>

                    {/* Signature section */}
                    <div className='pt-4 space-y-3'>
                      <p className='text-lg font-handwriting text-gray-800'>
                        With love and respect,
                      </p>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <Input
                            id='name'
                            type='text'
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder='Your name'
                            className='bg-white/80 border border-gray-200 rounded-lg font-handwriting text-lg text-gray-800 focus:border-gray-400 focus:ring-1 focus:ring-gray-300 placeholder-gray-400 px-3 py-2'
                            required
                          />
                        </div>
                        <div>
                          <Input
                            id='region'
                            type='text'
                            value={formData.region}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                region: e.target.value,
                              }))
                            }
                            placeholder='Your region/province'
                            className='bg-white/80 border border-gray-200 rounded-lg font-handwriting text-lg text-gray-800 focus:border-gray-400 focus:ring-1 focus:ring-gray-300 placeholder-gray-400 px-3 py-2'
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Options */}
                  <div className='p-4 space-y-3'>
                    <h3 className='text-lg font-handwriting text-gray-800 font-semibold'>
                      Letter Visibility
                    </h3>
                    <p className='text-sm font-handwriting text-gray-600 italic'>
                      Choose how you'd like to share your letter:
                    </p>

                    <div className='space-y-3'>
                      <label className='flex items-center gap-3 cursor-pointer group'>
                        <input
                          type='radio'
                          name='privacy'
                          value='public'
                          checked={formData.isPublic}
                          onChange={() =>
                            setFormData((prev) => ({ ...prev, isPublic: true }))
                          }
                          className='w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500 focus:ring-2'
                        />
                        <div className='flex-1'>
                          <div className='text-base font-handwriting text-gray-800 group-hover:text-gray-900 transition-colors'>
                            🌟 Post in Public
                          </div>
                          <div className='text-sm font-handwriting text-gray-600'>
                            Share your love with everyone - inspire others with
                            your heartfelt message
                          </div>
                        </div>
                      </label>

                      <label className='flex items-center gap-3 cursor-pointer group'>
                        <input
                          type='radio'
                          name='privacy'
                          value='private'
                          checked={!formData.isPublic}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              isPublic: false,
                            }))
                          }
                          className='w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500 focus:ring-2'
                        />
                        <div className='flex-1'>
                          <div className='text-base font-handwriting text-gray-800 group-hover:text-gray-900 transition-colors'>
                            🔒 Keep It Private
                          </div>
                          <div className='text-sm font-handwriting text-gray-600'>
                            Only for True Mother's eyes - a personal message
                            just between you two
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className='flex gap-4 pt-6'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={onClose}
                      className='flex-1 font-handwriting border-gray-400 hover:bg-gray-50 text-gray-700 cursor-pointer bg-white/80'
                    >
                      Maybe Later
                    </Button>
                    <Button
                      type='submit'
                      className='flex-1 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-handwriting cursor-pointer shadow-lg hover:shadow-xl'
                      disabled={
                        !formData.name ||
                        !formData.region ||
                        !formData.content ||
                        wordCount > LETTER_CONFIG.MAX_WORDS ||
                        isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <div className='w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent' />
                          Sending with Love...
                        </>
                      ) : (
                        <>
                          <Send className='w-4 h-4 mr-2' />
                          Send My Letter
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Small corner decoration */}
                <div className='absolute bottom-6 right-6 opacity-15'>
                  <div className='w-4 h-4 bg-gray-400 rounded-full' />
                </div>
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
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

  // Slight rotation for the modal
  const rotation = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return (hash % 3) - 1 // Random rotation between -1 and 1 degrees
  }, [letter._id])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal container with backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm cursor-pointer'
            onClick={onClose}
          >
            {/* Note-style modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`${pastelColor} max-w-2xl overflow-x-hidden relative cursor-auto rounded-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button (X) */}
              <button
                onClick={onClose}
                className='absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-gray-300 hover:border-gray-400 transition-all duration-200 group cursor-pointer'
              >
                <svg
                  className='w-5 h-5 text-gray-600 group-hover:text-gray-800'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

              {/* Horizontal lines for lined paper effect */}
              <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className='absolute w-full h-px bg-blue-300/40'
                    style={{
                      top: `${60 + i * 24}px`,
                      left: '32px',
                      right: '32px',
                    }}
                  />
                ))}
                {/* Red margin line */}
                <div
                  className='absolute h-full w-px bg-red-300/50'
                  style={{
                    left: '80px',
                    top: '60px',
                    bottom: '60px',
                  }}
                />
              </div>

              {/* Subtle dot pattern background */}
              <div className='absolute inset-0 opacity-5 pointer-events-none rounded-lg overflow-hidden'>
                <div className='grid grid-cols-12 gap-4 h-full w-full'>
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div
                      key={i}
                      className='w-1 h-1 bg-gray-400 rounded-full'
                    ></div>
                  ))}
                </div>
              </div>

              <div className='relative z-10 p-5'>
                <div className='text-center mb-8'>
                  <h2 className='text-3xl font-handwriting font-bold text-gray-800 mb-3'>
                    Letter from {letter.name}
                  </h2>
                  <div className='space-y-2'>
                    <p className='text-lg text-gray-600 font-handwriting flex items-center justify-center gap-2'>
                      <span className='text-green-500'>📍</span>
                      From {letter.region}
                    </p>
                    <p className='text-base text-gray-500 font-handwriting'>
                      📅{' '}
                      {new Date(letter.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className='max-h-[50vh] overflow-y-scroll w-full letter-modal-scroll'>
                  <p className='text-xl text-gray-800 font-handwriting leading-relaxed whitespace-pre-wrap'>
                    {letter.content}
                  </p>
                </div>

                <div className='absolute bottom-6 right-6 opacity-15'>
                  <div className='w-4 h-4 bg-gray-400 rounded-full' />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function LetterToTrueMotherPage() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewingLetter, setViewingLetter] = useState<Letter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Debug function to track state changes
  const handleViewLetter = (letter: Letter) => {
    console.log('Setting viewing letter:', letter.name)
    setViewingLetter(letter)
  }

  // Fetch letters from API
  const fetchLetters = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/letters-to-tm')
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

  // Load letters on component mount
  useEffect(() => {
    fetchLetters()
  }, [])

  const handleAddLetter = async (
    letterData: Omit<
      Letter,
      '_id' | 'createdAt' | 'color' | 'rotation' | 'position'
    >,
  ) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/letters-to-tm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(letterData),
      })

      const result = await response.json()

      if (result.success) {
        // Convert to boolean to ensure proper comparison
        const isPublic = Boolean(result.data.isPublic)

        // Only add public letters to the displayed letters
        if (isPublic) {
          setLetters((prev) => [result.data, ...prev])
        } else {
          // Show toast for private letters
          toast({
            title: '💌 Letter Sent Privately',
            description:
              'Your heartfelt message has been sent directly to True Mother. Thank you for sharing your love.',
            duration: 5000,
          })
        }
        setIsModalOpen(false)
      } else {
        console.error('Failed to create letter:', result.error)
        // You can add error handling here if needed
      }
    } catch (error) {
      console.error('Error creating letter:', error)
      // You can add error handling here if needed
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ClientMetadata config={pageMetadataConfigs.letterToTrueMother} />
      <div className='bg-white'>
        {/* Header Section */}
        <section className='relative overflow-hidden py-16'>
          {/* Floating elements removed for clean design */}

          <div className='container mx-auto px-4 md:px-6'>
            <div className='flex flex-col lg:flex-row items-center justify-between gap-8 py-5 md:py-14'>
              {/* Text Content - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='flex-1 text-center lg:text-left space-y-6 z-20'
              >
                {/* Title */}
                <div className='flex items-center justify-center lg:justify-start gap-3 mb-4'>
                  <span className='text-4xl'>🌸</span>
                  <HighlightTitle
                    as='h1'
                    text='Letters to True Mother'
                    highlightedText='True Mother'
                    className='text-3xl md:text-5xl lg:text-6xl font-handwriting font-bold text-gray-800'
                    gradientClassName='bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent'
                  />
                  <span className='text-4xl'>🌸</span>
                </div>

                <p className='text-lg md:text-xl text-gray-700 max-w-2xl lg:max-w-none lg:w-3/4 font-handwriting leading-relaxed'>
                  Send your heartfelt messages of love, support, and
                  encouragement to our beloved True Mother. <br />
                  Your words of comfort bring strength and hope. 🌸💕
                </p>

                <motion.div>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    size='lg'
                    className='bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:from-rose-500 hover:via-pink-500 hover:to-purple-500 text-white font-handwriting text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-transform duration-200 cursor-pointer hover:scale-105'
                  >
                    <PenTool className='w-5 h-5 mr-2' />
                    Write a Letter
                    <span className='ml-2 text-lg'>🌸</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* True Mother Image - Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className='absolute top-0 right-0 flex-shrink-0 hidden lg:block z-10'
              >
                <div className='relative'>
                  <Image
                    src='/letter-to-tm-bg.webp'
                    alt='True Mother'
                    width={880}
                    height={280}
                    className='object-cover rounded-lg opacity-80'
                  />
                  {/* Fade effect at bottom */}
                  <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg'></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className='absolute top-0 left-0 flex-shrink-0 z-10'
              >
                <div className='relative'>
                  <Image
                    src='/cwg-pattern.webp'
                    alt='True Mother'
                    width={880}
                    height={280}
                    className='object-cover rounded-lg opacity-30'
                  />
                  {/* Fade effect at bottom */}
                  <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg'></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Letters Collage Section */}
        <section className='pb-16 pt-12'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-items-center'>
              {isLoading
                ? // Loading state - Note-style skeletons
                  Array.from({ length: 8 }).map((_, index) => {
                    // Get a random color and rotation for each skeleton
                    const skeletonColor =
                      PAPER_COLORS[index % PAPER_COLORS.length]
                    const skeletonRotation = (index % 5) - 2 // Random rotation like real cards

                    return (
                      <div
                        key={index}
                        className={`w-64 h-32 ${skeletonColor} border-2 rounded-lg shadow-md relative animate-pulse`}
                        style={{
                          transform: `rotate(${skeletonRotation}deg)`,
                        }}
                      >
                        {/* Paper tape effect */}
                        <div
                          className='absolute w-12 h-6 bg-white/70 opacity-90 shadow-sm border border-gray-200/50'
                          style={{
                            top: '-8px',
                            left: '20%',
                            transform: `rotate(${skeletonRotation * 0.5}deg)`,
                          }}
                        >
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-full h-px bg-gray-200/30'></div>
                          </div>
                        </div>

                        {/* Skeleton content */}
                        <div className='p-4 h-full flex flex-col relative'>
                          {/* Header skeleton */}
                          <div className='mb-3 text-center'>
                            <div className='h-3 bg-gray-300/50 rounded w-24 mx-auto'></div>
                          </div>

                          {/* Content skeleton */}
                          <div className='flex-1 space-y-2 mb-3'>
                            <div className='h-3 bg-gray-300/50 rounded w-full'></div>
                            <div className='h-3 bg-gray-300/50 rounded w-5/6'></div>
                            <div className='h-3 bg-gray-300/50 rounded w-4/6'></div>
                          </div>

                          {/* Signature skeleton */}
                          <div className='mt-auto'>
                            <div className='text-right mb-2'>
                              <div className='h-2 bg-gray-300/50 rounded w-16 ml-auto'></div>
                            </div>
                            <div className='border-t border-gray-300/50 pt-2'>
                              <div className='flex items-center justify-between'>
                                <div className='h-3 bg-gray-300/50 rounded w-16'></div>
                                <div className='h-2 bg-gray-300/50 rounded w-12'></div>
                              </div>
                              <div className='h-2 bg-gray-300/50 rounded w-20 mt-1'></div>
                            </div>
                          </div>

                          {/* Heart decoration */}
                          <div className='absolute top-3 right-8 opacity-20'>
                            <div className='w-4 h-4 bg-gray-300/50 rounded-full'></div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                : letters.map((letter, index) => (
                    <LetterCard
                      key={letter._id}
                      letter={letter}
                      index={index}
                      onClick={handleViewLetter}
                    />
                  ))}

              {/* Add Note Card - Only show when not loading */}
              {!isLoading && (
                <div
                  onClick={() => setIsModalOpen(true)}
                  className='w-64 h-32 bg-gray-100 border-2 border-gray-200 border-dashed rounded-lg shadow-md relative cursor-pointer transition-all duration-200 ease-out hover:bg-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-105 group'
                  style={{
                    transform: 'rotate(1deg)',
                  }}
                >
                  {/* Paper tape effect */}
                  <div
                    className='absolute w-12 h-6 bg-white/70 opacity-90 shadow-sm border border-gray-200/50'
                    style={{
                      top: '-8px',
                      left: '20%',
                      transform: 'rotate(0.5deg)',
                    }}
                  >
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='w-full h-px bg-gray-200/30'></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-4 h-full flex flex-col items-center justify-center relative'>
                    {/* Plus icon */}
                    <div className='mb-2 text-gray-400 group-hover:text-gray-600 transition-colors duration-200'>
                      <svg
                        width='32'
                        height='32'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <line x1='12' y1='5' x2='12' y2='19'></line>
                        <line x1='5' y1='12' x2='19' y2='12'></line>
                      </svg>
                    </div>

                    {/* Text */}
                    <p className='text-sm font-handwriting text-gray-500 group-hover:text-gray-700 transition-colors duration-200 text-center'>
                      Write a Letter
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && letters.length === 0 && (
                <div className='col-span-full text-center py-20'>
                  <Mail className='w-24 h-24 text-gray-300 mx-auto mb-4' />
                  <p className='text-gray-500 font-handwriting text-xl'>
                    No letters yet. Be the first to write to True Mother! 💌
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <AddLetterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddLetter}
          isSubmitting={isSubmitting}
        />

        {/* View Letter Modal */}
        <ViewLetterModal
          letter={viewingLetter}
          isOpen={!!viewingLetter}
          onClose={() => setViewingLetter(null)}
        />
      </div>
    </>
  )
}