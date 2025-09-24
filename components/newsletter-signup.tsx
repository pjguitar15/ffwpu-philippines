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
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
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
    if (!firstName.trim()) {
      toast({
        title: 'First Name Required',
        description: 'Please enter your first name to subscribe.',
        variant: 'destructive',
      })
      return
    }

    if (!lastName.trim()) {
      toast({
        title: 'Last Name Required',
        description: 'Please enter your last name to subscribe.',
        variant: 'destructive',
      })
      return
    }

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
        body: JSON.stringify({
          email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          frequency,
        }),
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
      setFirstName('')
      setLastName('')
    } catch (_) {
      toast({ title: 'Subscription failed', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10 ${className}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)' }}
    >
      <div className='p-4 md:p-6 space-y-4'>
        {/* Name Fields Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            type='text'
            placeholder='First name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className='px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm rounded-lg transition-all duration-200 shadow-sm'
          />
          <Input
            type='text'
            placeholder='Last name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className='px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm rounded-lg transition-all duration-200 shadow-sm'
          />
        </div>

        {/* Email and Submit Row */}
        <div className='flex gap-3'>
          <Input
            type='email'
            placeholder='Enter your email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm rounded-lg transition-all duration-200 shadow-sm'
          />

          <button
            type='submit'
            disabled={isLoading}
            className='relative overflow-hidden px-6 py-3 text-white font-semibold text-sm cursor-pointer disabled:opacity-50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 group/button rounded-lg hover:scale-105 active:scale-95'
            style={{
              background: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #8B5CF6)',
              boxShadow:
                '0 4px 20px rgba(14, 165, 233, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
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
        </div>
      </div>
    </form>
  )
}
