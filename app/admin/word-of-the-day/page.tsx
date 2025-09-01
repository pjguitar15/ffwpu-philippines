// app/admin/words-of-the-day/page.tsx
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
          <h1 className='font-heading text-3xl font-bold mb-2'>
            Words of the Day
          </h1>
          <p className='text-muted-foreground mb-6'>
            Manage daily quotes (static demo; no API yet).
          </p>

          <WotdAdmin initialList={initialList} />
        </div>
      </main>
    </div>
  )
}
