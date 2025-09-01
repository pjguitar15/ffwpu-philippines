'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  ShieldCheck,
  AlertCircle,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react'

type PublicAdmin = {
  id: string
  name: string
  role: 'super_admin' | 'content_manager' | 'news_editor'
  emailVerified?: boolean
}

export default function VerifyChangePasswordClient({ id, token }: { id?: string; token?: string }) {
  const router = useRouter()
  const [data, setData] = useState<PublicAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [me, setMe] = useState<{ email: string; name?: string } | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)

  // form state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // fetch user basic info
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    const ctrl = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admins/${encodeURIComponent(id)}`, {
          signal: ctrl.signal,
          cache: 'no-store',
        })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || res.statusText)
        }
        const j = (await res.json()) as {
          id: string
          name: string
          role: PublicAdmin['role']
        }
        setData(j as PublicAdmin)
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
    return () => ctrl.abort()
  }, [id])

  // Check if someone is already logged in; if yes, block and ask to logout
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        if (!mounted) return
        if (res.ok) {
          const j = await res.json().catch(() => ({}))
          setMe({ email: j?.email, name: j?.name })
        } else {
          setMe(null)
        }
      } catch {
        setMe(null)
      } finally {
        if (mounted) setCheckingSession(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // If account is already verified, do not show this page
  useEffect(() => {
    if (checkingSession || loading) return
    if (me) {
      // already signed in, go to admin
      router.replace('/admin')
      return
    }
    if (data?.emailVerified) {
      // not signed in but account verified – send to login
      router.replace('/admin/login')
    }
  }, [checkingSession, loading, me, data?.emailVerified, router])

  // password validations
  const pwIssues = useMemo(() => {
    const issues: string[] = []
    if (newPassword.length < 8) issues.push('At least 8 characters')
    if (confirmPassword && newPassword !== confirmPassword)
      issues.push('Passwords do not match')
    return issues
  }, [newPassword, confirmPassword])

  const canSubmit = Boolean(
  id && token && newPassword && confirmPassword && pwIssues.length === 0,
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !id) return
    setSubmitting(true)
    setError(null)
    try {
      // prefer invite token path (no current password)
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ token, newPassword }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || res.statusText)
      }
  // Redirect to /admin immediately after success
  router.replace('/admin')
  return
    } catch (e: any) {
      setError(e?.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4'>
      <div role='status' aria-live='polite' className='w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-lg p-8'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <ShieldCheck className='h-6 w-6 text-blue-600 dark:text-blue-400' />
          <div>
            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>Secure your account</h1>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Set a new password to activate your admin access.</p>
          </div>
        </div>

        {/* Missing id */}
        {!loading && !id && (
          <div className='flex items-start gap-3 text-gray-700 dark:text-gray-300'>
            <AlertCircle className='h-5 w-5 text-amber-600 mt-0.5' />
            <div>
              <p className='font-medium'>Missing id</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                This page expects <code className='font-mono'>?id=...</code>.
              </p>
            </div>
          </div>
        )}

        {/* Missing token */}
        {!loading && id && !token && (
          <div className='flex items-start gap-3 text-gray-700 dark:text-gray-300'>
            <AlertCircle className='h-5 w-5 text-amber-600 mt-0.5' />
            <div>
              <p className='font-medium'>Invalid link</p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                This link is missing a security token. Please open the link from your invitation email.
              </p>
            </div>
          </div>
        )}

  {/* Loading */}
  {(loading || checkingSession) && (
          <div className='flex flex-col items-center justify-center gap-2 py-6'>
            <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
            <p className='text-sm text-gray-500 dark:text-gray-400'>Loading…</p>
          </div>
        )}

        {/* Error (load) */}
        {!loading && error && !done && (
          <div className='flex items-start gap-3 text-red-700 dark:text-red-400'>
            <AlertCircle className='h-5 w-5 mt-0.5' />
            <div>
              <p className='font-medium'>Something went wrong</p>
              <p className='text-sm'>{error}</p>
            </div>
          </div>
        )}

        {/* Block if already signed in */}
        {!loading && !done && !error && me && (
          <div className='rounded-md border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200 p-4 mb-4'>
            <p className='font-semibold'>You’re already signed in</p>
            <p className='text-sm mt-1'>
              You’re signed in as <span className='font-mono'>{me.email || 'current user'}</span>. To accept this invite and set a new password, please log out first.
            </p>
            <div className='mt-3'>
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' })
                  } catch {}
                  window.location.reload()
                }}
                className='inline-flex items-center rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-semibold hover:bg-blue-700'
              >
                Log out and continue
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {!loading && done && (
          <div className='flex items-start gap-3 text-green-700 dark:text-green-400'>
            <CheckCircle2 className='h-5 w-5 mt-0.5' />
            <div>
              <p className='font-medium'>Password updated</p>
              <p className='text-sm'>
                You’re now signed in. You can close this tab or go to the admin
                dashboard.
              </p>
            </div>
          </div>
        )}

  {/* Content */}
  {!loading && !done && !error && !me && data && !data.emailVerified && (
          <form onSubmit={onSubmit} className='space-y-6'>
            {/* User summary */}
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <div className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                  <User className='h-6 w-6 text-blue-700 dark:text-blue-300' />
                </div>
                <div>
                  <p className='font-semibold text-gray-900 dark:text-gray-100'>
                    {data.name || 'Unnamed user'}
                  </p>
                  <p className='text-[11px] text-gray-500 dark:text-gray-400'>
                    For security, we can’t display your current password.
                  </p>
                </div>
              </div>
              <span
                className='inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide border shadow-sm'
                style={{
                  color:
                    data.role === 'super_admin'
                      ? '#7c2d12'
                      : data.role === 'content_manager'
                      ? '#1e3a8a'
                      : '#065f46',
                  background:
                    data.role === 'super_admin'
                      ? 'linear-gradient(to right, #ffedd5, #fed7aa)'
                      : data.role === 'content_manager'
                      ? 'linear-gradient(to right, #dbeafe, #bfdbfe)'
                      : 'linear-gradient(to right, #d1fae5, #a7f3d0)',
                  borderColor:
                    data.role === 'super_admin'
                      ? '#fed7aa'
                      : data.role === 'content_manager'
                      ? '#bfdbfe'
                      : '#a7f3d0',
                }}
                aria-label={`Role ${data.role}`}
                title={`Role: ${data.role}`}
              >
                {data.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* New password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                New password
              </label>
              <div className='relative'>
                <input
                  type={showNew ? 'text' : 'password'}
                  className='w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete='new-password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowNew((s) => !s)}
                  className='absolute inset-y-0 right-2 flex items-center text-gray-500'
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {/* Validation inline help */}
        {newPassword && (
                <ul className='mt-2 text-xs space-y-1'>
          {['At least 8 characters'].map((rule) => {
                    const ok =
            rule === 'At least 8 characters' && newPassword.length >= 8
                    return (
                      <li
                        key={rule}
                        className={
                          ok
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }
                      >
                        {ok ? '✓' : '•'} {rule}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Confirm new password
              </label>
              <div className='relative'>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className='w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete='new-password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm((s) => !s)}
                  className='absolute inset-y-0 right-2 flex items-center text-gray-500'
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            {/* Cross-field messages */}
            <div className='text-xs'>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className='text-amber-600'>Passwords do not match.</p>
              )}
            </div>

            {/* Submit */}
            <div className='pt-1'>
              <button
                type='submit'
                disabled={!canSubmit || submitting}
                className={[
                  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold',
                  canSubmit && !submitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-600/60 text-white cursor-not-allowed',
                ].join(' ')}
              >
                {submitting ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' /> Updating…
                  </>
                ) : (
                  'Save and sign in'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
