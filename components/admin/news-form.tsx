"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toParagraphHtml, slugify } from '@/lib/text'

type NewsFormValues = {
  _id?: string
  title: string
  author: string
  date: string
  image: string
  tags: string
  status: 'active' | 'inactive'
  content: string
  slug?: string
}

export function NewsForm({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: Partial<NewsFormValues>
  onSaved?: () => void
}) {
  const [values, setValues] = useState<NewsFormValues>({
    title: '',
    author: '',
    date: new Date().toISOString().slice(0, 10),
    image: '',
    tags: '',
    status: 'active',
    content: '',
  })
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(initial && (initial as any)._id)

  useEffect(() => {
    if (open) {
      setValues((v) => ({
        ...v,
        title: initial?.title || '',
        author: initial?.author || '',
        date: (initial?.date as string) || new Date().toISOString().slice(0, 10),
        image: (initial as any)?.image || '',
        tags: Array.isArray((initial as any)?.tags)
          ? ((initial as any)?.tags || []).join(', ')
          : (initial?.tags as any) || '',
        status: (initial?.status as any) || 'active',
        content: (initial?.content as any) || '',
        slug: (initial as any)?.slug,
        _id: (initial as any)?._id,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const tagList = useMemo(
    () =>
      (values.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [values.tags],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: values.title.trim(),
        author: values.author.trim(),
        date: values.date,
        image: values.image.trim(),
        tags: tagList,
        status: values.status,
        content: toParagraphHtml(values.content),
        slug: values.slug || slugify(values.title),
      }
      const res = await fetch(isEdit ? `/api/news/${values._id || values.slug}` : '/api/news', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      onSaved?.()
      onOpenChange(false)
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save news. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit News' : 'Create News'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium'>Title</label>
              <Input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} required />
            </div>
            <div>
              <label className='text-sm font-medium'>Author</label>
              <Input value={values.author} onChange={(e) => setValues({ ...values, author: e.target.value })} required />
            </div>
            <div>
              <label className='text-sm font-medium'>Date</label>
              <Input type='date' value={values.date} onChange={(e) => setValues({ ...values, date: e.target.value })} required />
            </div>
            <div>
              <label className='text-sm font-medium'>Image URL</label>
              <Input value={values.image} onChange={(e) => setValues({ ...values, image: e.target.value })} required />
            </div>
            <div className='md:col-span-2'>
              <label className='text-sm font-medium'>Tags (comma separated)</label>
              <Input value={values.tags} onChange={(e) => setValues({ ...values, tags: e.target.value })} />
              {tagList.length > 0 && (
                <div className='mt-2 flex gap-2 flex-wrap'>
                  {tagList.map((t) => (
                    <Badge key={t} variant='outline' className='capitalize'>
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className='md:col-span-2'>
              <label className='text-sm font-medium'>Content</label>
              <Textarea
                rows={10}
                placeholder={'Type or paste content. Blank line = new paragraph.'}
                value={values.content}
                onChange={(e) => setValues({ ...values, content: e.target.value })}
              />
              <p className='text-xs text-muted-foreground mt-1'>Paragraphs are detected automatically. HTML with &lt;p&gt; tags is also supported.</p>
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='secondary' onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type='submit' disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
