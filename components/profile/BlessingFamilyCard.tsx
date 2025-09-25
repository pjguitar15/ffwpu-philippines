import { FiHeart } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MemberData } from '@/types/profile'

interface BlessingFamilyCardProps {
  memberData: MemberData
}

export default function BlessingFamilyCard({ memberData }: BlessingFamilyCardProps) {
  return (
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
  )
}