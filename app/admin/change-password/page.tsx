'use client'

import ChangePasswordForm from '@/components/admin/account/change-password-form'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function ChangePasswordPage() {
  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />
      <main className='flex-1 overflow-auto'>
        <div className='p-6'>
          <div className='mb-6 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
            <div className='px-5 py-5'>
              <h1 className='text-2xl font-bold'>Change Password</h1>
              <p className='text-sm text-muted-foreground'>
                Keep your account secure by choosing a strong, unique password.
              </p>
            </div>
          </div>
          <ChangePasswordForm />
        </div>
      </main>
    </div>
  )
}
