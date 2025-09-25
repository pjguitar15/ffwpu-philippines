'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FiLoader } from 'react-icons/fi'
import { MemberData } from '@/types/profile'

interface MembershipDetailsCardProps {
  memberData: MemberData
}

export default function MembershipDetailsCard({ memberData }: MembershipDetailsCardProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleSpiritualParentClick = async (spiritualParentId: string) => {
    setIsNavigating(true)
    // Add a slight delay for visual feedback
    setTimeout(() => {
      router.push(`/profile/${spiritualParentId}`)
    }, 300)
  }

  return (
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
                ? new Date(memberData.dateOfJoining).toLocaleDateString()
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
              {memberData.spiritualParent ? (
                <button
                  onClick={() => handleSpiritualParentClick(memberData.spiritualParent?.id!)}
                  disabled={isNavigating}
                  className='text-blue-600 hover:text-blue-800 hover:underline font-medium transition-all duration-200 cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 disabled:opacity-70'
                >
                  {isNavigating && <FiLoader className='h-3 w-3 animate-spin' />}
                  {memberData.spiritualParent.fullName}
                </button>
              ) : (
                'N/A'
              )}
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
  )
}