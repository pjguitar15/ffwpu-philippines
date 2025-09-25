'use client'

import { FiLoader } from 'react-icons/fi'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserData, MemberData } from '@/types/profile'
import LeftNavigation from '@/components/layout/LeftNavigation'
import ProfileHeader from './ProfileHeader'
import PersonalInfoCard from './PersonalInfoCard'
import LocationChurchCard from './LocationChurchCard'
import BlessingFamilyCard from './BlessingFamilyCard'
import MembershipDetailsCard from './MembershipDetailsCard'

interface ProfileContainerProps {
  userData: UserData | null
  memberData: MemberData | null
  profileImage: string
  loading: boolean
  error: string
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRetry?: () => void
  showImageUpload?: boolean
}

export default function ProfileContainer({
  userData,
  memberData,
  profileImage,
  loading,
  error,
  onImageUpload,
  onRetry,
  showImageUpload = false,
}: ProfileContainerProps) {
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <FiLoader className='animate-spin h-8 w-8 text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading profile...</p>
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
            {onRetry && (
              <Button onClick={onRetry} className='w-full mt-4'>
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Left Navigation */}
      <LeftNavigation currentMemberId={memberData.id} />
      
      {/* Main Content */}
      <div className='lg:pl-64'>
        <div className='max-w-6xl mx-auto px-4 py-6'>
          <ProfileHeader
            memberData={memberData}
            profileImage={profileImage}
            onImageUpload={onImageUpload}
            showImageUpload={showImageUpload}
          />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
            {/* Left Column - Personal & Location Info */}
            <div className='space-y-4'>
              <PersonalInfoCard memberData={memberData} />
              <LocationChurchCard memberData={memberData} />
              <BlessingFamilyCard memberData={memberData} />
            </div>

            {/* Right Column - Membership Details */}
            <div className='space-y-4'>
              <MembershipDetailsCard memberData={memberData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}