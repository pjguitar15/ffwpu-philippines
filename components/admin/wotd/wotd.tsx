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
  Search,
  MoreVertical,
  Edit,
  Trash,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type Quote = {
  id: string
  text: string
  author?: string
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
  })
  const isEdit = Boolean(form.id)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPickOpen, setIsPickOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingCurrent, setUpdatingCurrent] = useState(false)
  const [justChanged, setJustChanged] = useState(false)

  // UI: search & filter
  const [query, setQuery] = useState('')

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
  // List paging
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12) // render 2 x 6 on lg screens

  // Derived filtered list
  const filteredList = React.useMemo(() => {
    return list.filter((q) => {
      const t = (q.text || '') + (q.author ? ` ${q.author}` : '')
      const okQ = !query || t.toLowerCase().includes(query.toLowerCase())
      return okQ
    })
  }, [list, query])

  // Reset/clamp page when filters or data change
  useEffect(() => {
    setPage(1)
  }, [query])
  useEffect(() => {
    const total = Math.max(1, Math.ceil(filteredList.length / pageSize))
    if (page > total) setPage(total)
  }, [filteredList.length, page, pageSize])

  function handle<K extends keyof Quote>(key: K, value: Quote[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }
  function resetForm() {
    setForm({
      id: '',
      text: '',
      author: '',
    })
  }
  function openNew() {
    resetForm()
    setIsFormOpen(true)
  }
  function openEdit(q: Quote) {
    setForm({ ...q })
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
          }),
        })
        if (!res.ok) throw new Error('Create failed')
        const created = await res.json()
        setList((prev) => [
          {
            id: String(created._id),
            text: created.text,
            author: created.attribution || '',
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
            <CardHeader className='flex flex-col gap-3'>
              <div className='flex items-center justify-between gap-3 w-full'>
                <CardTitle className='text-lg'>Entries</CardTitle>
                <Button
                  size='sm'
                  onClick={openNew}
                  className='cursor-pointer bg-indigo-600 hover:bg-indigo-700'
                >
                  <Plus className='h-4 w-4 mr-2' /> New Quote
                </Button>
              </div>
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                <div className='relative w-full sm:max-w-sm'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search quotes or author…'
                    className='pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                  />
                </div>
              </div>
              <div className='text-xs text-muted-foreground'>
                {list.length > 0
                  ? `Showing ${filteredList.length} of ${list.length}`
                  : 'No entries yet'}
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              {loading ? (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className='rounded-md border p-4 bg-white/60 dark:bg-slate-900/40 animate-pulse'
                    >
                      <div className='h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2' />
                      <div className='h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded' />
                    </div>
                  ))}
                </div>
              ) : (
                (() => {
                  const filtered = filteredList
                  if (list.length === 0) {
                    return (
                      <p className='text-sm text-muted-foreground'>
                        No quotes yet.
                      </p>
                    )
                  }
                  if (filtered.length === 0) {
                    return (
                      <div className='text-sm text-muted-foreground'>
                        No results for “{query}”.{' '}
                        <button
                          className='underline cursor-pointer'
                          onClick={() => {
                            setQuery('')
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    )
                  }
                  const totalPages = Math.max(
                    1,
                    Math.ceil(filtered.length / pageSize),
                  )
                  const start = (page - 1) * pageSize
                  const end = Math.min(start + pageSize, filtered.length)
                  const pageItems = filtered.slice(start, end)
                  return (
                    <>
                      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {pageItems.map((q) => (
                          <div
                            key={q.id}
                            className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 ${
                              currentId === q.id
                                ? 'border-sky-300 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-sky-950/30 dark:via-slate-900/50 dark:to-indigo-950/30 ring-2 ring-sky-200 dark:ring-sky-800 shadow-lg shadow-sky-500/20'
                                : 'border-slate-200 bg-gradient-to-br from-white to-slate-50/80 hover:border-sky-300 dark:border-slate-700 dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-950/60 dark:hover:border-sky-600'
                            }`}
                          >
                            {/* Current indicator ribbon */}
                            {currentId === q.id && (
                              <div className='absolute -top-2 -right-2 w-16 h-16 overflow-hidden'>
                                <div className='absolute top-4 right-[-16px] bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-medium px-8 py-1 rotate-45 shadow-lg'>
                                  Current
                                </div>
                              </div>
                            )}
                            {/* inline current chip handled in top-right cluster */}

                            <div className='relative flex items-start justify-between gap-3'>
                              <div className='min-w-0'>
                                <div className='font-medium line-clamp-1'>
                                  “{q.text}”
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  {q.author ? q.author : 'Unknown author'}
                                </div>
                              </div>
                              <div className='flex items-center gap-2 shrink-0'>
                                {currentId === q.id && (
                                  <div className='flex items-center gap-1.5 rounded-full bg-sky-500 text-white px-3 py-1.5 text-xs font-medium shadow-sm'>
                                    <Sparkles className='h-3.5 w-3.5' />
                                    Current
                                  </div>
                                )}
                                {/* Kebab is the last item */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size='sm'
                                      variant='ghost'
                                      className='cursor-pointer p-2 h-8 w-8'
                                    >
                                      <MoreVertical className='h-4 w-4' />
                                      <span className='sr-only'>
                                        More actions
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                      onClick={() => openEdit(q)}
                                    >
                                      <Edit className='h-4 w-4' /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      variant='destructive'
                                      onClick={() => {
                                        setDeleteId(q.id)
                                        setIsDeleteOpen(true)
                                      }}
                                    >
                                      <Trash className='h-4 w-4' /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2 items-center'>
                              {currentId !== q.id && (
                                <Button
                                  size='sm'
                                  onClick={() => setCurrent(q.id)}
                                  className='cursor-pointer bg-slate-900/90 hover:bg-slate-900 text-white shadow-sm disabled:opacity-60 dark:bg-slate-100/10 dark:hover:bg-slate-100/20 h-7 px-2.5 text-xs'
                                  disabled={updatingCurrent}
                                >
                                  {updatingCurrent ? (
                                    <Loader2 className='h-3 w-3 mr-1 animate-spin' />
                                  ) : null}
                                  Set current
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='mt-4 flex flex-col sm:flex-row items-center justify-between gap-3'>
                        <div className='text-xs text-muted-foreground'>
                          Showing {start + 1}–{end} of {filtered.length} · Page{' '}
                          {page} of {totalPages}
                        </div>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='cursor-pointer'
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            className='cursor-pointer'
                            onClick={() =>
                              setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page >= totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  )
                })()
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
      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open)
          if (!open) setDeleteId(null)
        }}
      >
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
            <DialogClose asChild>
              <Button variant='outline' className='cursor-pointer'>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                disabled={deleting}
                onClick={async () => {
                  const id = deleteId
                  if (!id) return
                  try {
                    setDeleting(true)
                    await remove(id)
                  } finally {
                    setDeleting(false)
                    setDeleteId(null)
                  }
                }}
                className='cursor-pointer bg-rose-600 hover:bg-rose-700 disabled:opacity-60'
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
