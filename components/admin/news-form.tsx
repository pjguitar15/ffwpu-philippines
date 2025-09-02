"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toParagraphHtml, slugify, htmlToText } from '@/lib/text'
import RichTextEditor from '@/components/admin/rich-text-editor'
import { Calendar, ImageIcon, Tag, Type, User, FileText } from 'lucide-react'

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
        date:
          (initial?.date as string) || new Date().toISOString().slice(0, 10),
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

  const canSubmit = useMemo(() => {
    const titleOk = values.title.trim().length > 0
    const authorOk = values.author.trim().length > 0
    const dateOk = (values.date || '').trim().length > 0
    const imageOk = values.image.trim().length > 0
    const contentOk = htmlToText(values.content).trim().length > 0
    return titleOk && authorOk && dateOk && imageOk && contentOk
  }, [values.title, values.author, values.date, values.image, values.content])

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
      const res = await fetch(
        isEdit ? `/api/news/${values._id || values.slug}` : '/api/news',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
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
      <DialogContent className='w-[95vw] sm:max-w-3xl md:max-w-4xl h-[90vh] sm:h-[85vh] p-0 overflow-hidden'>
        <div className='flex flex-col h-full min-h-0'>
          {/* Themed header: thin indigo bar + subtle sky→indigo gradient */}
          <div className='mb-5'>
            <div className='h-1 w-full bg-indigo-500' />
            <div className='px-6 pt-6 pb-4 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 border-b'>
              <DialogHeader>
                <DialogTitle className='text-foreground'>
                  {isEdit ? 'Edit News' : 'Create News'}
                </DialogTitle>
              </DialogHeader>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className='flex-1 flex flex-col min-h-0'
          >
            {/* Scrollable content area; bottom padding ensures content not hidden behind footer */}
            <div className='flex-1 min-h-0 overflow-y-auto px-6 pb-6 pr-7'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium flex items-center gap-2 mb-1.5'>
                    <Type className='h-4 w-4 text-sky-600 dark:text-sky-300' />{' '}
                    Title
                  </label>
                  <Input
                    placeholder='Enter article title'
                    value={values.title}
                    onChange={(e) =>
                      setValues({ ...values, title: e.target.value })
                    }
                    required
                    className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium flex items-center gap-2 mb-1.5'>
                    <User className='h-4 w-4 text-sky-600 dark:text-sky-300' />{' '}
                    Author
                  </label>
                  <Input
                    placeholder='Author name'
                    value={values.author}
                    onChange={(e) =>
                      setValues({ ...values, author: e.target.value })
                    }
                    required
                    className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium flex items-center gap-2 mb-1.5'>
                    <Calendar className='h-4 w-4 text-sky-600 dark:text-sky-300' />{' '}
                    Date
                  </label>
                  <Input
                    type='date'
                    placeholder='YYYY-MM-DD'
                    value={values.date}
                    onChange={(e) =>
                      setValues({ ...values, date: e.target.value })
                    }
                    required
                    className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium flex items-center gap-2 mb-1.5'>
                    <ImageIcon className='h-4 w-4 text-sky-600 dark:text-sky-300' />{' '}
                    Image URL
                  </label>
                  <Input
                    placeholder='https://example.com/image.jpg'
                    value={values.image}
                    onChange={(e) =>
                      setValues({ ...values, image: e.target.value })
                    }
                    required
                    className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='text-sm font-medium flex items-center gap-2 mb-1.5'>
                    <Tag className='h-4 w-4 text-sky-600 dark:text-sky-300' />{' '}
                    Tags (comma separated)
                  </label>
                  <Input
                    placeholder='family, community, service'
                    value={values.tags}
                    onChange={(e) =>
                      setValues({ ...values, tags: e.target.value })
                    }
                    className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                  {tagList.length > 0 && (
                    <div className='mt-2 flex gap-2 flex-wrap'>
                      {tagList.map((t) => (
                        <Badge
                          key={t}
                          variant='secondary'
                          className='capitalize text-[11px] rounded-full border border-sky-200 bg-sky-50 text-sky-700 px-2 py-0.5'
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className='md:col-span-2'>
                  <label className='text-sm font-medium flex items-center gap-2 mb-1.5'>
                    <FileText className='h-4 w-4 text-sky-600 dark:text-sky-300' />{' '}
                    Content
                  </label>
                  <div className='mt-1 rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950'>
                    <RichTextEditor
                      value={values.content}
                      onChange={(html) =>
                        setValues({ ...values, content: html })
                      }
                      placeholder='Write the article…'
                    />
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    Use the toolbar to format text (bold, italic, underline,
                    lists, headings, links).
                  </p>
                </div>
              </div>
            </div>
            {/* Footer anchored at the bottom via flex layout */}
            <div className='flex-shrink-0 w-full px-6 py-3 bg-white dark:bg-slate-900 border-t flex justify-end gap-2'>
              <Button
                type='button'
                variant='secondary'
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className='cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={saving || !canSubmit}
                aria-disabled={saving || !canSubmit}
                className='cursor-pointer bg-indigo-600 hover:bg-indigo-700'
              >
                {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
