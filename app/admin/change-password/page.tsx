'use client'

import ChangePasswordForm from '@/components/admin/account/change-password-form'
import { Suspense } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function ChangePasswordPage() {
  return (
    <Suspense>
      <div className='flex h-screen bg-background'>
        <AdminSidebar />
        <main className='flex-1 overflow-auto'>
          <div className='p-8'>
            {/* Page header */}
            <div className='mb-6 rounded-xl border-0 shadow-sm bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/20'>
              <div className='px-6 py-5'>
                <h1 className='font-heading text-3xl font-bold'>
                  Change Password
                </h1>
                <p className='text-sm text-muted-foreground mt-1'>
                  Keep your account secure by choosing a strong, unique password.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className='max-w-3xl'>
              <ChangePasswordForm />
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
