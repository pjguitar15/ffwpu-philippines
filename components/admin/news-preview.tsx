"use client"

import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ArticleBody } from '@/components/news/article-body'

type Item = {
  _id?: string
  id?: string
  slug?: string
  title: string
  author: string
  date: string
  image: string
  tags?: string[]
  status?: string
  content?: string
}

export function NewsPreviewDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  item: Item | null
}) {
  const [fullItem, setFullItem] = useState<Item | null>(null)

  // When opened, if we don't have content yet, fetch by id/slug
  useEffect(() => {
    let abort = false
    async function load() {
      if (!open || !item) return
      // If content already present, use it
      if (item.content) {
        setFullItem(item)
        return
      }
      try {
        const key = (item as any)._id || item.id || item.slug
        if (!key) {
          setFullItem(item)
          return
        }
        const res = await fetch(`/api/news/${key}`)
        const data = res.ok ? await res.json() : item
        if (!abort) setFullItem(data)
      } catch {
        if (!abort) setFullItem(item)
      }
    }
    load()
    return () => {
      abort = true
    }
  }, [open, item])

  const contentHtml = fullItem?.content || ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[96vw] sm:max-w-5xl h-[90vh] p-0 gap-0 overflow-hidden'>
        <div className='flex flex-col h-full min-h-0'>
          {/* Themed header */}
          <div className='mb-0'>
            <div className='h-1 w-full bg-indigo-500' />
            <div className='px-6 pt-6 pb-4 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 border-b'>
              <DialogHeader>
                <DialogTitle>
                  Preview: {fullItem?.title || item?.title}
                </DialogTitle>
              </DialogHeader>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto px-6 pb-6 min-h-0'>
            {fullItem ? (
              <div>
                {/* Hero image */}
                {fullItem.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fullItem.image}
                    alt={fullItem.title}
                    className='w-full h-64 object-cover rounded-lg ring-1 ring-black/10 shadow'
                  />
                )}

                {/* Title + meta */}
                <div className='mt-6'>
                  <div className='text-sm text-slate-600/90 font-semibold mb-1'>
                    <span>{fullItem.author}</span> •{' '}
                    <span>{new Date(fullItem.date).toLocaleDateString()}</span>
                  </div>
                  <h1 className='text-2xl md:text-3xl font-extrabold leading-tight'>
                    {fullItem.title}
                  </h1>
                  {fullItem.tags?.length ? (
                    <div className='mt-3 flex flex-wrap gap-2'>
                      {fullItem.tags.map((t) => (
                        <Badge
                          key={t}
                          variant='secondary'
                          className='rounded-full border border-sky-200 bg-sky-50 text-sky-700'
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Body */}
                <ArticleBody content={contentHtml} />
              </div>
            ) : (
              <div className='p-6 text-sm text-muted-foreground'>Loading…</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewsPreviewDialog
