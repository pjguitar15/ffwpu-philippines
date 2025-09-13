'use client'

export default function EventToolbar() {
  return (
    <div className='mb-6 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
      <div className='px-6 py-6'>
        <h1 className='font-heading text-3xl font-bold'>Events</h1>
        <p className='text-muted-foreground'>Manage upcoming activities</p>
      </div>
    </div>
  )
}
