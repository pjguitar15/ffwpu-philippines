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
import { FiSend } from 'react-icons/fi'

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

    try {
      // Find hidden frequency input injected by banner; default weekly
      const form = e.target as HTMLFormElement
      const freqInput = form.querySelector(
        'input[name="frequency"]',
      ) as HTMLInputElement | null
      const frequency = (freqInput?.value as 'weekly' | 'monthly') || 'weekly'

      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
      }

      toast({
        title: 'Welcome to our community! 🎉',
        description:
          "You've successfully subscribed to our newsletter. Check your inbox for a confirmation email.",
      })

      // Trigger enhanced confetti effect
      triggerConfetti()

      setEmail('')
    } catch (_) {
      toast({ title: 'Subscription failed', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

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
        className='flex-1 px-6 py-6 focus:ring-0 bg-white text-gray-900 placeholder-gray-400 rounded-none rounded-l-lg border border-transparent focus:border-blue-400'
        style={{ minWidth: 0 }}
      />

      <button
        type='submit'
        disabled={isLoading}
        className='relative overflow-hidden rounded-none rounded-r-lg px-6 text-white font-semibold text-base cursor-pointer disabled:opacity-70 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500 group/button'
        style={{
          background: 'linear-gradient(90deg, #B8860B, #DAA520)',
          boxShadow: '0 4px 10px rgba(184, 134, 11, 0.4)',
        }}
      >
        {/* Text: balanced default, on hover makes just enough space */}
        <span className='relative z-10 inline-block transition-all duration-300 ease-in-out group-hover/button:pr-2 group-hover/button:-translate-x-0.5'>
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </span>

        {/* Icon: tucked in tighter */}
        <FiSend
          aria-hidden
          size={18}
          className='absolute right-2 top-1/2 -translate-y-1/2 opacity-0 translate-x-1 transition-all duration-300 ease-in-out group-hover/button:opacity-100 group-hover/button:translate-x-0'
        />
      </button>
    </form>
  )
}
