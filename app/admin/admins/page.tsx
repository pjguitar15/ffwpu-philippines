'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import type { AdminUser } from '@/types/admin'
import { RolesGuide } from '@/components/admin/users/roles-guide'
import { AdminIdCard } from '@/components/admin/users/admin-id-card'
import { CreateAdminDialog } from '@/components/admin/users/create-admin-dialog'
// import { CredentialsDialog } from '@/components/admin/users/credentials-dialog'
import { ChangeRoleDialog } from '@/components/admin/users/change-role.dialog'
import AdminUserCardSkeleton from '@/components/ui/skeleton/admin-user-card-skeleton'

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  // create dialog state
  const [showCreate, setShowCreate] = useState(false)
  // invite flow no longer shows credentials inline
  // role dialog state
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    let mounted = true
    ;;(async () => {
      try {
        const res = await fetch('/api/admins', { cache: 'no-store' })
        if (res.ok) {
          const data = (await res.json()) as AdminUser[]
          if (mounted) setUsers(data)
        } else {
          const data = await res.json().catch(() => ({}))
          toast({
            title: 'Failed to load',
            description: data.error || 'Could not fetch admin users.',
            variant: 'destructive',
          })
        }
      } catch {
        toast({
          title: 'Network error',
          description: 'Please check your connection and try again.',
          variant: 'destructive',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [toast])

  // Actions wired to card
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Copied', description: 'Copied to clipboard.' })
    } catch {}
  }
  const openRoleModal = (u: AdminUser) => {
    setRoleUser(u)
    setRoleModalOpen(true)
  }

  const resetPassword = async (id: string) => {
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetPassword: true }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: data.error || 'Failed to reset password',
          variant: 'destructive',
        })
        return
      }
      const data = (await res.json()) as {
        credentials?: { email: string; password: string }
      }
      if (data.credentials) {
        await navigator.clipboard.writeText(
          `Email: ${data.credentials.email}\nPassword: ${data.credentials.password}`,
        )
        toast({ title: 'Password reset', description: 'New password copied.' })
      } else {
        toast({
          title: 'Password reset',
          description: 'Password reset successfully.',
        })
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  const removeUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admins/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete user',
          variant: 'destructive',
        })
        return
      }
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast({ title: 'User deleted', description: 'The admin was removed.' })
    } catch {
      toast({
        title: 'Network error',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Create dialog callback -> update grid + open creds dialog
  const handleCreated = (user: AdminUser) => {
    setUsers((u) => [user, ...u])
  }

  // Role dialog callback
  const handleRoleUpdated = (updated: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
  }

  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />

      <main className='flex-1 overflow-auto'>
        <div className='p-6'>
          <RolesGuide />

          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-2xl font-bold'>Admin Users</h1>
              <p className='text-sm text-muted-foreground'>
                Manage admin accounts and roles.
              </p>
            </div>
            <Button
              className='cursor-pointer'
              onClick={() => setShowCreate(true)}
            >
              <Plus className='h-4 w-4 mr-2' /> New Admin
            </Button>
          </div>

          {/* Grid */}
          {loading ? (
            <AdminUserCardSkeleton />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              {users.map((u) => (
                <AdminIdCard
                  key={u.id}
                  user={u}
                  onCopyEmail={(email: string) => copyText(email)}
                  onOpenRoleModal={openRoleModal}
                  onResetPassword={resetPassword}
                  onRemoveUser={removeUser}
                />
              ))}
            </div>
          )}

          {/* Create admin */}
          <CreateAdminDialog
            open={showCreate}
            onOpenChange={setShowCreate}
            onCreated={handleCreated}
          />

          {/* Credentials dialog removed: invitations are emailed */}

          {/* Change role dialog */}
          <ChangeRoleDialog
            open={roleModalOpen}
            user={roleUser}
            onClose={() => setRoleModalOpen(false)}
            onUpdated={handleRoleUpdated}
          />
        </div>
      </main>
    </div>
  )
}
