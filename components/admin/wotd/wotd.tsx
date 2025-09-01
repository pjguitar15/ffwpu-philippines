'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminSidebar } from '../admin-sidebar'

type Quote = {
  id: string
  text: string
  author?: string
  date?: string // YYYY-MM-DD (intended publish date)
  status: 'draft' | 'published'
  tags?: string[]
}

export default function WotdAdmin({ initialList }: { initialList: Quote[] }) {
  const [list, setList] = useState<Quote[]>(initialList || [])
  const [form, setForm] = useState<Quote>({
    id: '',
    text: '',
    author: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'draft',
    tags: [],
  })

  const isEdit = Boolean(form.id)

  function handle<K extends keyof Quote>(key: K, value: Quote[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function resetForm() {
    setForm({
      id: '',
      text: '',
      author: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'draft',
      tags: [],
    })
  }

  function save() {
    if (!form.text.trim()) return
    if (isEdit) {
      setList((prev) => prev.map((q) => (q.id === form.id ? { ...form } : q)))
    } else {
      setList((prev) => [{ ...form, id: Date.now().toString() }, ...prev])
    }
    resetForm()
  }

  function edit(q: Quote) {
    setForm({ ...q, tags: q.tags ?? [] })
  }

  function remove(id: string) {
    setList((prev) => prev.filter((q) => q.id !== id))
    if (form.id === id) resetForm()
  }

  // Optional: quick filter helpers
  const publishedToday = list.find(
    (q) =>
      q.status === 'published' &&
      q.date === new Date().toISOString().slice(0, 10),
  )

  return (
    <div className='flex h-screen bg-background'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left: List */}
        <Card className='lg:col-span-1'>
          <CardHeader className='flex items-center justify-between flex-row'>
            <CardTitle className='text-lg'>Entries</CardTitle>
            <Button size='sm' variant='outline' onClick={resetForm}>
              New
            </Button>
          </CardHeader>
          <CardContent className='space-y-2'>
            {publishedToday && (
              <div className='rounded-md border p-3 bg-emerald-50 dark:bg-emerald-950/20'>
                <div className='text-xs text-emerald-700 dark:text-emerald-300 mb-1'>
                  Today’s Published
                </div>
                <div className='text-sm italic'>“{publishedToday.text}”</div>
                {publishedToday.author && (
                  <div className='text-xs text-muted-foreground mt-1'>
                    — {publishedToday.author}
                  </div>
                )}
              </div>
            )}

            {list.length === 0 && (
              <p className='text-sm text-muted-foreground'>No quotes yet.</p>
            )}

            <div className='space-y-2'>
              {list.map((q) => (
                <div
                  key={q.id}
                  className={`rounded-md border p-3 cursor-pointer hover:bg-muted/40 ${
                    form.id === q.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => edit(q)}
                >
                  <div className='flex items-center justify-between'>
                    <div className='font-medium line-clamp-1'>“{q.text}”</div>
                    <Badge
                      variant={
                        q.status === 'published' ? 'default' : 'secondary'
                      }
                    >
                      {q.status}
                    </Badge>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {q.author ? `${q.author} · ` : ''}
                    {q.date || 'No date'}
                  </div>
                  {q.tags?.length ? (
                    <div className='mt-1 flex flex-wrap gap-1'>
                      {q.tags.map((t) => (
                        <Badge
                          key={t}
                          variant='outline'
                          className='text-[10px]'
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className='mt-2'>
                    <Button
                      size='default'
                      variant='outline'
                      onClick={(e) => {
                        e.stopPropagation()
                        remove(q.id)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Form */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='text-lg'>
              {isEdit ? 'Edit Quote' : 'Create New Quote'}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='text'>Quote</Label>
              <Textarea
                id='text'
                rows={3}
                value={form.text}
                onChange={(e) => handle('text', e.target.value)}
                placeholder='e.g., “The best way to predict the future is to create it.”'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='author'>Author</Label>
                <Input
                  id='author'
                  value={form.author || ''}
                  onChange={(e) => handle('author', e.target.value)}
                  placeholder='Optional'
                />
              </div>
              <div>
                <Label htmlFor='date'>Date</Label>
                <Input
                  id='date'
                  type='date'
                  value={form.date || ''}
                  onChange={(e) => handle('date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='status'>Status</Label>
                <select
                  id='status'
                  className='border rounded px-2 py-1 text-sm w-full'
                  value={form.status}
                  onChange={(e) =>
                    handle('status', e.target.value as Quote['status'])
                  }
                >
                  <option value='draft'>Draft</option>
                  <option value='published'>Published</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor='tags'>Tags (comma-separated)</Label>
              <Input
                id='tags'
                value={(form.tags || []).join(', ')}
                onChange={(e) =>
                  handle(
                    'tags',
                    e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                placeholder='e.g., faith, unity, family'
              />
            </div>

            <div className='flex gap-2'>
              <Button onClick={save}>
                {isEdit ? 'Save Changes' : 'Add Quote'}
              </Button>
              {!isEdit && (
                <Button type='button' variant='outline' onClick={resetForm}>
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
