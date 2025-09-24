'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiShield,
  FiLoader,
} from 'react-icons/fi'

export default function MemberLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/profile'
  const message = searchParams.get('message')

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/member/me', {
          cache: 'no-store',
        })
        if (res.ok) {
          router.replace(nextPath)
          return
        }
      } catch (error) {
        // Not authenticated, continue with login
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router, nextPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setError('')

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        // Successful login
        router.push(nextPath)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='flex items-center gap-2 text-blue-600'>
          <FiLoader className='h-5 w-5 animate-spin' />
          <span>Checking authentication...</span>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-flex items-center gap-3 mb-6'>
            <Image
              src='/ffwpu-ph-logo.webp'
              alt='FFWPU Philippines'
              width={64}
              height={64}
              className='rounded-full shadow-lg'
            />
            <div className='text-left'>
              <h1 className='text-2xl font-bold text-gray-900'>
                FFWPU Philippines
              </h1>
              <p className='text-sm text-gray-600'>Member Portal</p>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <Card className='shadow-2xl border-0 bg-white/80 backdrop-blur-sm'>
          <CardHeader className='space-y-1 pb-6'>
            <div className='flex items-center gap-2 justify-center mb-2'>
              <FiUser className='h-5 w-5 text-blue-600' />
              <CardTitle className='text-2xl font-bold text-center text-gray-900'>
                Member Sign In
              </CardTitle>
            </div>
            {searchParams.get('next') ? (
              <p className='flex items-center gap-2 text-sm text-gray-600 text-center'>
                <FiShield className='h-4 w-4' />
                Please sign in to access your member profile
              </p>
            ) : (
              <p className='text-sm text-gray-600 text-center'>
                Access your member profile and church community
              </p>
            )}
          </CardHeader>

          <CardContent className='px-8 pb-8'>
            {/* Success message from registration */}
            {message === 'registration-success' && (
              <Alert className='border-green-200 bg-green-50 text-green-800 mb-6'>
                <AlertDescription>
                  🎉 Account created successfully! Please sign in with your
                  credentials.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <div className='relative'>
                  <FiMail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-10'
                    required
                    autoComplete='email'
                  />
                </div>
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <FiLock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-10 pr-10'
                    required
                    autoComplete='current-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? (
                      <FiEyeOff className='h-4 w-4' />
                    ) : (
                      <FiEye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl'
                disabled={loading}
              >
                {loading ? (
                  <div className='flex items-center gap-2'>
                    <FiLoader className='h-4 w-4 animate-spin' />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Register Link */}
              <div className='text-center pt-4'>
                <p className='text-sm text-gray-600'>
                  Don't have an account?{' '}
                  <Link
                    href='/register'
                    className='text-blue-600 hover:text-blue-800 font-medium'
                  >
                    Register here
                  </Link>
                </p>
              </div>

              {/* Security Notice */}
              <div className='mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl'>
                <p className='text-xs text-blue-800 flex items-center gap-2'>
                  <FiShield className='h-3.5 w-3.5' />
                  Secured with JWT authentication. Member access only.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}