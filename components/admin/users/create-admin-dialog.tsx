'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Settings2, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { AdminRole, AdminUser } from '@/types/admin'

export function CreateAdminDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated: (
    user: AdminUser,
    creds?: { email: string; password: string },
  ) => void
}) {
  const { toast } = useToast()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminRole>('news_editor')

  const validRoles: AdminRole[] = [
    'news_editor',
    'content_manager',
    'super_admin',
  ]
  const isEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim().toLowerCase())

  async function parseErrorFromResponse(res: Response): Promise<string> {
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      try {
        const data = await res.json()
        return (data?.error ||
          data?.message ||
          res.statusText ||
          'Request failed') as string
      } catch {
        /* fall through */
      }
    }
    try {
      const txt = await res.text()
      return txt || res.statusText || 'Request failed'
    } catch {
      return res.statusText || 'Request failed'
    }
  }

  const createUser = async () => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName) {
      toast({
        title: 'Name required',
        description: 'Please enter a name.',
        variant: 'destructive',
      })
      return
    }
    if (!trimmedEmail || !isEmail(trimmedEmail)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      })
      return
    }
    if (!validRoles.includes(role)) {
      toast({
        title: 'Invalid role',
        description: 'Please choose a valid role.',
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, role }),
      })

      if (!res.ok) {
        const message = await parseErrorFromResponse(res)
        toast({ title: 'Error', description: message, variant: 'destructive' }) // ← e.g. “Email already exists”
        return
      }

      const data = (await res.json()) as {
        user: AdminUser
        invite?: { sent: boolean }
      }
      onCreated(data.user)

      // Reset + close
      setName('')
      setEmail('')
      setRole('news_editor')
      onOpenChange(false)

      toast({
        title: 'Invite sent',
        description: `We emailed a set-password link to ${data.user.email}.`,
      })
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        'Network error. Please try again.'
      toast({ title: 'Error', description: message, variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Admin</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Juan Dela Cruz'
              className='cursor-pointer'
              disabled={creating}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='admin@example.com'
              className='cursor-pointer'
              disabled={creating}
            />
          </div>

          <div className='space-y-2'>
            <Label>Role</Label>
            <div className='grid grid-cols-3 gap-2'>
              <Button
                type='button'
                variant={role === 'news_editor' ? 'default' : 'outline'}
                onClick={() => setRole('news_editor')}
                className='cursor-pointer'
                disabled={creating}
              >
                <FileText className='h-4 w-4 mr-2' /> News editor
              </Button>
              <Button
                type='button'
                variant={role === 'content_manager' ? 'default' : 'outline'}
                onClick={() => setRole('content_manager')}
                className='cursor-pointer'
                disabled={creating}
              >
                <Settings2 className='h-4 w-4 mr-2' /> Content manager
              </Button>
              <Button
                type='button'
                variant={role === 'super_admin' ? 'default' : 'outline'}
                onClick={() => setRole('super_admin')}
                className='cursor-pointer'
                disabled={creating}
              >
                <ShieldCheck className='h-4 w-4 mr-2' /> Super admin
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='cursor-pointer'
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={createUser}
            disabled={creating}
            className='cursor-pointer'
          >
            {creating ? 'Creating…' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
