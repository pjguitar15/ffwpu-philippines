"use client"

import { useEffect, useMemo, useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Repeat, CalendarRange, CalendarClock, Download } from 'lucide-react'

type Subscriber = {
  _id: string
  email: string
  firstName: string
  lastName: string
  frequency: 'weekly' | 'monthly'
  createdAt: string
}

export default function AdminNewsletterPage() {
  const [items, setItems] = useState<Subscriber[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      const res = await fetch(
        `/api/newsletter?page=${page}&pageSize=${pageSize}`,
      )
      const data = await res.json()
      if (!ignore) {
        setItems(data.items)
        setTotal(data.total)
        setLoading(false)
      }
    })()
    return () => {
      ignore = true
    }
  }, [page, pageSize])

  const filtered = useMemo(() => {
    const s = q.toLowerCase()
    return items.filter(
      (x) =>
        x.email.toLowerCase().includes(s) ||
        (x.firstName && x.firstName.toLowerCase().includes(s)) ||
        (x.lastName && x.lastName.toLowerCase().includes(s)),
    )
  }, [q, items])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />
      <main className='flex-1 overflow-auto'>
        <div className='p-8'>
          <div className='mb-8 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
            <div className='px-6 py-6 flex items-center justify-between'>
              <div>
                <h1 className='font-heading text-3xl font-bold'>Newsletter</h1>
                <p className='text-muted-foreground'>
                  Subscriber emails and frequency
                </p>
              </div>
            </div>
          </div>

          {/* Inline toolbar: search only (left-aligned, bordered) */}
          <div className='mb-4'>
            <Input
              placeholder='Filter by name or email…'
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className='h-10 w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
            />
          </div>

          <Card className='shadow-sm overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-background dark:to-slate-950/20'>
            <div className='h-1 w-full bg-indigo-500' />
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Subscribers</CardTitle>
                <CardDescription>View all newsletter signups</CardDescription>
              </div>
              <Button
                onClick={async () => {
                  try {
                    setDownloading(true)
                    // Fetch all pages (up to API max 100 per page)
                    const all: Subscriber[] = []
                    const pageSizeAll = 100
                    let current = 1
                    let totalFetched = 0
                    let totalDocs = 0
                    do {
                      const res = await fetch(
                        `/api/newsletter?page=${current}&pageSize=${pageSizeAll}`,
                      )
                      const data = await res.json()
                      all.push(...(data.items as Subscriber[]))
                      totalFetched += data.items.length
                      totalDocs = data.total
                      current += 1
                    } while (totalFetched < totalDocs)

                    // Optional in-memory filter by q
                    const s = q.toLowerCase()
                    const rows = all.filter(
                      (x) =>
                        x.email.toLowerCase().includes(s) ||
                        (x.firstName &&
                          x.firstName.toLowerCase().includes(s)) ||
                        (x.lastName && x.lastName.toLowerCase().includes(s)),
                    )
                    const header = [
                      'First Name',
                      'Last Name',
                      'Email',
                      'Frequency',
                      'Joined',
                    ]
                    const body = rows.map((r) => [
                      r.firstName || '',
                      r.lastName || '',
                      r.email,
                      r.frequency,
                      new Date(r.createdAt).toISOString(),
                    ])
                    const csv = [header, ...body]
                      .map((line) =>
                        line
                          .map((v) => {
                            const str = String(v ?? '')
                            return /[",\n]/.test(str)
                              ? '"' + str.replaceAll('"', '""') + '"'
                              : str
                          })
                          .join(','),
                      )
                      .join('\n')

                    const blob = new Blob([csv], {
                      type: 'text/csv;charset=utf-8;',
                    })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    const ts = new Date()
                      .toISOString()
                      .slice(0, 19)
                      .replace(/[:T]/g, '-')
                    a.download = `subscribers-${ts}.csv`
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    URL.revokeObjectURL(url)
                  } finally {
                    setDownloading(false)
                  }
                }}
                disabled={downloading}
                className='bg-indigo-600 hover:bg-indigo-700'
              >
                <Download className='h-4 w-4 mr-2' />
                {downloading ? 'Preparing…' : 'Download CSV'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className='relative -mx-2 md:mx-0 overflow-auto rounded-xl border border-border/60'>
                <Table className='min-w-[760px]'>
                  <TableHeader className='sticky top-0 z-[1] bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-900/60 dark:to-sky-950/40 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                    <TableRow className='h-14'>
                      <TableHead className='text-slate-700 py-3'>
                        Name
                      </TableHead>
                      <TableHead className='text-slate-700 py-3'>
                        Email
                      </TableHead>
                      <TableHead className='text-slate-700 py-3'>
                        Frequency
                      </TableHead>
                      <TableHead className='text-slate-700 py-3'>
                        Joined
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={`sk-${i}`} className='h-16'>
                            <TableCell>
                              <div className='h-4 w-40 bg-slate-200 animate-pulse rounded' />
                            </TableCell>
                            <TableCell>
                              <div className='h-4 w-64 bg-slate-200 animate-pulse rounded' />
                            </TableCell>
                            <TableCell>
                              <div className='h-6 w-28 bg-slate-200 animate-pulse rounded-full' />
                            </TableCell>
                            <TableCell>
                              <div className='h-4 w-40 bg-slate-200 animate-pulse rounded' />
                            </TableCell>
                          </TableRow>
                        ))
                      : filtered.map((s) => (
                          <TableRow
                            key={s._id}
                            className='h-16 hover:bg-sky-50/60 dark:hover:bg-sky-950/20'
                          >
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <div className='font-medium'>
                                  {s.firstName || s.lastName ? (
                                    `${s.firstName || ''} ${
                                      s.lastName || ''
                                    }`.trim()
                                  ) : (
                                    <span className='text-gray-400 italic'>
                                      No name provided
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <Mail className='h-4 w-4' /> {s.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium border shadow-sm ' +
                                  (s.frequency === 'weekly'
                                    ? 'bg-gradient-to-r from-sky-500 to-indigo-500 border-indigo-300'
                                    : 'bg-gradient-to-r from-violet-500 to-rose-500 border-violet-300')
                                }
                              >
                                {s.frequency === 'weekly' ? (
                                  <Repeat className='h-3.5 w-3.5' />
                                ) : (
                                  <CalendarRange className='h-3.5 w-3.5' />
                                )}
                                <span className='capitalize'>
                                  {s.frequency}
                                </span>
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <CalendarClock className='h-4 w-4' />
                                {new Date(s.createdAt).toLocaleString()}
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
        </div>
      </main>
    </div>
  )
}
