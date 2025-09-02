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
      <DialogContent className='p-0 overflow-hidden'>
        {/* Themed header */}
        <div className='h-1 w-full bg-indigo-500' />
        <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 border-b'>
          <DialogHeader>
            <DialogTitle>
              Change role{user ? ` for ${user.name}` : ''}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className='px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <button
            onClick={() => setSelectedRole('news_editor')}
            className={`cursor-pointer rounded-xl border p-3 text-left transition ${
              selectedRole === 'news_editor'
                ? 'ring-2 ring-sky-400 border-sky-200 bg-sky-50/40'
                : 'hover:bg-muted/60'
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
            className={`cursor-pointer rounded-xl border p-3 text-left transition ${
              selectedRole === 'content_manager'
                ? 'ring-2 ring-emerald-400 border-emerald-200 bg-emerald-50/40'
                : 'hover:bg-muted/60'
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
            className={`cursor-pointer rounded-xl border p-3 text-left transition ${
              selectedRole === 'super_admin'
                ? 'ring-2 ring-indigo-400 border-indigo-200 bg-indigo-50/40'
                : 'hover:bg-muted/60'
            }`}
          >
            <ShieldCheck className='h-5 w-5 text-indigo-600 mb-1' />
            <div className='font-medium'>Super admin</div>
            <div className='text-xs text-muted-foreground'>
              Full access and settings.
            </div>
          </button>
        </div>

        <DialogFooter className='px-6 pb-4 border-t bg-white dark:bg-slate-900'>
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
