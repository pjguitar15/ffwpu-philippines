'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Settings2, ShieldCheck, Loader2 } from 'lucide-react'
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
        /* noop */
      }
    }
    try {
      const txt = await res.text()
      return txt || res.statusText || 'Request failed'
    } catch {
      return res.statusText || 'Request failed'
    }
  }

  const createUser = useCallback(async () => {
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
        toast({ title: 'Error', description: message, variant: 'destructive' })
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
  }, [email, name, role, toast, onCreated, onOpenChange])

  // Submit on Enter
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (!creating) createUser()
    }
  }

  const roleButton = (
    value: AdminRole,
    label: string,
    desc: string,
    Icon: React.ElementType,
  ) => {
    const active = role === value
    return (
      <button
        type='button'
        onClick={() => setRole(value)}
        aria-pressed={active}
        disabled={creating}
        className={[
          'group relative flex flex-col items-start rounded-xl border p-3 text-left transition',
          active
            ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/30'
            : 'border-border hover:bg-muted/60',
        ].join(' ')}
      >
        <div className='flex items-center gap-2'>
          <span
            className={[
              'inline-flex h-8 w-8 items-center justify-center rounded-lg',
              active
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
            ].join(' ')}
          >
            <Icon className='h-4 w-4' />
          </span>
          <span className='font-medium'>{label}</span>
        </div>
        <p className='mt-1 text-xs text-muted-foreground'>{desc}</p>
      </button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg' onKeyDown={onKeyDown}>
        <DialogHeader className='space-y-1'>
          <DialogTitle>Create Admin</DialogTitle>
          <DialogDescription>
            Invite a new admin by email and choose their role. Press{' '}
            <kbd className='px-1 py-0.5 rounded border'>⌘</kbd>/
            <kbd className='px-1 py-0.5 rounded border'>Ctrl</kbd> +{' '}
            <kbd className='px-1 py-0.5 rounded border'>Enter</kbd> to submit.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className='space-y-5'>
          <div className='grid grid-cols-1 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Juan Dela Cruz'
                disabled={creating}
                className='h-10'
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
                disabled={creating}
                className='h-10'
              />
              <p className='text-xs text-muted-foreground'>
                An invite with a set-password link will be emailed to this
                address.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className='h-px bg-border' />

          {/* Role picker (segmented cards) */}
          <div className='space-y-2'>
            <Label>Role</Label>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
              {roleButton(
                'news_editor',
                'News editor',
                'Create & edit news and announcements.',
                FileText,
              )}
              {roleButton(
                'content_manager',
                'Content manager',
                'Manage newsletters, pages, and media.',
                Settings2,
              )}
              {roleButton(
                'super_admin',
                'Super admin',
                'Full access to all admin features.',
                ShieldCheck,
              )}
            </div>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button type='button' onClick={createUser} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating…
              </>
            ) : (
              'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
