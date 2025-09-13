'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Calendar,
  MapPin,
  MoreVertical,
  Image as ImageIcon,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { EventItem } from '@/types/event'

export default function EventListTable({
  loading,
  items,
  pageItems,
  page,
  totalPages,
  pageSize,
  q,
  setQ,
  onCreate,
  onPrev,
  onNext,
  onGoto,
  onEdit,
  onDelete,
  onView,
}: {
  loading: boolean
  items: EventItem[]
  pageItems: EventItem[]
  page: number
  totalPages: number
  pageSize: number
  q: string
  setQ: (v: string) => void
  onCreate: () => void
  onPrev: () => void
  onNext: () => void
  onGoto: (p: number) => void
  onEdit: (e: EventItem) => void
  onDelete: (e: EventItem) => void
  onView: (e: EventItem) => void
}) {
  const filtered = items
  return (
    <Card className='shadow-sm overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-background dark:to-slate-950/20'>
      <div className='h-1 w-full bg-indigo-500' />
      <CardHeader>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div>
            <CardTitle>All Events</CardTitle>
            <CardDescription>Create, edit, and delete events</CardDescription>
          </div>
          <div className='flex items-center gap-2 w-full md:w-auto'>
            <Input
              placeholder='Search title, location, area…'
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className='h-10 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0 w-full md:w-[clamp(14rem,28vw,22rem)]'
            />
            <Button
              onClick={onCreate}
              className='cursor-pointer bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap'
            >
              <Plus className='mr-2 h-4 w-4' /> Create Event
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={
            'relative -mx-2 md:mx-0 rounded-xl border border-border/60 ' +
            'overflow-y-hidden'
          }
          style={{ minHeight: '360px' }}
        >
          <Table>
            <TableHeader className='sticky top-0 z-[1] bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-900/60 dark:to-sky-950/40 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <TableRow className='h-14'>
                <TableHead className='text-slate-700 py-3 w-20'></TableHead>
                <TableHead className='text-slate-700 py-3'>Title</TableHead>
                <TableHead className='text-slate-700 py-3'>Date</TableHead>
                <TableHead className='text-slate-700 py-3'>Location</TableHead>
                <TableHead className='text-slate-700 py-3'>Area</TableHead>
                
                <TableHead className='py-3 w-0'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && pageItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className='text-center py-10 text-muted-foreground'>
                      No events yet.
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {loading
                ? Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell className='py-4'>
                        <Skeleton className='h-12 w-16 rounded' />
                      </TableCell>
                      <TableCell className='py-4'>
                        <div className='min-w-[280px] max-w-[480px]'>
                          <Skeleton className='h-4 w-64' />
                          <div className='mt-2'>
                            <Skeleton className='h-3 w-40' />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='py-4'>
                        <Skeleton className='h-4 w-40' />
                      </TableCell>
                      <TableCell className='py-4'>
                        <Skeleton className='h-4 w-48' />
                      </TableCell>
                      <TableCell className='py-4'>
                        <Skeleton className='h-6 w-20 rounded-full' />
                      </TableCell>
                      <TableCell className='py-4'>
                        <Skeleton className='h-4 w-28' />
                      </TableCell>
                      <TableCell className='py-4'>
                        <div className='flex items-center gap-2'>
                          <Skeleton className='h-8 w-16 rounded-full' />
                          <Skeleton className='h-8 w-8 rounded-full' />
                          <Skeleton className='h-8 w-8 rounded-full' />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : pageItems.map((e) => (
                    <TableRow
                      key={e._id}
                      className='h-16 hover:bg-sky-50/60 dark:hover:bg-sky-950/20 transition-colors'
                    >
                      <TableCell className='py-4'>
                        <div className='relative group'>
                          <div className='relative w-16 h-12 rounded overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer'>
                            {e.image ? (
                              <Image
                                src={e.image}
                                alt={e.title}
                                fill
                                className='object-cover'
                                sizes='64px'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <ImageIcon className='h-6 w-6 text-slate-400' />
                              </div>
                            )}
                          </div>
                          {e.image && (
                            <div className='absolute left-20 top-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                              <div className='relative w-64 h-48 rounded-lg overflow-hidden shadow-xl border border-slate-200 bg-white'>
                                <Image
                                  src={e.image}
                                  alt={e.title}
                                  fill
                                  className='object-cover'
                                  sizes='256px'
                                />
                              </div>
                              <div className='absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                                {e.title}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className='py-4'>
                        <div
                          className='font-medium cursor-pointer hover:underline transition-all duration-200 ease-in-out whitespace-normal break-words max-w-[520px]'
                          onClick={() => onView(e)}
                        >
                          {e.title}
                        </div>
                        {e.church && (
                          <div className='text-sm text-muted-foreground line-clamp-1 max-w-[520px]'>
                            {e.church}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className='py-4'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4' />{' '}
                          {new Date(e.date).toLocaleString()}
                        </div>
                      </TableCell>

                      <TableCell className='py-4'>
                        <div className='flex items-start gap-2 whitespace-normal break-words max-w-[480px]'>
                          <MapPin className='h-4 w-4 mt-0.5 shrink-0' />
                          <span className='whitespace-normal break-words'>
                            {e.location}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className='py-4'>
                        <Badge className='rounded-full text-white border border-indigo-300 bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1 shadow-sm'>
                          {e.area}
                        </Badge>
                      </TableCell>

                      

                      <TableCell className='py-4 text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 p-0'
                              aria-label='Actions'
                            >
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-40'>
                            <DropdownMenuItem
                              onClick={() => onView(e)}
                              className='cursor-pointer'
                            >
                              <Eye className='h-4 w-4' /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEdit(e)}
                              className='cursor-pointer'
                            >
                              <Edit className='h-4 w-4' /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(e)}
                              className='cursor-pointer'
                            >
                              <Trash2 className='h-4 w-4' /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            {loading ? (
              'Loading…'
            ) : (
              <>
                Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filtered.length)} of{' '}
                {filtered.length}
              </>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={onPrev}
              disabled={page === 1 || loading}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                size='sm'
                variant={page === i + 1 ? 'default' : 'outline'}
                onClick={() => onGoto(i + 1)}
                disabled={loading}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant='outline'
              size='sm'
              onClick={onNext}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
