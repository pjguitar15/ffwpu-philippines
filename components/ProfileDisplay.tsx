'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHeart,
  FiUsers,
  FiCamera,
} from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
  spiritualParent?: {
    id: string
    fullName: string
    givenName: string
    familyName: string
    email?: string
    phone?: string
    church?: string
  } | null
  registeredAt?: string
  registeredBy?: string
  note?: string
}

interface ProfileDisplayProps {
  userData?: UserData | null
  memberData: MemberData
  profileImage?: string
  showBackButton?: boolean
  isCurrentUser?: boolean
}

export default function ProfileDisplay({ 
  userData, 
  memberData, 
  profileImage = '/ffwpu-ph-logo.webp',
  showBackButton = false,
  isCurrentUser = false
}: ProfileDisplayProps) {
  const router = useRouter()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Handle image upload logic here
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header with back button */}
          {showBackButton && (
            <div className="mb-6">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← Back
              </Button>
            </div>
          )}

          {/* Profile Header */}
          <Card className='mb-8 overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white'>
              <div className='flex flex-col md:flex-row items-center gap-6'>
                <div className='relative group'>
                  <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg'>
                    <Image
                      src={profileImage}
                      alt='Profile'
                      width={128}
                      height={128}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  {isCurrentUser && (
                    <label className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                      <FiCamera className='text-white text-xl' />
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        className='hidden'
                      />
                    </label>
                  )}
                </div>
                <div className='flex-1 text-center md:text-left'>
                  <h1 className='text-3xl font-bold mb-2'>
                    {memberData.fullName}
                  </h1>
                  <div className='flex flex-wrap gap-2 justify-center md:justify-start mb-4'>
                    <Badge variant='secondary' className='bg-white/20 text-white'>
                      {memberData.membershipCategory || 'Member'}
                    </Badge>
                    <Badge variant='secondary' className='bg-white/20 text-white'>
                      {memberData.ageGroup}
                    </Badge>
                    {memberData.blessingStatus && (
                      <Badge variant='secondary' className='bg-white/20 text-white'>
                        {memberData.blessingStatus}
                      </Badge>
                    )}
                  </div>
                  <p className='text-blue-100 mb-2'>
                    {memberData.church}
                  </p>
                  {memberData.dateOfJoining && (
                    <p className='text-blue-200 text-sm'>
                      Member since {new Date(memberData.dateOfJoining).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {userData && (
              <div className='bg-blue-50 px-6 py-3'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>
                    Email verified: {userData.isEmailVerified ? '✅' : '❌'}
                  </span>
                  {userData.lastLoginAt && (
                    <span className='text-gray-600'>
                      Last login: {new Date(userData.lastLoginAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FiUser className='text-blue-600' />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <span className='text-sm font-medium text-gray-700'>Full Name:</span>
                  <p className='text-gray-900'>{memberData.fullName}</p>
                </div>
                <div>
                  <span className='text-sm font-medium text-gray-700'>Given Name:</span>
                  <p className='text-gray-900'>{memberData.givenName}</p>
                </div>
                <div>
                  <span className='text-sm font-medium text-gray-700'>Family Name:</span>
                  <p className='text-gray-900'>{memberData.familyName}</p>
                </div>
                {memberData.gender && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Gender:</span>
                    <p className='text-gray-900'>{memberData.gender}</p>
                  </div>
                )}
                {memberData.age && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Age:</span>
                    <p className='text-gray-900'>{memberData.age} years</p>
                  </div>
                )}
                <div>
                  <span className='text-sm font-medium text-gray-700'>Age Group:</span>
                  <p className='text-gray-900'>{memberData.ageGroup}</p>
                </div>
                {memberData.dateOfBirth && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Date of Birth:</span>
                    <p className='text-gray-900'>
                      {new Date(memberData.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Location */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FiMail className='text-blue-600' />
                  Contact & Location
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {memberData.email && (
                  <div className='flex items-center gap-2'>
                    <FiMail className='text-gray-400' />
                    <div>
                      <span className='text-sm font-medium text-gray-700'>Email:</span>
                      <p className='text-gray-900'>{memberData.email}</p>
                    </div>
                  </div>
                )}
                {memberData.phone && (
                  <div className='flex items-center gap-2'>
                    <FiPhone className='text-gray-400' />
                    <div>
                      <span className='text-sm font-medium text-gray-700'>Phone:</span>
                      <p className='text-gray-900'>{memberData.phone}</p>
                    </div>
                  </div>
                )}
                {(memberData.continent || memberData.region || memberData.nation || memberData.city) && (
                  <div className='flex items-start gap-2'>
                    <FiMapPin className='text-gray-400 mt-1' />
                    <div className='space-y-1'>
                      {memberData.continent && (
                        <div>
                          <span className='text-sm font-medium text-gray-700'>Continent:</span>
                          <p className='text-gray-900'>{memberData.continent}</p>
                        </div>
                      )}
                      {memberData.region && (
                        <div>
                          <span className='text-sm font-medium text-gray-700'>Region:</span>
                          <p className='text-gray-900'>{memberData.region}</p>
                        </div>
                      )}
                      {memberData.nation && (
                        <div>
                          <span className='text-sm font-medium text-gray-700'>Nation:</span>
                          <p className='text-gray-900'>{memberData.nation}</p>
                        </div>
                      )}
                      {memberData.city && (
                        <div>
                          <span className='text-sm font-medium text-gray-700'>City:</span>
                          <p className='text-gray-900'>{memberData.city}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {memberData.church && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Church:</span>
                    <p className='text-gray-900'>{memberData.church}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Membership Details */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FiUsers className='text-blue-600' />
                  Membership Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <span className='text-sm font-medium text-gray-700'>Member ID:</span>
                  <p className='text-gray-900 font-mono text-xs break-all'>
                    {memberData.id}
                  </p>
                </div>
                {memberData.membershipCategory && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Category:</span>
                    <p className='text-gray-900'>{memberData.membershipCategory}</p>
                  </div>
                )}
                {memberData.dateOfJoining && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Date of Joining:</span>
                    <p className='text-gray-900'>
                      {new Date(memberData.dateOfJoining).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {memberData.registeredAt && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Registered At:</span>
                    <p className='text-gray-900'>{memberData.registeredAt}</p>
                  </div>
                )}
                {memberData.registeredBy && (
                  <div>
                    <span className='text-sm font-medium text-gray-700'>Registered By:</span>
                    <p className='text-gray-900'>{memberData.registeredBy}</p>
                  </div>
                )}
                <div>
                  <span className='text-sm font-medium text-gray-700'>Spiritual Parent:</span>
                  <span className='text-sm ml-2'>
                    {memberData.spiritualParent ? (
                      <button
                        onClick={() => router.push(`/profile/${memberData.spiritualParent?.id}`)}
                        className='text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors cursor-pointer'
                      >
                        {memberData.spiritualParent.fullName}
                      </button>
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information Row */}
          {(memberData.blessedChild || memberData.blessingStatus || memberData.nameOfSpouse || memberData.note) && (
            <div className='grid lg:grid-cols-2 gap-8 mt-8'>
              {/* Blessing Information */}
              {(memberData.blessedChild || memberData.blessingStatus || memberData.nameOfSpouse) && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <FiHeart className='text-blue-600' />
                      Blessing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {memberData.blessedChild && (
                      <div>
                        <span className='text-sm font-medium text-gray-700'>Blessed Child:</span>
                        <p className='text-gray-900'>{memberData.blessedChild}</p>
                      </div>
                    )}
                    {memberData.blessingStatus && (
                      <div>
                        <span className='text-sm font-medium text-gray-700'>Blessing Status:</span>
                        <p className='text-gray-900'>{memberData.blessingStatus}</p>
                      </div>
                    )}
                    {memberData.blessedYear && (
                      <div>
                        <span className='text-sm font-medium text-gray-700'>Blessed Year:</span>
                        <p className='text-gray-900'>{memberData.blessedYear}</p>
                      </div>
                    )}
                    {memberData.nameOfSpouse && (
                      <div>
                        <span className='text-sm font-medium text-gray-700'>Spouse:</span>
                        <p className='text-gray-900'>{memberData.nameOfSpouse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Additional Notes */}
              {memberData.note && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <FiCalendar className='text-blue-600' />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <span className='text-sm font-medium text-gray-700'>Notes:</span>
                      <p className='text-gray-900 mt-1'>{memberData.note}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}