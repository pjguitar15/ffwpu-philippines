'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'

function scorePassword(pwd: string) {
  let score = 0
  const rules = [
    /[a-z]/, // lowercase
    /[A-Z]/, // uppercase
    /[0-9]/, // number
    /[^A-Za-z0-9]/, // symbol
  ]
  rules.forEach((r) => r.test(pwd) && score++)
  if (pwd.length >= 12) score++ // length bonus
  return Math.min(score, 5) // 0..5
}

export default function ChangePasswordForm() {
  const { toast } = useToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const newScore = scorePassword(newPassword)

  const meets = useMemo(() => {
    return {
      len: newPassword.length >= 8,
      lower: /[a-z]/.test(newPassword),
      upper: /[A-Z]/.test(newPassword),
      num: /[0-9]/.test(newPassword),
      sym: /[^A-Za-z0-9]/.test(newPassword),
      match: newPassword.length > 0 && newPassword === confirmPassword,
      diffFromCurrent:
        newPassword.length > 0 && newPassword !== currentPassword,
    }
  }, [newPassword, confirmPassword])

  const valid =
    meets.len &&
    meets.lower &&
    meets.upper &&
    meets.num &&
    meets.sym &&
    meets.match &&
    meets.diffFromCurrent &&
    currentPassword.length > 0

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to change password')
      }
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Could not change password.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const Bar = ({
    filled,
    tone = 'primary',
  }: {
    filled: boolean
    tone?: 'primary' | 'warning' | 'success'
  }) => (
    <div
      className={`h-1 rounded transition-colors ${
        filled
          ? tone === 'success'
            ? 'bg-emerald-500'
            : tone === 'warning'
            ? 'bg-amber-500'
            : 'bg-primary'
          : 'bg-muted'
      }`}
    />
  )

  const Req = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className='inline-flex items-center gap-2 text-sm'>
      {ok ? (
        <CheckCircle2 className='h-4 w-4 text-emerald-600' />
      ) : (
        <Circle className='h-4 w-4 text-muted-foreground' />
      )}
      <span className={ok ? 'text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  )

  return (
    <div className='max-w-2xl'>
      <Card className='border-0 shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <KeyRound className='h-5 w-5 text-primary' />
            Change Password
          </CardTitle>
          <CardDescription className='flex items-start gap-2'>
            <Info className='h-4 w-4 mt-0.5' />
            Choose a strong password and don’t reuse passwords from other sites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className='space-y-5'>
            {/* Current */}
            <div className='space-y-2'>
              <Label
                htmlFor='current'
                className='inline-flex items-center gap-2'
              >
                <Lock className='h-4 w-4' />
                Current password
              </Label>
              <div className='relative'>
                <Input
                  id='current'
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete='current-password'
                  className='pr-10 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white/95 dark:bg-background/40 focus-visible:border-sky-500 focus-visible:ring-sky-500/30'
                  placeholder='Enter your current password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-2 grid place-items-center text-muted-foreground hover:text-foreground'
                  onClick={() => setShowCurrent((s) => !s)}
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {newPassword.length > 0 &&
                currentPassword.length > 0 &&
                !meets.diffFromCurrent && (
                  <p className='text-xs text-amber-600 inline-flex items-center gap-1 mt-1'>
                    <ShieldAlert className='h-3.5 w-3.5' />
                    New password must be different from your current password.
                  </p>
                )}
            </div>

            {/* New */}
            <div className='space-y-2'>
              <Label htmlFor='new' className='inline-flex items-center gap-2'>
                <Shield className='h-4 w-4' />
                New password
              </Label>
              <div className='relative'>
                <Input
                  id='new'
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete='new-password'
                  className='pr-10 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white/95 dark:bg-background/40 focus-visible:border-sky-500 focus-visible:ring-sky-500/30'
                  placeholder='8+ chars • upper/lower • number • symbol'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-2 grid place-items-center text-muted-foreground hover:text-foreground'
                  onClick={() => setShowNew((s) => !s)}
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>

              {/* Strength meter */}
              <div className='mt-2 space-y-2'>
                <div className='grid grid-cols-5 gap-1'>
                  <Bar filled={newScore >= 1} tone='warning' />
                  <Bar filled={newScore >= 2} tone='warning' />
                  <Bar
                    filled={newScore >= 3}
                    tone={newScore >= 4 ? 'primary' : 'warning'}
                  />
                  <Bar
                    filled={newScore >= 4}
                    tone={newScore >= 5 ? 'success' : 'primary'}
                  />
                  <Bar filled={newScore >= 5} tone='success' />
                </div>
                <div className='flex flex-wrap gap-3 mt-1'>
                  <Req ok={meets.len} label='8+ characters' />
                  <Req ok={meets.lower} label='lowercase' />
                  <Req ok={meets.upper} label='uppercase' />
                  <Req ok={meets.num} label='number' />
                  <Req ok={meets.sym} label='symbol' />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Tip: Use a passphrase with two or three random words and a
                  symbol.
                </p>
              </div>
            </div>

            {/* Confirm */}
            <div className='space-y-2'>
              <Label
                htmlFor='confirm'
                className='inline-flex items-center gap-2'
              >
                <ShieldCheck className='h-4 w-4' />
                Confirm new password
              </Label>
              <div className='relative'>
                <Input
                  id='confirm'
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete='new-password'
                  className='pr-10 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white/95 dark:bg-background/40 focus-visible:border-sky-500 focus-visible:ring-sky-500/30'
                  placeholder='Re-type your new password'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-2 grid place-items-center text-muted-foreground hover:text-foreground'
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {!meets.match && confirmPassword.length > 0 && (
                <p className='text-xs text-destructive inline-flex items-center gap-1 mt-1'>
                  <ShieldAlert className='h-3.5 w-3.5' />
                  Passwords do not match.
                </p>
              )}
            </div>

            <div className='pt-2'>
              <Button
                type='submit'
                className='cursor-pointer px-6'
                disabled={!valid || loading}
              >
                {loading ? 'Saving…' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
