'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

export default function EventToolbar({
  q,
  setQ,
  onCreate,
}: {
  q: string
  setQ: (v: string) => void
  onCreate: () => void
}) {
  return (
    <>
      <div className='mb-8 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
        <div className='px-6 py-6 flex items-center justify-between'>
          <div>
            <h1 className='font-heading text-3xl font-bold'>Events</h1>
            <p className='text-muted-foreground'>Manage upcoming activities</p>
          </div>
          <Button
            onClick={onCreate}
            className='cursor-pointer bg-indigo-600 hover:bg-indigo-700'
          >
            <Plus className='mr-2 h-4 w-4' /> Create Event
          </Button>
        </div>
      </div>

      <div className='mb-4'>
        <Input
          placeholder='Search title, location, region, area…'
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className='h-10 w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
        />
      </div>
    </>
  )
}
