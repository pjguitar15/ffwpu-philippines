"use client"

import { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ImageIcon,
  Filter,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { NewsForm } from '@/components/admin/news-form'
import NewsPreviewDialog from '../../../components/admin/news-preview'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'

interface NewsItem {
  id: string
  title: string
  author: string
  date: string
  tags: string[]
  status: string
  image?: string
  slug?: string
  content?: string
}

// Deterministic color palette for tag badges to add a subtle, friendly splash of color
const TAG_PALETTES = [
  { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
]
function tagClasses(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++)
    hash = (hash * 31 + tag.charCodeAt(i)) | 0
  const idx = Math.abs(hash) % TAG_PALETTES.length
  const c = TAG_PALETTES[idx]
  return `${c.bg} ${c.text} ${c.border}`
}

export default function AdminNewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAuthor, setFilterAuthor] = useState<string>('all')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<any | null>(null)
  const [previewItem, setPreviewItem] = useState<any | null>(null)
  const [deleteItem, setDeleteItem] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 5
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/news')
        const data: any[] = await response.json()

        // Migrate old status values to new ones
        const migratedData = data.map((item) => ({
          ...item,
          status:
            item.status === 'active'
              ? 'published'
              : item.status === 'inactive'
              ? 'draft'
              : item.status,
        }))

        setNewsItems(migratedData)
        setFilteredItems(migratedData)
      } catch (error) {
        console.error('Failed to load news:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  useEffect(() => {
    let filtered = newsItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => {
        if (filterStatus === 'published') {
          return item.status === 'published' || item.status === 'active'
        } else if (filterStatus === 'draft') {
          return item.status === 'draft' || item.status === 'inactive'
        }
        return item.status === filterStatus
      })
    }

    // Apply author filter
    if (filterAuthor !== 'all') {
      filtered = filtered.filter((item) => item.author === filterAuthor)
    }

    // Apply tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter((item) => item.tags.includes(filterTag))
    }

    setFilteredItems(filtered)
    setPage(1)
  }, [searchQuery, newsItems, filterStatus, filterAuthor, filterTag])

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      setNewsItems((items) =>
        items.filter((item) => (item as any)._id !== id && item.id !== id),
      )
      toast({
        title: 'News Deleted',
        description: 'The news article has been successfully deleted.',
      })
    } catch (e) {
      console.error(e)
      toast({
        title: 'Delete failed',
        description: 'Please try again.',
        variant: 'destructive' as any,
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusToggle = async (id: string) => {
    try {
      const item = newsItems.find((n) => (n as any)._id === id || n.id === id)
      if (!item) return

      // Handle both old and new status values
      let newStatus: string
      if (item.status === 'published' || item.status === 'active') {
        newStatus = 'draft'
      } else {
        newStatus = 'published'
      }

      const res = await fetch(`/api/news/${(item as any)._id || item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const updated = await res.json()
      setNewsItems((items) =>
        items.map((n) => ((n as any)._id === updated._id ? updated : n)),
      )
      toast({
        title: 'Status Updated',
        description: 'News article status has been updated.',
      })
    } catch (e) {
      console.error(e)
      toast({
        title: 'Update failed',
        description: 'Please try again.',
        variant: 'destructive' as any,
      })
    }
  }

  // Calculate filter options
  const uniqueAuthors = [
    ...new Set(newsItems.map((item) => item.author)),
  ].sort()
  const uniqueTags = [...new Set(newsItems.flatMap((item) => item.tags))].sort()

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const paged = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />

      <main className='flex-1 overflow-auto'>
        <div className='p-8'>
          {/* Header with subtle FFWPU-themed gradient */}
          <div className='mb-8 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
            <div className='px-6 py-6'>
              <div>
                <h1 className='font-heading text-3xl font-bold'>
                  News Management
                </h1>
                <p className='text-muted-foreground'>
                  Manage community news and articles
                </p>
              </div>
            </div>
          </div>

          {/* Search and Create Button Row */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='relative w-full sm:max-w-xs'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by title, author, or tags...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-0'
              />
            </div>
            <div className='flex items-center gap-2'>
              <Button
                onClick={() => setCreateOpen(true)}
                className='relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer animate-[shine_3s_ease-in-out_infinite]'
              >
                <Plus className='mr-2 h-4 w-4 transition-transform group-hover:rotate-90 duration-300' />
                Create News Article
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-100%] animate-[shine_3s_ease-in-out_infinite]' />
              </Button>
            </div>
          </div>

          {/* News Table */}
          <Card className='shadow-sm overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-background dark:to-slate-950/20'>
            <div className='h-1 w-full bg-indigo-500' />
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>All News Articles</CardTitle>
                  <CardDescription>
                    Manage your community news and updates
                  </CardDescription>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <Filter className='h-4 w-4 text-muted-foreground' />
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className='w-32 cursor-pointer'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='published'>Published</SelectItem>
                        <SelectItem value='draft'>Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={filterAuthor} onValueChange={setFilterAuthor}>
                    <SelectTrigger className='w-36 cursor-pointer'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Authors</SelectItem>
                      {uniqueAuthors.map((author) => (
                        <SelectItem key={author} value={author}>
                          {author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className='w-32 cursor-pointer'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Tags</SelectItem>
                      {uniqueTags.slice(0, 20).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setFilterStatus('all')
                      setFilterAuthor('all')
                      setFilterTag('all')
                      setSearchQuery('')
                    }}
                    className='text-xs px-3 py-2'
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className='relative -mx-2 md:mx-0 overflow-auto rounded-xl border border-border/60'>
                  <Table className='min-w-[980px]'>
                    <TableHeader className='sticky top-0 z-[1] bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-900/60 dark:to-sky-950/40 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                      <TableRow>
                        <TableHead className='text-slate-700 py-3 w-20'></TableHead>
                        <TableHead className='text-slate-700 py-3'>
                          Title
                        </TableHead>
                        <TableHead className='text-slate-700 py-3'>
                          Author
                        </TableHead>
                        <TableHead className='text-slate-700 py-3'>
                          Date
                        </TableHead>
                        <TableHead className='text-slate-700 py-3'>
                          Status
                        </TableHead>
                        <TableHead className='text-slate-700 py-3'>
                          Views
                        </TableHead>
                        <TableHead className='text-slate-700 py-3'>
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading
                        ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                              <TableCell className='py-4'>
                                <Skeleton className='h-12 w-16 rounded' />
                              </TableCell>
                              <TableCell className='py-4'>
                                <div className='min-w-[320px] max-w-[560px]'>
                                  <Skeleton className='h-4 w-64' />
                                  <div className='flex flex-wrap gap-1 mt-2'>
                                    <Skeleton className='h-5 w-12 rounded-full' />
                                    <Skeleton className='h-5 w-14 rounded-full' />
                                    <Skeleton className='h-5 w-10 rounded-full' />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className='py-4'>
                                <Skeleton className='h-4 w-28' />
                              </TableCell>
                              <TableCell className='py-4'>
                                <Skeleton className='h-4 w-20' />
                              </TableCell>
                              <TableCell className='py-4'>
                                <Skeleton className='h-6 w-16 rounded-full' />
                              </TableCell>
                              <TableCell className='py-4'>
                                <Skeleton className='h-4 w-12' />
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
                        : paged.map((item: any) => (
                            <TableRow
                              key={(item as any)._id || item.id}
                              className='hover:bg-sky-50/60 dark:hover:bg-sky-950/20 transition-colors'
                            >
                              <TableCell className='py-4'>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className='w-16 h-12 rounded overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer'>
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          className='w-full h-full object-cover'
                                        />
                                      ) : (
                                        <ImageIcon className='w-6 h-6 text-slate-400' />
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side='right' className='p-0'>
                                    <div className='w-64 h-40 rounded-lg overflow-hidden'>
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          className='w-full h-full object-cover'
                                        />
                                      ) : (
                                        <div className='w-full h-full bg-slate-100 flex items-center justify-center'>
                                          <ImageIcon className='w-12 h-12 text-slate-400' />
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell className='py-4'>
                                <div className='min-w-[320px] max-w-[560px]'>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p
                                        className='font-medium text-foreground truncate cursor-pointer hover:underline transition-all duration-200'
                                        onClick={() => setPreviewItem(item)}
                                      >
                                        {item.title}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className='max-w-xs'>{item.title}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <div className='flex flex-wrap gap-1 mt-3'>
                                    {item.tags
                                      .slice(0, 3)
                                      .map((tag: string) => (
                                        <Badge
                                          key={tag}
                                          variant='secondary'
                                          className={`text-[10px] rounded-full border px-2 py-0.5 capitalize ${tagClasses(
                                            tag,
                                          )}`}
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    {item.tags.length > 3 && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge
                                            variant='outline'
                                            className='text-[10px] rounded-full cursor-help'
                                          >
                                            +{item.tags.length - 3}
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Other tags:{' '}
                                            {item.tags.slice(3).join(', ')}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className='max-w-[240px] truncate'>
                                {item.author}
                              </TableCell>
                              <TableCell className='py-4'>
                                {new Date(item.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className='py-4'>
                                <Badge
                                  variant='secondary'
                                  className={`cursor-pointer border rounded-full px-2.5 py-0.5 capitalize ${
                                    item.status === 'published' ||
                                    item.status === 'active'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                  }`}
                                  onClick={() =>
                                    handleStatusToggle(
                                      (item as any)._id || item.id,
                                    )
                                  }
                                >
                                  {item.status === 'active'
                                    ? 'published'
                                    : item.status === 'inactive'
                                    ? 'draft'
                                    : item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className='py-4'>
                                <div className='flex items-center gap-1 text-sm text-slate-600'>
                                  <Eye className='h-3.5 w-3.5' />
                                  <span className='font-medium'>
                                    {item.views || 0}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className='py-4'>
                                <div className='flex items-center gap-2'>
                                  <Button
                                    variant='secondary'
                                    size='sm'
                                    className='cursor-pointer gap-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    onClick={() => setPreviewItem(item)}
                                    aria-label={`Preview ${item.title}`}
                                  >
                                    <Eye className='h-4 w-4' />
                                    <span className='hidden sm:inline'>
                                      View
                                    </span>
                                  </Button>
                                  <Button
                                    variant='secondary'
                                    size='sm'
                                    className='cursor-pointer gap-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                    onClick={() => setEditItem(item)}
                                  >
                                    <Edit className='h-4 w-4' />
                                    <span className='hidden sm:inline'>
                                      Edit
                                    </span>
                                  </Button>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        className='cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                                        onClick={() => setDeleteItem(item)}
                                        aria-label={`Delete ${item.title}`}
                                      >
                                        <Trash2 className='h-4 w-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Delete article</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </TooltipProvider>

              {/* Pagination */}
              <div className='mt-6 flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  {loading ? (
                    'Loading…'
                  ) : (
                    <>
                      Showing{' '}
                      {filteredItems.length === 0
                        ? 0
                        : (page - 1) * PAGE_SIZE + 1}
                      –{Math.min(page * PAGE_SIZE, filteredItems.length)} of{' '}
                      {filteredItems.length}
                    </>
                  )}
                </div>
                <div className='flex items-center gap-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className='rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    ← Prev
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      size='sm'
                      variant={page === i + 1 ? 'default' : 'outline'}
                      onClick={() => setPage(i + 1)}
                      disabled={loading}
                      className={`rounded-lg min-w-[40px] h-9 text-sm font-medium transition-all duration-200 ${
                        page === i + 1
                          ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                          : 'hover:bg-primary/10 hover:text-primary border-input'
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className='rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Dialog */}
          <NewsPreviewDialog
            open={Boolean(previewItem)}
            item={previewItem as any}
            onOpenChange={(v: boolean) => {
              if (!v) setPreviewItem(null)
            }}
          />

          {/* Delete Confirm Dialog */}
          <Dialog
            open={Boolean(deleteItem)}
            onOpenChange={(v: boolean) => {
              if (!v) setDeleteItem(null)
            }}
          >
            <DialogContent className='max-w-sm p-0 overflow-hidden'>
              <div className='h-1 w-full bg-rose-500' />
              <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/10 border-b'>
                <DialogHeader>
                  <DialogTitle>Delete this article?</DialogTitle>
                </DialogHeader>
              </div>
              <div className='px-6 py-4 text-sm text-muted-foreground'>
                This action cannot be undone. You are about to delete:
                <div className='mt-2 rounded border p-3 bg-muted/30'>
                  <div className='font-medium text-foreground'>
                    {deleteItem?.title}
                  </div>
                  <div className='text-xs'>
                    by {deleteItem?.author} •{' '}
                    {deleteItem?.date
                      ? new Date(deleteItem.date).toLocaleDateString()
                      : ''}
                  </div>
                </div>
              </div>
              <div className='px-6 pb-4 flex justify-end gap-2'>
                <Button
                  className='cursor-pointer'
                  variant='secondary'
                  onClick={() => setDeleteItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  className='cursor-pointer'
                  disabled={deleting}
                  variant='destructive'
                  onClick={async () => {
                    if (!deleteItem) return
                    await handleDelete((deleteItem as any)._id || deleteItem.id)
                    setDeleteItem(null)
                  }}
                >
                  {deleting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <NewsForm
            open={createOpen || Boolean(editItem)}
            onOpenChange={(v) => {
              if (!v) {
                setCreateOpen(false)
                setEditItem(null)
              } else {
                setCreateOpen(true)
              }
            }}
            initial={editItem || undefined}
            onSaved={async () => {
              setLoading(true)
              const res = await fetch('/api/news')
              const data = await res.json()
              setNewsItems(data)
              setFilteredItems(data)
              setLoading(false)
            }}
          />
        </div>
      </main>
    </div>
  )
}
