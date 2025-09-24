'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHeart,
  FiUsers,
  FiLogOut,
  FiSettings,
  FiCamera,
  FiLoader,
} from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface UserData {
  id: string
  email: string
  isEmailVerified: boolean
  lastLoginAt?: string
}

interface MemberData {
  id: string
  fullName: string
  givenName: string
  familyName: string
  dateOfBirth: string
  ageGroup: string
  homeChurch: string
  position: string
  gender?: string
  age?: number
  email?: string
  phone?: string
  continent?: string
  region?: string
  nation?: string
  city?: string
  church?: string
  membershipCategory?: string
  dateOfJoining?: string
  blessingStatus?: string
  blessedChild?: string
  blessedYear?: number
  nameOfSpouse?: string
  spiritualParent?: string
  registeredAt?: string
  registeredBy?: string
  note?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState('/ffwpu-ph-logo.webp')

  useEffect(() => {
    fetchMemberData()
  }, [])

  const fetchMemberData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/member/me', {
        cache: 'no-store',
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Received member data:', result.member) // Debug log
        setUserData(result.user)
        setMemberData(result.member)
      } else {
        // Will be handled by middleware - redirect to login
        router.push('/login?next=/profile')
      }
    } catch (error) {
      console.error('Error fetching member data:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/member/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <FiLoader className='animate-spin h-8 w-8 text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userData || !memberData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='p-6'>
            <Alert variant='destructive'>
              <AlertDescription>
                {error || 'Failed to load profile data'}
              </AlertDescription>
            </Alert>
            <Button onClick={() => fetchMemberData()} className='w-full mt-4'>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-3'>
            <Image
              src='/ffwpu-ph-logo.webp'
              alt='FFWPU Philippines'
              width={40}
              height={40}
              className='rounded-full'
            />
            <span className='font-semibold text-lg text-gray-900'>
              FFWPU Philippines
            </span>
          </Link>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='sm'>
              <FiSettings className='h-4 w-4 mr-2' />
              Settings
            </Button>
            <Button variant='ghost' size='sm' onClick={handleLogout}>
              <FiLogOut className='h-4 w-4 mr-2' />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Profile Header - Social Media Style */}
        <Card className='mb-8 overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative'>
            <div className='absolute inset-0 bg-black/20'></div>
            <div className='absolute bottom-6 left-6 right-6'>
              <div className='flex items-end gap-6'>
                {/* Profile Picture */}
                <div className='relative'>
                  <div className='w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white'>
                    <Image
                      src={profileImage}
                      alt='Profile'
                      width={128}
                      height={128}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <label className='absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors'>
                    <FiCamera className='h-4 w-4 text-white' />
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='hidden'
                    />
                  </label>
                </div>

                {/* Profile Info */}
                <div className='flex-1 text-white pb-4'>
                  <h1 className='text-3xl font-bold mb-2'>
                    {memberData.givenName} {memberData.familyName}
                  </h1>
                  <p className='text-blue-100 text-lg mb-2'>
                    {memberData.membershipCategory} • {memberData.church}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-blue-100'>
                    <span className='flex items-center gap-1'>
                      <FiCalendar className='h-4 w-4' />
                      Joined{' '}
                      {memberData.dateOfJoining
                        ? new Date(
                            memberData.dateOfJoining,
                          ).toLocaleDateString()
                        : 'N/A'}
                    </span>
                    <Badge
                      variant='secondary'
                      className='bg-white/20 text-white border-white/30'
                    >
                      {memberData.blessingStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Personal & Location Info */}
          <div className='space-y-6'>
            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FiUser className='h-5 w-5' />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-3'>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Full Name:
                    </span>
                    <span className='text-sm ml-2'>{memberData.fullName}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Given Name:
                    </span>
                    <span className='text-sm ml-2'>{memberData.givenName}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Family Name:
                    </span>
                    <span className='text-sm ml-2'>
                      {memberData.familyName}
                    </span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Gender:
                    </span>
                    <span className='text-sm ml-2'>{memberData.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Age:
                    </span>
                    <span className='text-sm ml-2'>{memberData.age ? `${memberData.age} years` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Age Group:
                    </span>
                    <span className='text-sm ml-2'>{memberData.ageGroup}</span>
                  </div>
                </div>
                <div className='flex items-center gap-3 pt-2'>
                  <FiMail className='h-4 w-4 text-gray-500' />
                  <span className='text-sm'>{memberData.email || 'N/A'}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <FiPhone className='h-4 w-4 text-gray-500' />
                  <span className='text-sm'>{memberData.phone || 'N/A'}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <FiCalendar className='h-4 w-4 text-gray-500' />
                  <span className='text-sm'>
                    Born {new Date(memberData.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location & Church Details */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FiMapPin className='h-5 w-5' />
                  Location & Church
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-3'>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Continent:
                    </span>
                    <span className='text-sm ml-2'>{memberData.continent || 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Region:
                    </span>
                    <span className='text-sm ml-2'>{memberData.region || 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Nation:
                    </span>
                    <span className='text-sm ml-2'>{memberData.nation || 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      City:
                    </span>
                    <span className='text-sm ml-2'>{memberData.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Church:
                    </span>
                    <span className='text-sm ml-2'>{memberData.church || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blessing & Family Info */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FiHeart className='h-5 w-5' />
                  Blessing & Family
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-3'>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Blessed Child:
                    </span>
                    <Badge
                      variant={
                        memberData.blessedChild === 'Yes'
                          ? 'default'
                          : 'secondary'
                      }
                      className='ml-2'
                    >
                      {memberData.blessedChild}
                    </Badge>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Blessing Status:
                    </span>
                    <Badge variant='default' className='ml-2'>
                      {memberData.blessingStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Blessed Year:
                    </span>
                    <span className='text-sm ml-2'>
                      {memberData.blessedYear}
                    </span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Name of Spouse:
                    </span>
                    <span className='text-sm ml-2'>
                      {memberData.nameOfSpouse}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Membership Details & Actions */}
          <div className='space-y-6'>
            {/* Membership Details */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-3'>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Member ID:
                    </span>
                    <span className='text-sm ml-2 font-mono bg-gray-100 px-2 py-1 rounded'>
                      {memberData.id}
                    </span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Membership Category:
                    </span>
                    <Badge variant='outline' className='ml-2'>
                      {memberData.membershipCategory}
                    </Badge>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Date of Joining:
                    </span>
                    <span className='text-sm ml-2'>
                      {memberData.dateOfJoining
                        ? new Date(
                            memberData.dateOfJoining,
                          ).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Registered At:
                    </span>
                    <span className='text-sm ml-2'>
                      {memberData.registeredAt}
                    </span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Registered By:
                    </span>
                    <span className='text-sm ml-2'>
                      {memberData.registeredBy}
                    </span>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-700'>
                      Spiritual Parent:
                    </span>
                    <span className='text-sm ml-2'>
                      {memberData.spiritualParent}
                    </span>
                  </div>
                </div>
                {memberData.note && (
                  <div className='pt-3 border-t'>
                    <span className='text-sm font-medium text-gray-700'>
                      Note:
                    </span>
                    <p className='text-sm mt-1 text-gray-600 bg-blue-50 p-3 rounded-lg'>
                      {memberData.note}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button className='w-full' variant='outline'>
                  <FiCalendar className='h-4 w-4 mr-2' />
                  View Events
                </Button>
                <Button className='w-full' variant='outline'>
                  <FiUsers className='h-4 w-4 mr-2' />
                  Contact Pastor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}