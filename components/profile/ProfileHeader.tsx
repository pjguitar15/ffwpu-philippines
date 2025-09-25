'use client'

import Image from 'next/image'
import { FiCalendar, FiCamera, FiUser, FiGitBranch } from 'react-icons/fi'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MemberData } from '@/types/profile'
import Link from 'next/link'

interface ProfileHeaderProps {
  memberData: MemberData
  profileImage: string
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  showImageUpload?: boolean
}

export default function ProfileHeader({ 
  memberData, 
  profileImage, 
  onImageUpload,
  showImageUpload = false 
}: ProfileHeaderProps) {
  return (
    <Card className='mb-6 overflow-hidden'>
      {/* Cover Photo */}
      <div className='h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='absolute bottom-6 left-6 right-6'>
          <div className='flex items-end justify-between'>
            <div className='flex items-end gap-6'>
              {/* Profile Picture */}
              <div className='relative'>
                <div className='w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center'>
                  {profileImage && profileImage !== '/ffwpu-ph-logo.webp' ? (
                    <Image
                      src={profileImage}
                      alt='Profile'
                      width={128}
                      height={128}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <FiUser className='w-16 h-16 text-gray-400' />
                  )}
                </div>
                {showImageUpload && onImageUpload && (
                  <label className='absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors'>
                    <FiCamera className='h-4 w-4 text-white' />
                    <input
                      type='file'
                      accept='image/*'
                      onChange={onImageUpload}
                      className='hidden'
                    />
                  </label>
                )}
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
                      ? new Date(memberData.dateOfJoining).toLocaleDateString()
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

            {/* Family Tree Button */}
            <div className='pb-4'>
              <Link href={`/members/spiritual-family-tree/${memberData.id}`}>
                <Button 
                  variant='secondary' 
                  size='sm'
                  className='bg-white/20 text-white border-white/30 hover:bg-white/30'
                >
                  <FiGitBranch className='h-4 w-4 mr-2' />
                  View Family Tree
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}