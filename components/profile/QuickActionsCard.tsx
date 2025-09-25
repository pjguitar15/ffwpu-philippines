import { FiCalendar, FiUsers, FiList } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuickActionsCardProps {
  showActions?: boolean
}

export default function QuickActionsCard({ showActions = true }: QuickActionsCardProps) {
  if (!showActions) return null

  return (
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
        <Link href='/members'>
          <Button className='w-full' variant='outline'>
            <FiList className='h-4 w-4 mr-2' />
            Show All Members
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}