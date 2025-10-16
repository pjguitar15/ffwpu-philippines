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
}

function LetterCard({ letter, index, onClick }: { letter: Letter; index: number; onClick: (letter: Letter) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Generate a consistent random rotation for each letter based on its ID
  const rotation = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return (hash % 5) - 2; // Random rotation between -2 and 2 degrees for subtle poster effect
  }, [letter._id]);

  // Get a random pastel color from PAPER_COLORS constant
  const pastelColor = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return PAPER_COLORS[Math.abs(hash) % PAPER_COLORS.length];
  }, [letter._id]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1
      }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut"
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
        <div className="absolute top-0 right-0 w-5 h-5 bg-white opacity-40 transform rotate-45 translate-x-2.5 -translate-y-2.5"></div>
        
        {/* Paper tape effect - realistic positioning */}
        <div 
          className="absolute w-12 h-6 bg-white/70 opacity-90 shadow-sm border border-gray-200/50"
          style={{
            top: '-8px',
            left: '20%',
            transform: `rotate(${rotation * 0.5}deg)`
          }}
        >
          {/* Tape texture lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-gray-200/30"></div>
          </div>
        </div>
        
        <CardContent className='p-4 h-full flex flex-col relative'>
          {/* Enhanced dot pattern for note-like texture */}
          <div className="absolute inset-0 opacity-3 pointer-events-none">
            <div className="grid grid-cols-10 gap-3 h-full w-full p-4">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-500 rounded-full"></div>
              ))}
            </div>
          </div>
          
          {/* Handwritten note header */}
          <div className="relative z-10 mb-3">
            <p className="text-xs font-handwriting text-gray-500 italic text-center">
              Dear True Mother,
            </p>
          </div>
          
          {/* Message content - main area */}
          <div className='flex-1 overflow-hidden relative z-10 mb-3'>
            <p className='text-sm text-gray-800 font-handwriting leading-relaxed line-clamp-4 font-medium'>
              "{letter.content}"
            </p>
          </div>
          
          {/* Signature section */}
          <div className='relative z-10 mt-auto'>
            <div className="text-right mb-2">
              <p className='text-xs font-handwriting text-gray-600 italic'>
                With love,
              </p>
            </div>
            
            {/* Author signature area */}
            <div className='space-y-1 border-t border-gray-300/50 pt-2'>
              <div className="flex items-center justify-between">
                <p className='text-xs font-bold text-gray-700 font-handwriting flex items-center gap-1'>
                  💝 {letter.name}
                </p>
                <p className='text-xs text-gray-500 font-handwriting'>
                  {new Date(letter.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: '2-digit'
                  })}
                </p>
              </div>
              <p className='text-xs text-gray-600 font-handwriting flex items-center gap-1'>
                📍 {letter.region}
              </p>
            </div>
          </div>
          
          {/* Heart decoration */}
          <div className="absolute top-3 right-8 opacity-20">
            <span className="text-red-400 text-lg">💕</span>
          </div>
          
          {/* Small decorative elements */}
          <div className="absolute bottom-3 left-3 opacity-10">
            <div className="flex gap-1">
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
  isSubmitting
}: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (letter: Omit<Letter, '_id' | 'createdAt' | 'color' | 'rotation' | 'position'>) => Promise<void>
  isSubmitting?: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    content: ''
  })
  const [wordCount, setWordCount] = useState(0)

  const handleContentChange = (value: string) => {
    const words = value.trim().split(/\s+/).filter(word => word.length > 0)
    if (words.length <= LETTER_CONFIG.MAX_WORDS) {
      setFormData(prev => ({ ...prev, content: value }))
      setWordCount(words.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.region && formData.content && wordCount <= LETTER_CONFIG.MAX_WORDS) {
      await onSubmit(formData)
      // Reset form only if submission was successful (modal will close)
      setFormData({ name: '', region: '', content: '' })
      setWordCount(0)
    }
  }

  // Get a soft pastel color for the note
  const noteColor = useMemo(() => {
    return PAPER_COLORS[2]; // Use a consistent warm color for writing
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />
          
          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Note-style modal */}
            <div
              className={`${noteColor} border-2 shadow-2xl rounded-lg max-w-2xl w-full max-h-[90vh] relative cursor-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner fold effect */}
              <div className="absolute top-0 right-0 w-6 h-6 bg-white opacity-40 transform rotate-45 translate-x-3 -translate-y-3"></div>
              
              {/* Close button (X) */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-gray-300 hover:border-gray-400 transition-all duration-200 group cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Subtle dot pattern background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 h-full w-full p-6">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 p-8 pr-16">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-handwriting font-bold text-gray-800 mb-2">
                    💌 Write to True Mother 💌
                  </h2>
                  <p className="text-lg font-handwriting text-gray-600 italic">
                    Share your heartfelt message of love and encouragement
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Letter format with handwritten styling */}
                  <div className="bg-white/60 rounded-lg p-6 border border-gray-300 space-y-5">
                    {/* Date line */}
                    <div className="text-right">
                      <p className="text-base font-handwriting text-gray-600">
                        {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    {/* Greeting */}
                    <div>
                      <p className="text-lg font-handwriting text-gray-800 mb-4">
                        Dear True Mother,
                      </p>
                    </div>
                    
                    {/* Message content */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-handwriting text-gray-600 italic">
                          Your heartfelt message:
                        </label>
                        <span className={`text-xs font-handwriting ${
                          wordCount > LETTER_CONFIG.MAX_WORDS ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {wordCount}/{LETTER_CONFIG.MAX_WORDS} words
                        </span>
                      </div>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="I want to tell you how much you mean to me..."
                        className="min-h-[140px] bg-transparent border-none resize-none font-handwriting text-lg text-gray-800 placeholder-gray-400 focus:ring-0 focus:outline-none p-0"
                        required
                      />
                    </div>
                    
                    {/* Signature section */}
                    <div className="pt-4 space-y-3">
                      <p className="text-lg font-handwriting text-gray-800">
                        With love and respect,
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your name"
                            className="bg-transparent border-0 border-b-2 border-gray-300 rounded-none font-handwriting text-lg text-gray-800 focus:border-gray-500 focus:ring-0 placeholder-gray-400"
                            required
                          />
                        </div>
                        <div>
                          <Input
                            id="region"
                            type="text"
                            value={formData.region}
                            onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                            placeholder="Your region/province"
                            className="bg-transparent border-0 border-b-2 border-gray-300 rounded-none font-handwriting text-lg text-gray-800 focus:border-gray-500 focus:ring-0 placeholder-gray-400"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 font-handwriting border-gray-400 hover:bg-gray-50 text-gray-700 cursor-pointer bg-white/80"
                    >
                      Maybe Later
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-handwriting cursor-pointer shadow-lg hover:shadow-xl"
                      disabled={!formData.name || !formData.region || !formData.content || wordCount > LETTER_CONFIG.MAX_WORDS || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending with Love...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send My Letter 💌
                        </>
                      )}
                    </Button>
                  </div>
                </form>
                
                {/* Small corner decoration */}
                <div className="absolute bottom-6 right-6 opacity-15">
                  <div className="w-4 h-4 bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ViewLetterModal({ letter, isOpen, onClose }: { 
  letter: Letter | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!letter) return null

  // Get same pastel color logic as letter card
  const pastelColor = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return PAPER_COLORS[Math.abs(hash) % PAPER_COLORS.length];
  }, [letter._id]);

  // Slight rotation for the modal
  const rotation = useMemo(() => {
    const hash = letter._id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return (hash % 3) - 1; // Random rotation between -1 and 1 degrees
  }, [letter._id]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal container with backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          >
            {/* Note-style modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`${pastelColor} border-2 shadow-2xl rounded-lg max-w-2xl w-full max-h-[90vh] relative cursor-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner fold effect */}
              <div className="absolute top-0 right-0 w-6 h-6 bg-white opacity-40 transform rotate-45 translate-x-3 -translate-y-3"></div>
              
              {/* Close button (X) */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white border border-gray-300 hover:border-gray-400 transition-all duration-200 group cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Subtle dot pattern background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 h-full w-full p-6">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 p-8 pr-16">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-handwriting font-bold text-gray-800 mb-3">
                    Letter from {letter.name}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-lg text-gray-600 font-handwriting flex items-center justify-center gap-2">
                      <span className="text-green-500">📍</span>
                      From {letter.region}
                    </p>
                    <p className="text-base text-gray-500 font-handwriting">
                      📅 {new Date(letter.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Letter content */}
                <div className="mb-8">
                  <p className="text-xl text-gray-800 font-handwriting leading-relaxed whitespace-pre-wrap">
                    {letter.content}
                  </p>
                </div>
                
                {/* Small corner decoration */}
                <div className="absolute bottom-6 right-6 opacity-15">
                  <div className="w-4 h-4 bg-gray-400 rounded-full" />
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

  // Debug function to track state changes
  const handleViewLetter = (letter: Letter) => {
    console.log('Setting viewing letter:', letter.name);
    setViewingLetter(letter);
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

  const handleAddLetter = async (letterData: Omit<Letter, '_id' | 'createdAt' | 'color' | 'rotation' | 'position'>) => {
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
        // Add new letter to the existing letters
        setLetters(prev => [result.data, ...prev])
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

          <div className='relative container mx-auto px-4 md:px-6'>
            <div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
              {/* Text Content - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='flex-1 text-center lg:text-left space-y-6'
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
                  Send your heartfelt messages of love, support, and encouragement 
                  to our beloved True Mother. Your words of comfort bring strength and hope. 🌸💕
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
                className='relative flex-shrink-0 hidden lg:block'
              >
                <div className='relative'>
                  <Image
                    src='/letter-for-tm.png'
                    alt='True Mother'
                    width={320}
                    height={280}
                    className='object-cover rounded-lg'
                  />
                  {/* Fade effect at bottom */}
                  <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg'></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Letters Collage Section */}
        <section className='pb-16'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 justify-items-center'>
              {isLoading ? (
                // Loading state
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className='w-64 h-32 bg-gray-200 rounded-lg animate-pulse'
                  />
                ))
              ) : (
                letters.map((letter, index) => (
                  <LetterCard key={letter._id} letter={letter} index={index} onClick={handleViewLetter} />
                ))
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