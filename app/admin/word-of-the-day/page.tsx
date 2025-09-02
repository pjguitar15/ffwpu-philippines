// app/admin/word-of-the-day/page.tsx
import WotdAdmin from '@/components/admin/wotd/wotd'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

// (Optional) local type so TS is happy when passing the prop
type Quote = {
  id: string
  text: string
  author?: string
  date?: string
  status: 'draft' | 'published'
  tags?: string[]
}

// Static demo data (quotes)
const initialList: Quote[] = [
  {
    id: 'q1',
    text: 'A grateful heart is a magnet for miracles.',
    author: 'Unknown',
    date: '2025-09-02',
    status: 'published',
    tags: ['gratitude', 'inspiration'],
  },
  {
    id: 'q2',
    text: 'Small daily improvements over time lead to stunning results.',
    author: 'Robin Sharma',
    date: '2025-09-03',
    status: 'draft',
    tags: ['growth', 'habits'],
  },
]

export default function Page() {
  return (
    <div className='flex min-h-screen bg-background'>
      <AdminSidebar />
      <main className='flex-1 overflow-y-auto'>
        <div className='p-8 mx-auto max-w-screen-2xl'>
          {/* Themed header */}
          <div className='mb-8 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
            <div className='px-6 py-6 flex items-center justify-between'>
              <div>
                <h1 className='font-heading text-3xl font-bold'>
                  Word of the Day
                </h1>
                <p className='text-muted-foreground'>
                  Manage daily quotes, set today’s word, and schedule changes
                </p>
              </div>
            </div>
          </div>

          <WotdAdmin initialList={initialList} />
        </div>
      </main>
    </div>
  )
}
