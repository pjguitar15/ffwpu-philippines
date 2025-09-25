import { FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MemberData } from '@/types/profile'

interface PersonalInfoCardProps {
  memberData: MemberData
}

export default function PersonalInfoCard({ memberData }: PersonalInfoCardProps) {
  return (
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
            <span className='text-sm ml-2'>{memberData.familyName}</span>
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
            <span className='text-sm ml-2'>
              {memberData.age ? `${memberData.age} years` : 'N/A'}
            </span>
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
  )
}