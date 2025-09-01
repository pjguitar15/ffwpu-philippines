'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Mail,
  Lock,
  LogIn,
  Sparkles,
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const nextPath = search.get('next') || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // If already authenticated, bounce to dashboard (or ?next=…)
  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (res.ok) {
          router.replace(nextPath)
          return
        }
      } catch {
        // ignore (network/abort)
      } finally {
        setChecking(false)
      }
    })()
    return () => controller.abort()
  }, [router, nextPath])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      // optional one-time seeding (no-op if already exists)
      await fetch('/api/auth/init-super-admin', { method: 'POST' }).catch(
        () => {},
      )

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      })

      if (!res.ok) {
        let message = 'Sign-in failed'
        try {
          const data = await res.json()
          message = data?.error || message
        } catch {}
        throw new Error(message)
      }

      router.replace(nextPath)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className='min-h-screen grid place-items-center p-6'>
        <div className='w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm'>
          <div className='animate-pulse'>
            <div className='h-7 w-40 rounded-md bg-slate-200/80 mb-2' />
            <div className='h-4 w-64 rounded-md bg-slate-200/60 mb-6' />
            <div className='space-y-4'>
              <div className='space-y-2'>
                <div className='h-4 w-16 rounded bg-slate-200/80' />
                <div className='h-10 w-full rounded-md bg-slate-200/60' />
              </div>
              <div className='space-y-2'>
                <div className='h-4 w-24 rounded bg-slate-200/80' />
                <div className='h-10 w-full rounded-md bg-slate-200/60' />
              </div>
            </div>
            <div className='h-10 w-full rounded-md bg-slate-200/70 mt-6' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen grid grid-cols-1 md:grid-cols-2'>
      {/* Left: Form */}
      <div className='relative flex items-center justify-center p-6 md:p-10'>
        <div className='absolute left-6 top-6 hidden md:flex items-center gap-3'>
          <Image
            src='/ffwpu-ph-logo.webp'
            alt='FFWPU Philippines'
            width={130}
            height={40}
            priority
          />
        </div>

        <form
          onSubmit={onSubmit}
          className='w-full max-w-2xl bg-white p-6 shadow-sm'
          aria-busy={loading}
        >
          <div className='mb-2 flex items-center gap-2'>
            <LogIn className='h-5 w-5 text-primary' />
            <h1 className='text-2xl font-bold'>Admin Sign In</h1>
          </div>

          {/* upgraded subtext */}
          {search.get('next') ? (
            <p className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
              <Shield className='h-4 w-4' />
              This area is protected. Please authenticate to continue.
            </p>
          ) : (
            <p className='text-sm text-muted-foreground mb-6'>
              Access the{' '}
              <span className='font-medium'>
                FFWPU Philippines Admin Portal
              </span>{' '}
              to publish news, schedule announcements, and manage newsletters.
            </p>
          )}

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='yourname@ffwpu.ph'
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete='username'
                  disabled={loading}
                  className='pl-9'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete='current-password'
                  disabled={loading}
                  className='pl-9 pr-10'
                />
                <button
                  type='button'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className='absolute inset-y-0 right-2 grid place-items-center px-1 text-muted-foreground hover:text-foreground'
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p
              className='mt-3 text-sm text-destructive'
              role='alert'
              aria-live='polite'
            >
              {error}
            </p>
          )}

          <Button
            type='submit'
            className='mt-6 w-full cursor-pointer'
            disabled={loading}
          >
            {loading ? (
              <span className='inline-flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* tiny reassurance row */}
          <p className='mt-3 text-[12px] text-muted-foreground flex items-center gap-2'>
            <Shield className='h-3.5 w-3.5' />
            Secured with JWT sessions. Admin access only.
          </p>
        </form>
      </div>

      {/* Right: Brand art */}
      <div className='relative hidden md:block overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-700 to-sky-600' />
        {/* soft glow accents */}
        <div className='absolute -top-20 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl' />
        <div className='absolute -bottom-16 -right-24 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl' />

        {/* content */}
        <div className='relative z-10 h-full w-full flex flex-col items-center justify-center p-10 text-white'>
          <Image
            src='/ffwpu-ph-logo.png'
            alt='FFWPU Philippines'
            width={120}
            height={120}
            className='mb-6 opacity-95 drop-shadow filter brightness-0 invert'
            priority
          />
          <h2 className='text-3xl font-extrabold tracking-wide uppercase text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]'>
            Join Our Spiritual Family
          </h2>
          <p className='mt-3 max-w-md text-center text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]'>
            Steward your mission with care and excellence. Keep our news,
            announcements, and outreach up to date for the whole community.
          </p>

          <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md'>
            <FeaturePill
              icon={<Sparkles className='h-4 w-4' />}
              label='Publish inspiring news'
            />
            <FeaturePill
              icon={<Mail className='h-4 w-4' />}
              label='Send newsletters'
            />
            <FeaturePill
              icon={<Shield className='h-4 w-4' />}
              label='Secure admin tools'
            />
            <FeaturePill
              icon={<LogIn className='h-4 w-4' />}
              label='Fast access, smooth UX'
            />
          </div>
        </div>

        {/* subtle watermark */}
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]' />
      </div>
    </div>
  )
}

/** Small gradient badge used on the art panel */
function FeaturePill({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className='flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm text-sm'>
      <span className='grid h-5 w-5 place-items-center rounded-full bg-white/20'>
        {icon}
      </span>
      <span className='leading-none'>{label}</span>
    </div>
  )
}
