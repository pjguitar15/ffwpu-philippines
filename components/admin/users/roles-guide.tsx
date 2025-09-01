'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileText, Info, Settings2, ShieldCheck } from 'lucide-react'

export function RolesGuide() {
  return (
    <Card className='mb-6 border-primary/10'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <Info className='h-4 w-4 text-primary' />
          Roles overview
        </CardTitle>
        <CardDescription className='text-sm'>
          Keep access least-privileged: assign the smallest role needed.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <div className='flex items-start gap-3 rounded-lg border p-3'>
          <ShieldCheck className='h-5 w-5 text-indigo-600 shrink-0' />
          <div className='text-sm'>
            <p className='font-medium'>Super admin</p>
            <p className='text-muted-foreground'>
              Full control, manage admins & settings.
            </p>
          </div>
        </div>
        <div className='flex items-start gap-3 rounded-lg border p-3'>
          <Settings2 className='h-5 w-5 text-emerald-600 shrink-0' />
          <div className='text-sm'>
            <p className='font-medium'>Content manager</p>
            <p className='text-muted-foreground'>
              Manage news, newsletters & announcements.
            </p>
          </div>
        </div>
        <div className='flex items-start gap-3 rounded-lg border p-3'>
          <FileText className='h-5 w-5 text-sky-600 shrink-0' />
          <div className='text-sm'>
            <p className='font-medium'>News editor</p>
            <p className='text-muted-foreground'>
              Write & edit news articles only.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
