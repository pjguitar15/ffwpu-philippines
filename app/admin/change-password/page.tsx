'use client'

import ChangePasswordForm from '@/components/admin/account/change-password-form'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function ChangePasswordPage() {
  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />
      <main className='flex-1 overflow-auto'>
        <div className='p-6'>
          <div className='mb-6'>
            <h1 className='text-2xl font-bold'>Change Password</h1>
            <p className='text-sm text-muted-foreground'>
              Keep your account secure by choosing a strong, unique password.
            </p>
          </div>
          <ChangePasswordForm />
        </div>
      </main>
    </div>
  )
}
