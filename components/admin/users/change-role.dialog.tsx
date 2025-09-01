'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Settings2, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { AdminRole, AdminUser } from '@/types/admin'

export function ChangeRoleDialog({
  open,
  user,
  onClose,
  onUpdated, // (updatedUser) => void
}: {
  open: boolean
  user: AdminUser | null
  onClose: () => void
  onUpdated: (u: AdminUser) => void
}) {
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<AdminRole>('news_editor')

  useEffect(() => {
    if (user) setSelectedRole(user.role)
  }, [user])

  const save = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/admins/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: data.error || 'Failed to update role',
          variant: 'destructive',
        })
        return
      }
      onUpdated({ ...user, role: selectedRole })
      toast({
        title: 'Role updated',
        description: `New role: ${selectedRole.replace('_', ' ')}`,
      })
      onClose()
    } catch {
      toast({
        title: 'Network error',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Change role{user ? ` for ${user.name}` : ''}
          </DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <button
            onClick={() => setSelectedRole('news_editor')}
            className={`cursor-pointer rounded-xl border p-3 text-left transition hover:bg-muted ${
              selectedRole === 'news_editor' ? 'ring-2 ring-sky-400' : ''
            }`}
          >
            <FileText className='h-5 w-5 text-sky-600 mb-1' />
            <div className='font-medium'>News editor</div>
            <div className='text-xs text-muted-foreground'>
              Create & edit news articles.
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('content_manager')}
            className={`cursor-pointer rounded-xl border p-3 text-left transition hover:bg-muted ${
              selectedRole === 'content_manager'
                ? 'ring-2 ring-emerald-400'
                : ''
            }`}
          >
            <Settings2 className='h-5 w-5 text-emerald-600 mb-1' />
            <div className='font-medium'>Content manager</div>
            <div className='text-xs text-muted-foreground'>
              Newsletters & announcements too.
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('super_admin')}
            className={`cursor-pointer rounded-xl border p-3 text-left transition hover:bg-muted ${
              selectedRole === 'super_admin' ? 'ring-2 ring-indigo-400' : ''
            }`}
          >
            <ShieldCheck className='h-5 w-5 text-indigo-600 mb-1' />
            <div className='font-medium'>Super admin</div>
            <div className='text-xs text-muted-foreground'>
              Full access and settings.
            </div>
          </button>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button onClick={save} className='cursor-pointer'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
