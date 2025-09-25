'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiCalendar,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAccountRecovery, setShowAccountRecovery] = useState(false)
  const [existingAccountInfo, setExistingAccountInfo] = useState<any>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          dateOfBirth: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?message=registration-success')
        }, 3000)
      } else {
        // Handle different error scenarios
        if (data.suggestAccountRecovery || response.status === 409) {
          setShowAccountRecovery(true)
          setExistingAccountInfo(data)
        }
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear errors when user starts typing
    if (error) setError('')
  }

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword

  const handleAccountRecovery = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/account-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(
          'Account recovery initiated! Check your email for reset instructions.',
        )
        setShowAccountRecovery(false)
        setTimeout(() => {
          router.push('/login?message=account-recovery-sent')
        }, 3000)
      } else {
        setError(data.error || 'Account recovery failed')
      }
    } catch (error) {
      console.error('Account recovery error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
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
              <p className='text-sm text-gray-600'>Member Registration</p>
            </div>
          </Link>
        </div>

        {/* Registration Form */}
        <Card className='shadow-2xl border-0 bg-white/80 backdrop-blur-sm'>
          <CardHeader className='space-y-1 pb-6'>
            <CardTitle className='text-2xl font-bold text-center text-gray-900'>
              Create Account
            </CardTitle>
            <p className='text-sm text-gray-600 text-center'>
              Join the FFWPU Philippines community
            </p>
          </CardHeader>
          <CardContent className='px-8 pb-8'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName'>First Name *</Label>
                  <div className='relative'>
                    <FiUser className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                    <Input
                      id='firstName'
                      name='firstName'
                      type='text'
                      placeholder='Juan'
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className='pl-10'
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Middle Name & Last Name Row */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='middleName'>Middle Name</Label>
                  <Input
                    id='middleName'
                    name='middleName'
                    type='text'
                    placeholder='Carlos'
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName'>Last Name *</Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    type='text'
                    placeholder='Dela Cruz'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className='space-y-2'>
                <Label htmlFor='dateOfBirth'>Date of Birth *</Label>
                <div className='relative'>
                  <FiCalendar className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='dateOfBirth'
                    name='dateOfBirth'
                    type='date'
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className='pl-10'
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address *</Label>
                <div className='relative'>
                  <FiMail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='pl-10'
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <Label htmlFor='password'>Password *</Label>
                <div className='relative'>
                  <FiLock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='At least 6 characters'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='pl-10 pr-10'
                    required
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

              {/* Confirm Password */}
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm Password *</Label>
                <div className='relative'>
                  <FiLock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm your password'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={cn(
                      'pl-10 pr-10',
                      formData.confirmPassword && passwordsMatch
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                        : formData.confirmPassword && !passwordsMatch
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : '',
                    )}
                    required
                  />
                  <div className='absolute right-3 top-3 flex items-center space-x-2'>
                    {formData.confirmPassword && passwordsMatch && (
                      <FiCheck className='h-4 w-4 text-green-500' />
                    )}
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='text-gray-400 hover:text-gray-600'
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className='h-4 w-4' />
                      ) : (
                        <FiEye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className='text-sm text-red-600'>Passwords do not match</p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className='border-green-200 bg-green-50 text-green-800'>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Account Recovery Option */}
              {showAccountRecovery && existingAccountInfo && (
                <Alert className='border-orange-200 bg-orange-50 text-orange-800'>
                  <AlertDescription>
                    <div className='space-y-3'>
                      <div>
                        <strong>Account Already Exists</strong>
                        <p className='text-sm mt-1'>
                          {existingAccountInfo.details}
                        </p>
                        {existingAccountInfo.existingEmail && (
                          <p className='text-sm mt-1'>
                            Email: {existingAccountInfo.existingEmail}
                          </p>
                        )}
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          onClick={handleAccountRecovery}
                          disabled={loading}
                          className='bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200'
                        >
                          Recover Account
                        </Button>
                        <Button
                          type='button'
                          size='sm'
                          variant='ghost'
                          onClick={() => {
                            setShowAccountRecovery(false)
                            setError('')
                          }}
                          className='text-orange-700 hover:bg-orange-100'
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl'
                disabled={
                  loading ||
                  !passwordsMatch ||
                  !formData.password ||
                  !formData.confirmPassword
                }
              >
                {loading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Info Box */}
              <div className='mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl'>
                <p className='text-sm text-blue-800'>
                  <strong>📋 Important:</strong> Your name and date of birth
                  must match your church membership records. Contact your
                  administrator if you encounter issues.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className='text-center mt-6'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}