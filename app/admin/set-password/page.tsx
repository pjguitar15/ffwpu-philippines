import SetPasswordClient from '@/components/admin/set-password/set-password-client'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center p-6'>
          <div className='w-full max-w-md rounded-xl border bg-card p-6'>
            <div className='h-40 animate-pulse' />
          </div>
        </div>
      }
    >
      <SetPasswordClient />
    </Suspense>
  )
}
