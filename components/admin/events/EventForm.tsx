'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as DateCalendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Upload,
  RefreshCcw,
  Trash2,
  Link as LinkIcon,
  XCircle,
  CheckCircle2,
  Building2,
  Plus,
} from 'lucide-react'

import type { Area, EventItem } from '@/types/event'
import {
  DEFAULT_TIME,
  combineLocalISOShort,
  splitToDateTimeStrings,
  toMMDDYYYY,
  parseMMDDYYYY,
} from '@/lib/date-input'
import { AREA_REGION_MAP, AREAS, CHURCHES, REGION_CHURCHES } from '@/constants/events.constants'

export default function EventForm({
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
    date: '',
    end: '',
    location: '',
    area: 'Area 1',
    region: 'Nationwide',
    church: '',
    image: '',
    description: '',
    button: '',
    href: '',
  })
  const { toast } = useToast()
  const isEdit = Boolean(initial && (initial as any)._id)

  // UI date/time fields (MM/DD/YYYY + time)
  const [startDate, setStartDate] = useState<string>('')
  const [startTime, setStartTime] = useState<string>(DEFAULT_TIME)
  const [endDate, setEndDate] = useState<string>('')
  const [endTime, setEndTime] = useState<string>(DEFAULT_TIME)
  const [hasEnd, setHasEnd] = useState<boolean>(false)

  // upload
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadPct, setUploadPct] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Region will be auto-set to 'Nationwide' by default; user no longer selects region.

  // Allowed churches, driven by Region if chosen; otherwise all churches in the Area
  const allowedChurches = useMemo<string[]>(() => {
    const uniq = new Set<string>()
    ;(AREA_REGION_MAP[values.area as Area] ?? []).forEach((r) => {
      ;(REGION_CHURCHES[r] ?? []).forEach((c) => uniq.add(c))
    })
    return Array.from(uniq)
  }, [values.area])

  // Clear church if it no longer fits the (area, region) combination
  useEffect(() => {
    if (values.church && !allowedChurches.includes(values.church)) {
      setValues((v) => ({ ...v, church: '' }))
    }
  }, [allowedChurches])

  const FALLBACK_IMG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0ea5e9"/><stop offset="50%" stop-color="#6366f1"/><stop offset="100%" stop-color="#111827"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/></svg>`,
    )

  const NONE_CHURCH = '__none__'

  useEffect(() => {
    if (!open) return
    setValues((v) => ({
      ...v,
      title: initial?.title || '',
      date: '',
      end: '',
      location: initial?.location || '',
      area: (initial?.area as EventItem['area']) || 'Area 1',
      region: initial?.region || 'Nationwide',
      church: initial?.church || '',
      image: initial?.image || '',
      description: (initial as any)?.description || '',
      button: initial?.button || '',
      href: initial?.href || '',
      _id: (initial as any)?._id,
    }))

    if (initial?.date) {
      const { dateStr, timeStr } = splitToDateTimeStrings(initial.date)
      setStartDate(dateStr)
      setStartTime(timeStr || DEFAULT_TIME)
    } else {
      setStartDate(toMMDDYYYY(new Date()))
      setStartTime(DEFAULT_TIME)
    }

    if (initial?.end) {
      const { dateStr, timeStr } = splitToDateTimeStrings(initial.end)
      setEndDate(dateStr)
      setEndTime(timeStr || DEFAULT_TIME)
      setHasEnd(true)
    } else {
      setEndDate('')
      setEndTime(DEFAULT_TIME)
      setHasEnd(false)
    }
  }, [open, initial])

  const canSubmit = useMemo(() => {
    const startOk =
      Boolean(startDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) && Boolean(startTime)
    const endOk = endDate
      ? Boolean(endDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) && Boolean(endTime)
      : true
    return (
      values.title.trim() &&
      values.location.trim() &&
      values.image.trim() &&
      values.area &&
      startOk &&
      endOk
    )
  }, [values, startDate, startTime, endDate, endTime])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload: EventItem = {
        ...values,
        date: combineLocalISOShort(startDate, startTime),
        ...(endDate && endTime
          ? { end: combineLocalISOShort(endDate, endTime) }
          : {}),
      }

      if (!payload.end) delete (payload as any).end
      if (!payload.church) delete (payload as any).church
      if (!payload.description) delete (payload as any).description
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
      if (!res.ok) {
        let message = 'Failed to save event'
        try {
          const ct = res.headers.get('content-type') || ''
          if (ct.includes('application/json')) {
            const j = await res.json()
            message = (j && (j.error || j.message)) || message
          } else {
            const t = await res.text()
            message = t || message
          }
        } catch {}
        throw new Error(message)
      }
      const saved = await res.json()
      toast({ title: isEdit ? 'Event updated' : 'Event created' })
      onSaved?.(saved)
      onOpenChange(false)
    } catch (e) {
      console.error(e)
      const message = (e as any)?.message || 'Save failed'
      toast({ title: 'Save failed', description: message, variant: 'destructive' as any })
    }
  }

  async function uploadFile(file: File) {
    const MAX_BYTES = 10 * 1024 * 1024
    if (!file.type.startsWith('image/'))
      return setUploadError('Please select an image file')
    if (file.size > MAX_BYTES)
      return setUploadError('File too large (max 10MB)')
    setUploadError(null)
    setUploading(true)
    setUploadPct(0)
    try {
      await new Promise<void>((resolve, reject) => {
        const fd = new FormData()
        fd.append('file', file)
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/cloudinary-upload')
        xhr.upload.onprogress = (e) =>
          e.lengthComputable && setUploadPct((e.loaded / e.total) * 100)
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText || '{}')
            if (xhr.status >= 200 && xhr.status < 300) {
              setValues((v) => ({ ...v, image: data.url }))
              setUploadPct(100)
              resolve()
            } else reject(new Error(data?.error || 'Upload failed'))
          } catch {
            reject(new Error('Upload failed'))
          }
        }
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.send(fd)
      })
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[96vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl h-[90svh] max-h-[90vh] p-0 overflow-hidden rounded-xl'>
        <div className='flex flex-col h-full min-h-0'>
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
            <div className='flex-1 min-h-0 overflow-y-auto px-6 py-5'>
              <div className='grid grid-cols-12 gap-x-5 gap-y-4'>
                {/* Title */}
                <div className='col-span-12'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Title
                  </label>
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

                {/* Start: MM/DD/YYYY + time */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Start
                  </label>
                  <div className='grid grid-cols-12 gap-3'>
                    <div className='col-span-7 relative'>
                      <CalendarIcon className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type='button'
                            className='h-10 w-full text-left pl-9 pr-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
                          >
                            {startDate || 'MM/DD/YYYY'}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align='start' className='w-auto p-0'>
                          <DateCalendar
                            mode='single'
                            selected={startDate ? parseMMDDYYYY(startDate) || undefined : undefined}
                            onSelect={(d) => d && setStartDate(toMMDDYYYY(d))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className='col-span-5 relative'>
                      <Clock className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                      <Input
                        type='time'
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        step={60}
                        required
                        className='h-10 pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                      />
                    </div>
                  </div>
                </div>

                {/* End: optional date/time toggle */}
                <div className='col-span-12 md:col-span-6'>
                  <div className='relative mb-1.5'>
                    <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground'>
                      End
                    </label>
                    <div className='absolute right-0 top-0'>
                      {!hasEnd ? (
                        <Button
                          type='button'
                          size='sm'
                          variant='outline'
                          className='cursor-pointer rounded-full border-dashed text-slate-700 hover:text-sky-700 hover:border-sky-500'
                          onClick={() => {
                            setHasEnd(true)
                            // default end to same as start
                            setEndDate(startDate)
                            setEndTime(startTime || DEFAULT_TIME)
                          }}
                        >
                          <Plus className='h-4 w-4 mr-1' /> Add end date
                        </Button>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <span className='inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] ring ring-emerald-200/70'>
                            <CheckCircle2 className='h-3 w-3' /> End enabled
                          </span>
                          <Button
                            type='button'
                            size='icon'
                            variant='ghost'
                            className='cursor-pointer h-7 w-7'
                            onClick={() => {
                              setHasEnd(false)
                              setEndDate('')
                              setEndTime(DEFAULT_TIME)
                            }}
                            title='Remove end date'
                            aria-label='Remove end date'
                          >
                            <XCircle className='h-3.5 w-3.5' />
                            <span className='sr-only'>Remove end</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {hasEnd && (
                  <div className='mt-2 grid grid-cols-12 gap-3'>
                    <div className='col-span-7 relative'>
                      <CalendarIcon className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type='button'
                            className='h-10 w-full text-left pl-9 pr-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'
                          >
                            {endDate || 'MM/DD/YYYY'}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align='start' className='w-auto p-0'>
                          <DateCalendar
                            mode='single'
                            selected={endDate ? parseMMDDYYYY(endDate) || undefined : undefined}
                            onSelect={(d) => setEndDate(d ? toMMDDYYYY(d) : '')}
                            disabled={
                              startDate
                                ? [{ before: (parseMMDDYYYY(startDate) as Date) }]
                                : undefined
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className='col-span-5 relative'>
                      <Clock className='h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 dark:text-sky-300 pointer-events-none' />
                      <Input
                        type='time'
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        step={60}
                        className='h-10 pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                      />
                    </div>
                  </div>
                  )}
                  {hasEnd && (
                    <p className='text-xs text-muted-foreground mt-1'>
                      Optional. Leave blank for one-day events.
                    </p>
                  )}
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
                <div className='col-span-12 md:col-span-6'>
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


                {/* Church (dropdown, optional) */}
                <div className='col-span-12 md:col-span-6'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Church (optional)
                  </label>
                  <Select
                    value={values.church === '' ? NONE_CHURCH : values.church}
                    onValueChange={(v) =>
                      setValues({
                        ...values,
                        church: v === NONE_CHURCH ? '' : v,
                      })
                    }
                    disabled={allowedChurches.length === 0}
                  >
                    <SelectTrigger className='h-10 w-full cursor-pointer border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'>
                      <SelectValue placeholder='Select a church' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_CHURCH}>None</SelectItem>
                      {allowedChurches.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className='col-span-12'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Description (optional)
                  </label>
                  <Textarea
                    placeholder='Short description about the event'
                    value={values.description || ''}
                    onChange={(e) =>
                      setValues({ ...values, description: e.target.value })
                    }
                    className='bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
                    rows={4}
                  />
                </div>

                {/* Upload Image (dropzone + preview) */}
                <div className='col-span-12'>
                  <label className='block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5'>
                    Upload Image
                  </label>
                  {!values.image ? (
                    <div
                      className={
                        'relative rounded-xl border-2 border-dashed transition-colors p-6 text-center select-none ' +
                        (isDragging
                          ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20'
                          : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-sky-400')
                      }
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={async (e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        const f = e.dataTransfer.files?.[0]
                        if (f) await uploadFile(f)
                      }}
                    >
                      <div className='flex flex-col items-center gap-2'>
                        <div className='h-12 w-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center dark:bg-sky-900/40 dark:text-sky-200'>
                          <Upload className='h-6 w-6' />
                        </div>
                        <div className='text-sm font-medium'>
                          Drag &amp; drop an image
                        </div>
                        <div className='text-xs text-muted-foreground'>or</div>
                        <Button
                          type='button'
                          variant='secondary'
                          size='sm'
                          className='cursor-pointer'
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Choose image
                        </Button>
                        <input
                          ref={fileInputRef}
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={async (e) => {
                            const f = e.target.files?.[0]
                            if (f) await uploadFile(f)
                          }}
                        />
                        {uploading && (
                          <div className='mt-3 w-full max-w-xs mx-auto'>
                            <Progress value={uploadPct} />
                            <p className='text-xs text-muted-foreground mt-1'>
                              Uploading… {Math.round(uploadPct)}%
                            </p>
                          </div>
                        )}
                        {uploadError && (
                          <p className='text-xs text-rose-600 mt-2'>
                            {uploadError}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='relative mt-2 overflow-hidden rounded-xl border bg-white dark:bg-slate-950'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={values.image}
                        onError={(e) => {
                          if (
                            (e.currentTarget as HTMLImageElement).src !==
                            FALLBACK_IMG
                          ) {
                            ;(e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG
                          }
                        }}
                        alt='Uploaded image'
                        className='w-full max-h-56 object-cover'
                      />
                      <div className='absolute top-2 right-2 flex gap-2'>
                        <Button
                          type='button'
                          size='sm'
                          variant='secondary'
                          className='cursor-pointer'
                          onClick={() => fileInputRef.current?.click()}
                          title='Replace image'
                        >
                          <RefreshCcw className='h-4 w-4' />
                        </Button>
                        <Button
                          type='button'
                          size='sm'
                          variant='destructive'
                          className='cursor-pointer'
                          onClick={() =>
                            setValues((v) => ({ ...v, image: '' }))
                          }
                          title='Remove image'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={async (e) => {
                          const f = e.target.files?.[0]
                          if (f) await uploadFile(f)
                        }}
                      />
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

            {/* Footer */}
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

