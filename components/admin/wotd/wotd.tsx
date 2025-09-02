'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shuffle,
  Plus,
  CheckCircle2,
  Sparkles,
  Pencil,
  Loader2,
  Trash2,
  Calendar as CalendarIcon,
  ArrowLeft,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'

type Quote = {
  id: string
  text: string
  author?: string
  date?: string // YYYY-MM-DD
  status: 'draft' | 'published'
  tags?: string[]
}

export default function WotdAdmin({
  initialList = [] as Quote[],
}: {
  initialList?: Quote[]
}) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Quote[]>(initialList || [])
  const [currentId, setCurrentId] = useState<string | null>(null)

  // Form state (modal)
  const [form, setForm] = useState<Quote>({
    id: '',
    text: '',
    author: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'draft',
    tags: [],
  })
  const isEdit = Boolean(form.id)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPickOpen, setIsPickOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [updatingCurrent, setUpdatingCurrent] = useState(false)
  const [justChanged, setJustChanged] = useState(false)

  // Scheduling
  const [mode, setMode] = useState<'fixed' | 'random'>('fixed')
  const [changeAt, setChangeAt] = useState<string>('')
  const [scheduledId, setScheduledId] = useState<string>('')
  const [scheduleInfo, setScheduleInfo] = useState<{
    mode?: 'fixed' | 'random'
    changeAt?: string | null
    scheduledId?: string | null
  }>({})
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [calSelected, setCalSelected] = useState<Date | undefined>(undefined)
  const [calAssignments, setCalAssignments] = useState<
    Record<string, { scheduledId: string; time: string }>
  >({})
  const [calTime, setCalTime] = useState<string>('09:00')
  const [calBusy, setCalBusy] = useState(false)

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
  function openNew() {
    resetForm()
    setIsFormOpen(true)
  }
  function openEdit(q: Quote) {
    setForm({ ...q, tags: q.tags ?? [] })
    setIsFormOpen(true)
  }

  // Load entries + current
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const [itemsRes, currentRes] = await Promise.all([
          fetch('/api/wotd'),
          fetch('/api/wotd/current'),
        ])
        const items = (await itemsRes.json()) as any[]
        const current = (await currentRes.json()) as any
        setList(
          items.map((x) => ({
            id: String(x._id),
            text: x.text,
            author: x.attribution || '',
            date: x.date || '',
            status: x.status || 'draft',
            tags: Array.isArray(x.tags) ? x.tags : [],
          })),
        )
        if (current?.id) setCurrentId(String(current.id))
        if (current?.setting) {
          setScheduleInfo({
            mode: current.setting.mode,
            changeAt: current.setting.changeAt || null,
            scheduledId: current.setting.scheduledId || null,
          })
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function save() {
    if (!form.text.trim()) return
    try {
      if (isEdit) {
        const res = await fetch(`/api/wotd/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: form.text,
            attribution: form.author,
            status: form.status,
            tags: form.tags,
            date: form.date,
          }),
        })
        if (!res.ok) throw new Error('Update failed')
        const updated = await res.json()
        setList((prev) =>
          prev.map((q) =>
            q.id === form.id
              ? {
                  id: String(updated._id),
                  text: updated.text,
                  author: updated.attribution || '',
                  date: updated.date || '',
                  status: updated.status,
                  tags: Array.isArray(updated.tags) ? updated.tags : [],
                }
              : q,
          ),
        )
        toast({ title: 'Quote updated' })
      } else {
        const res = await fetch('/api/wotd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: form.text,
            attribution: form.author,
            status: form.status,
            tags: form.tags,
            date: form.date,
          }),
        })
        if (!res.ok) throw new Error('Create failed')
        const created = await res.json()
        setList((prev) => [
          {
            id: String(created._id),
            text: created.text,
            author: created.attribution || '',
            date: created.date || '',
            status: created.status,
            tags: Array.isArray(created.tags) ? created.tags : [],
          },
          ...prev,
        ])
        toast({ title: 'Quote created' })
      }
      resetForm()
    } catch (e) {
      toast({ title: 'Save failed', variant: 'destructive' as any })
    }
  }

  async function updateStatus(id: string, status: Quote['status']) {
    try {
      const item = list.find((x) => x.id === id)
      if (!item) return
      const res = await fetch(`/api/wotd/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.text,
          attribution: item.author,
          date: item.date,
          tags: item.tags,
          status,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setList((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
      toast({ title: status === 'published' ? 'Published' : 'Unpublished' })
    } catch (e) {
      toast({ title: 'Update failed', variant: 'destructive' as any })
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/wotd/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setList((prev) => prev.filter((q) => q.id !== id))
      if (form.id === id) resetForm()
      if (currentId === id) setCurrentId(null)
      toast({ title: 'Quote deleted' })
    } catch (e) {
      toast({ title: 'Delete failed', variant: 'destructive' as any })
    }
  }

  async function setCurrent(id: string) {
    try {
      setUpdatingCurrent(true)
      const res = await fetch('/api/wotd/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Failed')
      setCurrentId(id)
      setJustChanged(true)
      setTimeout(() => setJustChanged(false), 800)
      toast({ title: 'Set as current' })
    } catch (e) {
      toast({ title: 'Action failed', variant: 'destructive' as any })
    } finally {
      setUpdatingCurrent(false)
    }
  }

  async function schedule() {
    try {
      const res = await fetch('/api/wotd/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          changeAt: changeAt || null,
          scheduledId: mode === 'fixed' ? scheduledId || null : null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setScheduleInfo({
        mode,
        changeAt: changeAt || null,
        scheduledId: mode === 'fixed' ? scheduledId || null : null,
      })
      toast({ title: 'Schedule updated' })
    } catch (e) {
      toast({ title: 'Schedule failed', variant: 'destructive' as any })
    }
  }

  async function randomizeNow() {
    try {
      const now = new Date().toISOString()
      const res = await fetch('/api/wotd/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'random', changeAt: now }),
      })
      if (!res.ok) throw new Error('Failed')
      const cur = await fetch('/api/wotd/current').then((r) => r.json())
      if (cur?.id) setCurrentId(cur.id)
      toast({ title: 'Randomized' })
    } catch (e) {
      toast({ title: 'Randomize failed', variant: 'destructive' as any })
    }
  }

  function toLocalYMD(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // Load upcoming schedules into local assignments when entering calendar view
  useEffect(() => {
    if (view !== 'calendar') return
    ;(async () => {
      try {
        const res = await fetch('/api/wotd/schedule')
        const items = (await res.json()) as Array<{
          changeAt: string
          scheduledId: string | null
        }>
        const map: Record<string, { scheduledId: string; time: string }> = {}
        for (const x of items) {
          if (!x.scheduledId) continue
          const dt = new Date(x.changeAt)
          const ymd = toLocalYMD(dt)
          const hh = String(dt.getHours()).padStart(2, '0')
          const mm = String(dt.getMinutes()).padStart(2, '0')
          map[ymd] = { scheduledId: x.scheduledId, time: `${hh}:${mm}` }
        }
        setCalAssignments(map)
      } catch (e) {
        // ignore
      }
    })()
  }, [view])

  // Keep time input in sync with selected day's assignment
  useEffect(() => {
    if (!calSelected) return
    const ymd = toLocalYMD(calSelected)
    const existing = calAssignments[ymd]
    if (existing?.time) setCalTime(existing.time)
  }, [calSelected])

  async function upsertSchedule(
    dateYMD: string,
    entryId: string | null,
    time: string,
  ) {
    setCalBusy(true)
    try {
      const res = await fetch('/api/wotd/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateYMD,
          time,
          scheduledId: entryId || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setCalAssignments((prev) => {
        const next = { ...prev }
        if (entryId) next[dateYMD] = { scheduledId: entryId, time }
        else delete next[dateYMD]
        return next
      })
      toast({ title: entryId ? 'Saved' : 'Cleared' })
    } catch (e) {
      toast({ title: 'Update failed', variant: 'destructive' as any })
    } finally {
      setCalBusy(false)
    }
  }

  return (
    <div className='grid grid-cols-1 gap-6'>
      {/* Current selection (hidden in calendar view) */}
      {view === 'list' && (
        <Card className='overflow-hidden border-0 shadow-sm bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
          <div className='h-1 w-full bg-indigo-500' />
          <CardHeader className='flex items-center justify-between flex-row'>
            <div>
              <div className='flex items-center gap-2 text-sky-700/90'>
                <Sparkles className='h-5 w-5' />
                <p className='text-xs tracking-[0.2em] uppercase'>
                  Word of the Day
                </p>
              </div>
              <CardTitle className='text-xl mt-1'>
                {currentId ? 'Currently Showing' : 'No current selection yet'}
              </CardTitle>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='secondary'
                onClick={() => setIsPickOpen(true)}
                className='cursor-pointer'
                disabled={updatingCurrent}
              >
                Change
              </Button>
              <Button
                variant='secondary'
                onClick={async () => {
                  setUpdatingCurrent(true)
                  await randomizeNow()
                  setUpdatingCurrent(false)
                }}
                className='cursor-pointer'
                disabled={updatingCurrent}
              >
                {updatingCurrent ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Shuffle className='h-4 w-4 mr-2' />
                )}{' '}
                Randomize now
              </Button>
              <Button
                onClick={() => setIsScheduleOpen(true)}
                className='cursor-pointer'
              >
                Schedule…
              </Button>
              <Button
                variant='outline'
                onClick={() => setView('calendar')}
                className='cursor-pointer'
              >
                <CalendarIcon className='h-4 w-4 mr-2' /> Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentId ? (
              <div
                className={`p-3 rounded border bg-white/60 dark:bg-slate-900/50 transition-all duration-300 ${
                  justChanged
                    ? 'ring-2 ring-indigo-400 scale-[1.01] bg-white'
                    : ''
                }`}
                aria-busy={updatingCurrent}
              >
                <div className='font-medium'>
                  “{list.find((i) => i.id === currentId)?.text || '—'}”
                </div>
                {list.find((i) => i.id === currentId)?.author && (
                  <div className='text-xs text-muted-foreground mt-1'>
                    — {list.find((i) => i.id === currentId)?.author}
                  </div>
                )}
                {updatingCurrent && (
                  <div className='mt-2 text-xs text-muted-foreground flex items-center gap-2'>
                    <Loader2 className='h-3.5 w-3.5 animate-spin' /> Updating
                    current…
                  </div>
                )}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                Pick an entry to display today.
              </p>
            )}

            {/* Schedule summary */}
            <div className='mt-4 text-xs text-muted-foreground'>
              {scheduleInfo?.mode ? (
                <div className='inline-flex items-center gap-1 rounded border px-2 py-1 bg-white/60 dark:bg-slate-900/50'>
                  <span>Scheduled:</span>
                  <span className='font-medium'>
                    {scheduleInfo.mode === 'random' ? 'Random' : 'Specific'}
                  </span>
                  {scheduleInfo.changeAt && (
                    <span>
                      at {new Date(scheduleInfo.changeAt).toLocaleString()}
                    </span>
                  )}
                  {scheduleInfo.mode === 'fixed' &&
                    scheduleInfo.scheduledId && (
                      <span>
                        → “
                        {list
                          .find((q) => q.id === scheduleInfo.scheduledId)
                          ?.text?.slice(0, 40) || 'entry'}
                        {(list.find((q) => q.id === scheduleInfo.scheduledId)
                          ?.text?.length || 0) > 40
                          ? '…'
                          : ''}
                        ”
                      </span>
                    )}
                </div>
              ) : (
                <span className='opacity-80'>No schedule set.</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries list OR Calendar scheduling */}
      <Card className='overflow-hidden border-0 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-background dark:to-slate-950/20 transition-all duration-300'>
        <div className='h-1 w-full bg-sky-500' />
        {view === 'list' ? (
          <>
            <CardHeader className='flex items-center justify-between flex-row'>
              <CardTitle className='text-lg'>Entries</CardTitle>
              <Button
                size='sm'
                onClick={openNew}
                className='cursor-pointer bg-indigo-600 hover:bg-indigo-700'
              >
                <Plus className='h-4 w-4 mr-2' /> New Quote
              </Button>
            </CardHeader>
            <CardContent className='space-y-2'>
              {loading ? (
                <p className='text-sm text-muted-foreground'>Loading…</p>
              ) : list.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No quotes yet.</p>
              ) : (
                <div className='space-y-2'>
                  {list.map((q) => (
                    <div
                      key={q.id}
                      className={`rounded-md border p-3 hover:bg-muted/40`}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <div className='font-medium line-clamp-1'>
                            “{q.text}”
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {q.author ? `${q.author} · ` : ''}
                            {q.date || 'No date'}
                          </div>
                          {/* tags removed per request */}
                        </div>
                        <div className='flex items-center gap-2 shrink-0'>
                          {currentId === q.id && (
                            <span className='inline-flex items-center text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5'>
                              <CheckCircle2 className='h-3.5 w-3.5 mr-1' />{' '}
                              Current
                            </span>
                          )}
                          <Badge
                            variant={
                              q.status === 'published' ? 'default' : 'secondary'
                            }
                          >
                            {q.status}
                          </Badge>
                        </div>
                      </div>
                      <div className='mt-2 flex flex-wrap gap-2'>
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => setCurrent(q.id)}
                          className='cursor-pointer'
                          disabled={updatingCurrent}
                        >
                          {updatingCurrent ? (
                            <Loader2 className='h-3.5 w-3.5 mr-1 animate-spin' />
                          ) : null}
                          Set current
                        </Button>
                        {q.status === 'draft' ? (
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => updateStatus(q.id, 'published')}
                            className='cursor-pointer'
                          >
                            Publish
                          </Button>
                        ) : (
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => updateStatus(q.id, 'draft')}
                            className='cursor-pointer'
                          >
                            Unpublish
                          </Button>
                        )}
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => openEdit(q)}
                          className='cursor-pointer'
                        >
                          <Pencil className='h-3.5 w-3.5 mr-1' /> Edit
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => {
                            setDeleteId(q.id)
                            setIsDeleteOpen(true)
                          }}
                          className='cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                        >
                          <Trash2 className='h-3.5 w-3.5 mr-1' /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className='flex items-center justify-between flex-row'>
              <CardTitle className='text-lg'>Calendar scheduling</CardTitle>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setView('list')}
                className='cursor-pointer'
              >
                <ArrowLeft className='h-4 w-4 mr-2' /> Back to entries
              </Button>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='rounded-lg border p-4'>
                <Calendar
                  mode='single'
                  selected={calSelected}
                  onSelect={(d) => setCalSelected(d as Date)}
                  showOutsideDays
                  numberOfMonths={2}
                />
                <p className='text-xs text-muted-foreground mt-2'>
                  Pick a date, then assign a specific entry. Changes save
                  instantly.
                </p>
              </div>
              <div className='rounded-lg border p-4 space-y-4'>
                {!calSelected ? (
                  <p className='text-sm text-muted-foreground'>
                    Select a date to assign an entry.
                  </p>
                ) : (
                  <>
                    <div>
                      <Label className='mb-1.5 inline-block'>
                        Entry for {toLocalYMD(calSelected)}
                      </Label>
                      <select
                        className='w-full border rounded px-2 py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 cursor-pointer'
                        disabled={calBusy}
                        value={
                          calAssignments[toLocalYMD(calSelected)]
                            ?.scheduledId || ''
                        }
                        onChange={async (e) => {
                          const ymd = toLocalYMD(calSelected)
                          const newId = e.target.value || null
                          const time = calAssignments[ymd]?.time || calTime
                          await upsertSchedule(ymd, newId, time)
                        }}
                      >
                        <option value=''>— None —</option>
                        {list.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.text.slice(0, 80)}
                            {q.text.length > 80 ? '…' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor='cal-time' className='mb-1.5 inline-block'>
                        Change time
                      </Label>
                      <Input
                        id='cal-time'
                        type='time'
                        value={
                          calAssignments[toLocalYMD(calSelected)]?.time ??
                          calTime
                        }
                        disabled={calBusy}
                        onChange={async (e) => {
                          const ymd = toLocalYMD(calSelected)
                          const newTime = e.target.value
                          setCalTime(newTime)
                          const assigned =
                            calAssignments[ymd]?.scheduledId || null
                          if (assigned) {
                            await upsertSchedule(ymd, assigned, newTime)
                          }
                        }}
                      />
                      <p className='text-xs text-muted-foreground mt-1'>
                        Saves automatically.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Add/Edit Quote Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-lg p-0 overflow-hidden'>
          <div className='h-1 w-full bg-indigo-500' />
          <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 border-b'>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Quote' : 'New Quote'}</DialogTitle>
              <DialogDescription>
                Enter the quote details below.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className='px-6 py-5 space-y-4'>
            <div>
              <Label htmlFor='q-text' className='mb-1.5 inline-block'>
                Quote
              </Label>
              <Textarea
                id='q-text'
                rows={3}
                value={form.text}
                onChange={(e) => handle('text', e.target.value)}
                placeholder='e.g., “The best way to predict the future is to create it.”'
                className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='q-author' className='mb-1.5 inline-block'>
                  Author
                </Label>
                <Input
                  id='q-author'
                  value={form.author || ''}
                  onChange={(e) => handle('author', e.target.value)}
                  placeholder='Optional'
                  className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                />
              </div>
              <div>
                <Label htmlFor='q-date' className='mb-1.5 inline-block'>
                  Date
                </Label>
                <Input
                  id='q-date'
                  type='date'
                  value={form.date || ''}
                  onChange={(e) => handle('date', e.target.value)}
                  className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                />
              </div>
              <div>
                <Label htmlFor='q-status' className='mb-1.5 inline-block'>
                  Status
                </Label>
                <select
                  id='q-status'
                  className='border rounded px-2 py-2 text-sm w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 cursor-pointer'
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
            {/* tags removed per request */}
          </div>
          <DialogFooter className='px-6 pb-4 border-t bg-white dark:bg-slate-900'>
            <Button
              variant='outline'
              onClick={() => setIsFormOpen(false)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await save()
                setIsFormOpen(false)
              }}
              className='cursor-pointer'
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pick Current Modal */}
      <Dialog open={isPickOpen} onOpenChange={setIsPickOpen}>
        <DialogContent className='sm:max-w-md p-0 overflow-hidden'>
          <div className='h-1 w-full bg-indigo-500' />
          <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 border-b'>
            <DialogHeader>
              <DialogTitle>Change current quote</DialogTitle>
              <DialogDescription>
                Select which quote to display now.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className='px-6 py-5'>
            <select
              className='w-full border rounded px-2 py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 cursor-pointer'
              value={currentId || ''}
              onChange={(e) => setCurrentId(e.target.value)}
            >
              <option value='' disabled>
                Choose…
              </option>
              {list.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.text.slice(0, 80)}
                  {q.text.length > 80 ? '…' : ''}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className='px-6 pb-4 border-t bg-white dark:bg-slate-900'>
            <Button
              variant='outline'
              onClick={() => setIsPickOpen(false)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (currentId) await setCurrent(currentId)
                setIsPickOpen(false)
              }}
              className='cursor-pointer'
            >
              Set current
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Change Modal */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className='sm:max-w-lg p-0 overflow-hidden'>
          <div className='h-1 w-full bg-sky-500' />
          <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20 border-b'>
            <DialogHeader>
              <DialogTitle>Schedule change</DialogTitle>
              <DialogDescription>
                Choose how and when the next quote is set.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className='px-6 py-5 space-y-3'>
            <div>
              <Label className='mb-1.5 inline-block'>Mode</Label>
              <select
                className='w-full border rounded px-2 py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 cursor-pointer'
                value={mode}
                onChange={(e) => setMode(e.target.value as 'fixed' | 'random')}
              >
                <option value='fixed'>Switch to a specific entry</option>
                <option value='random'>Pick a random published entry</option>
              </select>
            </div>
            {mode === 'fixed' && (
              <div>
                <Label className='mb-1.5 inline-block'>Which entry</Label>
                <select
                  className='w-full border rounded px-2 py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 cursor-pointer'
                  value={scheduledId}
                  onChange={(e) => setScheduledId(e.target.value)}
                >
                  <option value=''>Choose…</option>
                  {list.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.text.slice(0, 80)}
                      {q.text.length > 80 ? '…' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor='changeAt' className='mb-1.5 inline-block'>
                Change at
              </Label>
              <Input
                id='changeAt'
                type='datetime-local'
                value={changeAt}
                onChange={(e) => setChangeAt(e.target.value)}
                placeholder='YYYY-MM-DDTHH:MM'
                className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
              />
              <p className='text-xs text-muted-foreground mt-1'>
                Applied on the first request after the specified time.
              </p>
            </div>
          </div>
          <DialogFooter className='px-6 pb-4 border-t bg-white dark:bg-slate-900'>
            <Button
              variant='outline'
              onClick={() => setIsScheduleOpen(false)}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await schedule()
                setIsScheduleOpen(false)
              }}
              className='cursor-pointer'
            >
              Save schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className='sm:max-w-md p-0 overflow-hidden'>
          <div className='h-1 w-full bg-rose-500' />
          <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/20 dark:to-amber-950/20 border-b'>
            <DialogHeader>
              <DialogTitle>Delete quote?</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className='px-6 py-4 text-sm'>
            Are you sure you want to delete this quote?
          </div>
          <DialogFooter className='px-6 pb-4 border-t bg-white dark:bg-slate-900'>
            <Button
              variant='outline'
              onClick={() => {
                setIsDeleteOpen(false)
                setDeleteId(null)
              }}
              className='cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (deleteId) {
                  await remove(deleteId)
                }
                setIsDeleteOpen(false)
                setDeleteId(null)
              }}
              className='cursor-pointer bg-rose-600 hover:bg-rose-700'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
