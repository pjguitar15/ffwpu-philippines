import { FiMapPin } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MemberData } from '@/types/profile'

interface LocationChurchCardProps {
  memberData: MemberData
}

export default function LocationChurchCard({ memberData }: LocationChurchCardProps) {
  return (
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
            <span className='text-sm ml-2'>
              {memberData.continent || 'N/A'}
            </span>
          </div>
          <div>
            <span className='text-sm font-medium text-gray-700'>
              Region:
            </span>
            <span className='text-sm ml-2'>
              {memberData.region || 'N/A'}
            </span>
          </div>
          <div>
            <span className='text-sm font-medium text-gray-700'>
              Nation:
            </span>
            <span className='text-sm ml-2'>
              {memberData.nation || 'N/A'}
            </span>
          </div>
          <div>
            <span className='text-sm font-medium text-gray-700'>
              City:
            </span>
            <span className='text-sm ml-2'>
              {memberData.city || 'N/A'}
            </span>
          </div>
          <div>
            <span className='text-sm font-medium text-gray-700'>
              Church:
            </span>
            <span className='text-sm ml-2'>
              {memberData.church || 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}