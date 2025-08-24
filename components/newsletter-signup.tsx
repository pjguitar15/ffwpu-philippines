'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function NewsletterSignup({
  variant = 'default',
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const triggerConfetti = () => {
    if (typeof window !== 'undefined') {
      // Create confetti elements
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']
      const confettiCount = 50

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div')
        confetti.style.position = 'fixed'
        confetti.style.left = Math.random() * 100 + 'vw'
        confetti.style.top = '-10px'
        confetti.style.width = '10px'
        confetti.style.height = '10px'
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)]
        confetti.style.pointerEvents = 'none'
        confetti.style.zIndex = '9999'
        confetti.style.borderRadius = '50%'
        confetti.style.animation = `confetti-fall ${
          Math.random() * 2 + 2
        }s linear forwards`

        document.body.appendChild(confetti)

        // Remove confetti after animation
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti)
          }
        }, 4000)
      }

      // Add CSS animation if not already present
      if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style')
        style.id = 'confetti-styles'
        style.textContent = `
          @keyframes confetti-fall {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `
        document.head.appendChild(style)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to subscribe.',
        variant: 'destructive',
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: 'Welcome to our community! 🎉',
      description:
        "You've successfully subscribed to our newsletter. Check your inbox for a confirmation email.",
    })

    // Trigger enhanced confetti effect
    triggerConfetti()

    setEmail('')
    setIsLoading(false)
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col sm:flex-row gap-2 max-w-md ${className}`}>
        <Input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='flex-1'
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className='whitespace-nowrap cursor-pointer'
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
    )
  }

  // New horizontal, light input/button for dark background
  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-lg border-2 border-blue-100 ${className}`}
      style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
    >
      <Input
        type='email'
        placeholder='Enter your email address'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className='flex-1 px-6 py-6 border-0 focus:ring-0 bg-white text-gray-900 placeholder-gray-400 rounded-none rounded-l-lg'
        style={{ minWidth: 0 }}
      />
      <Button
        type='submit'
        className='rounded-none rounded-r-lg px-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base cursor-pointer min-w-[140px] h-full'
        disabled={isLoading}
        style={{ boxShadow: 'none' }}
      >
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  )
}
