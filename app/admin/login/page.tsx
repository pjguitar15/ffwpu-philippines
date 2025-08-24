"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Simple demo auth – replace with real auth later
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    const adminUser = {
      id: 'demo',
      email,
      role: 'admin',
      name: email.split('@')[0] || 'Admin',
    }
    try {
      localStorage.setItem('adminUser', JSON.stringify(adminUser))
    } catch {}
    router.push('/admin/dashboard')
  }

  return (
    <div className='min-h-[70vh] flex items-center justify-center py-16'>
      <form
        onSubmit={onSubmit}
        className='w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm'
      >
        <h1 className='text-2xl font-bold mb-1'>Admin Login</h1>
        <p className='text-sm text-muted-foreground mb-6'>
          Sign in to manage news, newsletters, and more.
        </p>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='username'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />
          </div>
        </div>

        {error && (
          <p className='mt-3 text-sm text-destructive' role='alert'>
            {error}
          </p>
        )}

        <Button type='submit' className='mt-6 w-full cursor-pointer'>
          Sign In
        </Button>
      </form>
    </div>
  )
}
