import { HistoryHeader } from '@/components/history/history-header'
import { TIMELINE } from '@/data/historyData'
import {
  parseAppointmentStarts,
  ICONS,
  LEADERS,
  getInitials,
  TimelineItem,
} from '@/constants/history.constants'
import { NationalLeadersGrid } from './NationalLeadersGrid'
import { TimelineWithState } from './TimelineWithState'

// Compose timeline with leader events
const BASE_TIMELINE: TimelineItem[] = (TIMELINE as any).map((t: any) => ({
  id: String(t.id),
  year: t.year,
  title: t.title,
  content: t.content,
  icon: (t.icon || 'calendar') as keyof typeof ICONS,
  imageUrl: (t as any).imageUrl ?? null,
  type: 'event',
}))

const LEADER_EVENTS: TimelineItem[] = LEADERS.flatMap((l) =>
  parseAppointmentStarts(l.tenure).map(({ y, m, d }, idx) => ({
    id: `leader-${l.id}-${idx}`,
    year: y,
    title: `${l.name}`,
    content: `Appointed ${l.role || 'National Leader'} • Tenure: ${l.tenure}`,
    icon: 'award',
    imageUrl: l.imageUrl || null,
    type: 'leader',
    _y: y,
    _m: m,
    _d: d,
  })),
)

const TIMELINE_WITH_LEADERS: TimelineItem[] = [
  ...BASE_TIMELINE,
  ...LEADER_EVENTS,
].sort((a, b) => {
  const get = (x: TimelineItem) => {
    if (x.type === 'leader') return x._y! * 10000 + x._m! * 100 + x._d!
    const s = String(x.year)
    const [yS, mS = '1', dS = '1'] = s.split('.')
    return parseInt(yS, 10) * 10000 + parseInt(mS, 10) * 100 + parseInt(dS, 10)
  }
  return get(a) - get(b)
})

export default function HistoryPage() {
  // Server component: use client components for interactive sections
  // Use useState in a client wrapper for Timeline
  // We'll use a simple client wrapper for forceYear state
  return (
    <div className='min-h-screen flex flex-col bg-slate-950 text-slate-100 px-4 md:px-0'>
      <main className='flex-1'>
        <div className='container py-12 mx-auto'>
          {/* Header */}
          <div className='relative text-center space-y-4 mb-16'>
            <div
              aria-hidden
              className='pointer-events-none absolute -inset-10 -z-10'
              style={{
                background:
                  'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.10), transparent 60%)',
              }}
            />
            <HistoryHeader />
          </div>

          {/* Timeline (events + leader appointments) */}
          <TimelineWithState timeline={TIMELINE_WITH_LEADERS} />

          {/* National Leaders Grid */}
          <div className='mt-16 mb-8'>
            <NationalLeadersGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
