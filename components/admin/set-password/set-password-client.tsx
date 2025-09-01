'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function SetPasswordClient() {
  const params = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const token = params.get('token') || ''

  const [loading, setLoading] = useState(true)
  const [valid, setValid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!token) {
        setLoading(false)
        setValid(false)
        return
      }
      try {
        const res = await fetch(
          `/api/auth/set-password/validate?token=${encodeURIComponent(token)}`,
          { cache: 'no-store' },
        )
        if (mounted) setValid(res.ok)
      } catch {
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [token])

  const submit = async () => {
    if (!token) return
    if (!password || password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Use at least 8 characters',
        variant: 'destructive',
      })
      return
    }
    if (password !== confirm) {
      toast({
        title: 'Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: data.error || 'Failed to set password',
          variant: 'destructive',
        })
        return
      }
      toast({ title: 'Password set', description: 'Redirecting…' })
      router.replace('/admin/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <Card className='w-full max-w-md p-6'>
        {loading ? (
          <div className='animate-pulse h-40' />
        ) : valid ? (
          <div className='space-y-4'>
            <div className='space-y-1'>
              <h1 className='text-xl font-semibold'>Set your password</h1>
              <p className='text-sm text-muted-foreground'>
                Create a new password to activate your admin account.
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>New password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='cursor-pointer'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirm'>Confirm password</Label>
              <Input
                id='confirm'
                type='password'
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className='cursor-pointer'
              />
            </div>
            <Button
              onClick={submit}
              disabled={submitting}
              className='w-full cursor-pointer'
            >
              {submitting ? 'Saving…' : 'Save and continue'}
            </Button>
          </div>
        ) : (
          <div className='space-y-2 text-center'>
            <h1 className='text-xl font-semibold'>Invalid or expired link</h1>
            <p className='text-sm text-muted-foreground'>
              Please contact your administrator for a new invite.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
