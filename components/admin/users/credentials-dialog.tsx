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
import { Check, Copy, Mail, Key, Share2, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function CredentialsDialog({
  open,
  email,
  password,
  onClose,
}: {
  open: boolean
  email: string
  password: string
  onClose: () => void
}) {
  const { toast } = useToast()

  // gate: allow closing after ANY copy action (email, password, or all)
  const [allowClose, setAllowClose] = useState(false)

  // visual states
  const [copiedAll, setCopiedAll] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [passCopied, setPassCopied] = useState(false)

  const copyAll = async () => {
    const text = `Admin credentials
Email: ${email}
Password: ${password}

(Please change your password after your first login.)`
    try {
      await navigator.clipboard.writeText(text)
      setAllowClose(true)
      setCopiedAll(true)
      toast({
        title: 'Copied credentials',
        description: `Email: ${email} • Temp password: ${password}`,
      })
      setTimeout(() => setCopiedAll(false), 2000)
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Your browser blocked clipboard access.',
        variant: 'destructive',
      })
    }
  }

  const copySingle = async (
    value: string,
    label: string,
    setFlag: (v: boolean) => void,
  ) => {
    try {
      await navigator.clipboard.writeText(value)
      setAllowClose(true) // <- allow closing after any single copy
      setFlag(true)
      toast({ title: `Copied ${label}`, description: value })
      setTimeout(() => setFlag(false), 1500)
    } catch {
      /* no-op */
    }
  }

  // Only block closing if nothing was copied at all
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (!allowClose) {
        toast({
          title: 'Copy required',
          description: 'Please copy at least one field before closing.',
        })
        return
      }
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onEscapeKeyDown={(e) => {
          if (!allowClose) {
            e.preventDefault()
            toast({
              title: 'Copy required',
              description: 'Please copy at least one field before closing.',
            })
          }
        }}
        onPointerDownOutside={(e) => {
          if (!allowClose) {
            e.preventDefault()
            toast({
              title: 'Copy required',
              description: 'Please copy at least one field before closing.',
            })
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ShieldCheck className='h-5 w-5 text-primary' />
            Admin Credentials
          </DialogTitle>
        </DialogHeader>

        {/* Emphasized credentials */}
        <div className='space-y-4'>
          {/* Email */}
          <div className='space-y-2'>
            <label className='text-[11px] uppercase tracking-wide text-muted-foreground inline-flex items-center gap-2'>
              <Mail className='h-3.5 w-3.5' />
              Admin Email
            </label>
            <button
              type='button'
              onClick={() => copySingle(email, 'email', setEmailCopied)}
              className='group w-full cursor-pointer rounded-xl border ring-1 ring-primary/20 bg-white px-3 py-2 text-left transition hover:ring-primary/40'
              title='Click to copy email'
            >
              <div className='flex items-center justify-between'>
                <span className='font-mono text-base font-semibold tracking-wide'>
                  {email}
                </span>
                {emailCopied ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <Copy className='h-4 w-4 opacity-70 group-hover:opacity-100' />
                )}
              </div>
            </button>
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <label className='text-[11px] uppercase tracking-wide text-muted-foreground inline-flex items-center gap-2'>
              <Key className='h-3.5 w-3.5' />
              Temporary Password
            </label>
            <button
              type='button'
              onClick={() =>
                copySingle(password, 'temporary password', setPassCopied)
              }
              className='group w-full cursor-pointer rounded-xl border ring-1 ring-primary/20 bg-white px-3 py-2 text-left transition hover:ring-primary/40'
              title='Click to copy password'
            >
              <div className='flex items-center justify-between'>
                <span className='font-mono text-base font-semibold tracking-wide'>
                  {password}
                </span>
                {passCopied ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <Copy className='h-4 w-4 opacity-70 group-hover:opacity-100' />
                )}
              </div>
            </button>
          </div>

          {/* Subtle guidance (secondary to creds) */}
          <div className='mt-1 rounded-lg border bg-muted/30 p-3 text-sm'>
            <div className='flex items-start gap-2'>
              <Share2 className='h-4 w-4 mt-0.5 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='font-medium'>Share securely</p>
                <p className='text-muted-foreground'>
                  Send these one-time credentials to the intended admin only,
                  and remind them to{' '}
                  <span className='font-semibold'>
                    change their password immediately
                  </span>{' '}
                  after first login.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            className='cursor-pointer'
            disabled={!allowClose}
            title={
              !allowClose
                ? 'Copy at least one field to enable closing'
                : undefined
            }
          >
            Close
          </Button>
          <Button
            onClick={copyAll}
            className='cursor-pointer'
            aria-live='polite'
          >
            {copiedAll ? (
              <span className='inline-flex items-center gap-2'>
                <Check className='h-4 w-4' />
                Copied
              </span>
            ) : (
              <span className='inline-flex items-center gap-2'>
                <Copy className='h-4 w-4' />
                Copy all
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
