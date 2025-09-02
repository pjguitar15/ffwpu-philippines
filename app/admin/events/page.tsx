"use client"

import { useEffect, useMemo, useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, Building2, Image as ImageIcon, Link as LinkIcon, CheckCircle2, XCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

type EventItem = {
  _id?: string
  title: string
  date: string
  end?: string
  location: string
  area: 'Area 1' | 'Area 2' | 'Area 3' | 'Area 4' | 'Area 5' | 'Nationwide'
  region: string
  church?: string
  image: string
  button?: string
  href?: string
}

const AREAS: EventItem['area'][] = ['Area 1', 'Area 2', 'Area 3', 'Area 4', 'Area 5', 'Nationwide']

function Empty() {
  return (
    <div className='text-center py-10 text-muted-foreground'>
      No events yet.
    </div>
  )
}

function EventForm({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: Partial<EventItem> | null
  onSaved?: (evt: EventItem) => void
}) {
  const [values, setValues] = useState<EventItem>({
    title: '',
    date: new Date().toISOString().slice(0, 16),
    end: '',
    location: '',
    area: 'Area 1',
    region: '',
    church: '',
    image: '',
    button: '',
    href: '',
  })
  const { toast } = useToast()
  const isEdit = Boolean(initial && (initial as any)._id)

  // lightweight fallback thumbnail for broken image URLs
  const FALLBACK_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0ea5e9"/><stop offset="50%" stop-color="#6366f1"/><stop offset="100%" stop-color="#111827"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/></svg>`,
    )

  useEffect(() => {
    if (!open) return
    setValues((v) => ({
      ...v,
      title: initial?.title || '',
      date: (initial?.date as string) || new Date().toISOString().slice(0, 16),
      end: (initial?.end as string) || '',
      location: initial?.location || '',
      area: (initial?.area as any) || 'Area 1',
      region: initial?.region || '',
      church: initial?.church || '',
      image: initial?.image || '',
      button: initial?.button || '',
      href: initial?.href || '',
      _id: (initial as any)?._id,
    }))
  }, [open, initial])

  const canSubmit = useMemo(() => {
    return (
      values.title.trim() &&
      values.date &&
      values.location.trim() &&
      values.region.trim() &&
      values.image.trim() &&
      values.area
    )
  }, [values])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = { ...values }
      if (!payload.end) delete (payload as any).end
      if (!payload.church) delete (payload as any).church
      if (!payload.button) delete (payload as any).button
      if (!payload.href) delete (payload as any).href
      const res = await fetch(
        isEdit ? `/api/events/${values._id}` : '/api/events',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) throw new Error(await res.text())
      const saved = await res.json()
      toast({ title: isEdit ? 'Event updated' : 'Event created' })
      onSaved?.(saved)
      onOpenChange(false)
    } catch (e) {
      console.error(e)
      toast({ title: 'Save failed', variant: 'destructive' as any })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[96vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden rounded-xl'>
        <div className='flex flex-col h-full min-h-0'>
          {/* Sticky header */}
          <div className='sticky top-0 z-10'>
            <div className='h-1 w-full bg-indigo-500' />
            <div className='px-6 py-4 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 border-b'>
              <DialogHeader>
                <DialogTitle className='text-base tracking-tight'>
                  {isEdit ? 'Edit Event' : 'Create Event'}
                </DialogTitle>
              </DialogHeader>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className='flex-1 flex flex-col min-h-0'
          >
            {/* Scrollable body */}
            <div className='flex-1 min-h-0 overflow-y-auto px-6 py-5'>
              <div className='grid grid-cols-12 gap-x-5 gap-y-4'>
                {/* Title */}
                <div className='col-span-12'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Title
                  </label>
                  <div className='relative group'>
                    <Input
                      placeholder='Event title'
                      value={values.title}
                      onChange={(e) =>
                        setValues({ ...values, title: e.target.value })
                      }
                      required
                      className='h-10 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>

                {/* Start */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Start
                  </label>
                  <div className='relative'>
                    <Calendar className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                    <Input
                      type='datetime-local'
                      placeholder='YYYY-MM-DDTHH:MM'
                      value={values.date}
                      onChange={(e) =>
                        setValues({ ...values, date: e.target.value })
                      }
                      required
                      className='h-10 pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>

                {/* End */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    End
                  </label>
                  <div className='relative'>
                    <Clock className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                    <Input
                      type='datetime-local'
                      placeholder='YYYY-MM-DDTHH:MM'
                      value={values.end || ''}
                      onChange={(e) =>
                        setValues({ ...values, end: e.target.value })
                      }
                      className='h-10 pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>

                {/* Location */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Location
                  </label>
                  <div className='relative'>
                    <MapPin className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                    <Input
                      placeholder='Venue or city'
                      value={values.location}
                      onChange={(e) =>
                        setValues({ ...values, location: e.target.value })
                      }
                      required
                      className='h-10 pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>

                {/* Area */}
                <div className='col-span-12 md:col-span-3'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Area
                  </label>
                  <Select
                    value={values.area}
                    onValueChange={(v) =>
                      setValues({ ...values, area: v as EventItem['area'] })
                    }
                  >
                    <SelectTrigger className='h-10 w-full cursor-pointer border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'>
                      <SelectValue placeholder='Choose area' />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                <div className='col-span-12 md:col-span-3'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Region
                  </label>
                  <Input
                    placeholder='e.g., NCR, Region 4A'
                    value={values.region}
                    onChange={(e) =>
                      setValues({ ...values, region: e.target.value })
                    }
                    required
                    className='h-10 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                </div>

                {/* Church */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Church (optional)
                  </label>
                  <div className='relative'>
                    <Building2 className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                    <Input
                      placeholder='Local church or chapter'
                      value={values.church || ''}
                      onChange={(e) =>
                        setValues({ ...values, church: e.target.value })
                      }
                      className='h-10 pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>

                {/* Image URL + Preview */}
                <div className='col-span-12'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Image URL
                  </label>
                  <div className='relative'>
                    <ImageIcon className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                    <Input
                      placeholder='https://example.com/image.jpg'
                      value={values.image}
                      onChange={(e) =>
                        setValues({ ...values, image: e.target.value })
                      }
                      required
                      className='h-10 pl-9 pr-28 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    />
                  </div>
                  {values.image && (
                    <div className='mt-2.5 flex items-center gap-3'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={values.image}
                        onError={(e) => {
                          if (
                            (e.currentTarget as HTMLImageElement).src !==
                            FALLBACK_IMG
                          )
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG
                        }}
                        alt='Preview'
                        className='h-24 w-40 object-cover rounded-md border'
                      />
                      <span className='text-xs text-muted-foreground'>
                        Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Button Label */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Button Label (optional)
                  </label>
                  <Input
                    placeholder='Register / Learn more'
                    value={values.button || ''}
                    onChange={(e) =>
                      setValues({ ...values, button: e.target.value })
                    }
                    className='h-10 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                </div>

                {/* Link */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Link (optional)
                  </label>
                  <div className='relative'>
                    <LinkIcon className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                    <Input
                      placeholder='https://example.com/register'
                      value={values.href || ''}
                      onChange={(e) =>
                        setValues({ ...values, href: e.target.value })
                      }
                      className='h-10 pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div className='flex-shrink-0 sticky bottom-0 w-full px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t flex justify-end gap-2'>
              <Button
                type='button'
                variant='secondary'
                onClick={() => onOpenChange(false)}
                className='cursor-pointer'
              >
                <XCircle className='h-4 w-4 mr-2' /> Cancel
              </Button>
              <Button
                type='submit'
                disabled={!canSubmit}
                className='cursor-pointer bg-indigo-600 hover:bg-indigo-700'
              >
                <CheckCircle2 className='h-4 w-4 mr-2' />
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([])
  const [filtered, setFiltered] = useState<EventItem[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<EventItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<EventItem | null>(null)
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/events')
        const data = await res.json()
        setItems(data)
        setFiltered(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    const s = q.toLowerCase()
    const next = items.filter(
      (e) =>
        e.title.toLowerCase().includes(s) ||
        e.location.toLowerCase().includes(s) ||
        e.region.toLowerCase().includes(s) ||
        e.area.toLowerCase().includes(s as any),
    )
    setFiltered(next)
    setPage(1)
  }, [q, items])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  async function remove(id?: string) {
    if (!id) return
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    setItems((it) => it.filter((e) => e._id !== id))
    setFiltered((it) => it.filter((e) => e._id !== id))
    toast({ title: 'Event deleted' })
  }

  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />
      <main className='flex-1 overflow-auto'>
        <div className='p-8'>
          {/* Header with gradient and indigo CTA */}
          <div className='mb-8 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
            <div className='px-6 py-6 flex items-center justify-between'>
              <div>
                <h1 className='font-heading text-3xl font-bold'>Events</h1>
                <p className='text-muted-foreground'>
                  Manage upcoming activities
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditItem(null)
                  setOpen(true)
                }}
                className='cursor-pointer bg-indigo-600 hover:bg-indigo-700'
              >
                <Plus className='mr-2 h-4 w-4' /> Create Event
              </Button>
            </div>
          </div>

          <Card className='mb-6 overflow-hidden border-0 shadow-sm bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 dark:to-background'>
            <div className='h-1 w-full bg-sky-500' />
            <CardHeader>
              <CardTitle className='text-lg'>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder='Search title, location, region, area…'
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className='shadow-sm overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-background dark:to-slate-950/20'>
            <div className='h-1 w-full bg-indigo-500' />
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Create, edit, and delete events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='relative -mx-2 md:mx-0 overflow-auto rounded-xl border border-border/60'>
                <Table className='min-w-[980px]'>
                  <TableHeader className='sticky top-0 z-[1] bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-900/60 dark:to-sky-950/40 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                    <TableRow className='h-14'>
                      <TableHead className='text-base'>Title</TableHead>
                      <TableHead className='text-base'>Date</TableHead>
                      <TableHead className='text-base'>Location</TableHead>
                      <TableHead className='text-base'>Area</TableHead>
                      <TableHead className='text-base'>Region</TableHead>
                      <TableHead className='text-base'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading && filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Empty />
                        </TableCell>
                      </TableRow>
                    )}
                    {loading
                      ? Array.from({ length: pageSize }).map((_, i) => (
                          <TableRow key={`sk-${i}`} className='h-16'>
                            <TableCell>
                              <div className='h-4 w-64 bg-slate-200 animate-pulse rounded' />
                            </TableCell>
                            <TableCell>
                              <div className='h-4 w-40 bg-slate-200 animate-pulse rounded' />
                            </TableCell>
                            <TableCell>
                              <div className='h-4 w-48 bg-slate-200 animate-pulse rounded' />
                            </TableCell>
                            <TableCell>
                              <div className='h-6 w-20 bg-slate-200 animate-pulse rounded-full' />
                            </TableCell>
                            <TableCell>
                              <div className='h-4 w-28 bg-slate-200 animate-pulse rounded' />
                            </TableCell>
                            <TableCell>
                              <div className='h-8 w-24 bg-slate-200 animate-pulse rounded-full' />
                            </TableCell>
                          </TableRow>
                        ))
                      : pageItems.map((e) => (
                          <TableRow
                            key={e._id}
                            className='h-16 hover:bg-sky-50/60 dark:hover:bg-sky-950/20'
                          >
                            <TableCell>
                              <div className='font-medium text-base'>
                                {e.title}
                              </div>
                              <div className='text-sm text-muted-foreground line-clamp-1'>
                                {e.church}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2 text-base'>
                                <Calendar className='h-4 w-4' />{' '}
                                {new Date(e.date).toLocaleString()}
                              </div>
                              {e.end && (
                                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                  <Clock className='h-4 w-4' />{' '}
                                  {new Date(e.end).toLocaleString()}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2 text-base'>
                                <MapPin className='h-4 w-4' /> {e.location}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className='rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-base px-3 py-1'>
                                {e.area}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-base'>
                              {e.region}
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Button
                                  variant='secondary'
                                  size='sm'
                                  onClick={() => {
                                    setEditItem(e)
                                    setOpen(true)
                                  }}
                                  className='cursor-pointer text-amber-700 hover:text-amber-800 hover:bg-amber-50'
                                >
                                  <Edit className='h-4 w-4' /> Edit
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => setDeleteItem(e)}
                                  className='text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  Page {page} of {totalPages}
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='secondary'
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className='bg-indigo-600 hover:bg-indigo-700'
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete confirm themed */}
          <Dialog
            open={Boolean(deleteItem)}
            onOpenChange={(v) => {
              if (!v) setDeleteItem(null)
            }}
          >
            <DialogContent className='max-w-sm p-0 overflow-hidden'>
              <div className='h-1 w-full bg-rose-500' />
              <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/10 border-b'>
                <DialogHeader>
                  <DialogTitle>Delete this event?</DialogTitle>
                </DialogHeader>
              </div>
              <div className='px-6 py-4'>
                <p className='text-sm text-muted-foreground'>
                  This action cannot be undone.
                </p>
                <div className='mt-2 p-3 rounded border bg-muted/40'>
                  <div className='font-medium'>{deleteItem?.title}</div>
                  <div className='text-xs text-muted-foreground'>
                    {deleteItem?.location}
                  </div>
                </div>
              </div>
              <div className='px-6 pb-4 flex justify-end gap-2'>
                <Button
                  variant='secondary'
                  onClick={() => setDeleteItem(null)}
                  className='cursor-pointer'
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={async () => {
                    if (!deleteItem?._id) return
                    await remove(deleteItem._id)
                    setDeleteItem(null)
                  }}
                  className='cursor-pointer'
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create/Edit Modal */}
          <EventForm
            open={open}
            onOpenChange={(v) => {
              setOpen(v)
              if (!v) setEditItem(null)
            }}
            initial={editItem || undefined}
            onSaved={(evt) => {
              setItems((prev) => {
                const idx = prev.findIndex((x) => x._id === (evt as any)._id)
                if (idx >= 0) {
                  const copy = prev.slice()
                  copy[idx] = evt
                  return copy
                }
                return [evt, ...prev]
              })
              setFiltered((prev) => {
                const idx = prev.findIndex((x) => x._id === (evt as any)._id)
                if (idx >= 0) {
                  const copy = prev.slice()
                  copy[idx] = evt
                  return copy
                }
                // If current search matches, include; else keep prev
                const s = q.toLowerCase()
                const matches =
                  evt.title.toLowerCase().includes(s) ||
                  evt.location.toLowerCase().includes(s) ||
                  evt.region.toLowerCase().includes(s) ||
                  (evt.area as any).toLowerCase().includes(s)
                return matches ? [evt, ...prev] : prev
              })
            }}
          />
        </div>
      </main>
    </div>
  )
}
