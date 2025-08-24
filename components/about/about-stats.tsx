import { SectionShell } from "../ui/section-shell"

export function AboutStatsStrip() {
  const stats = [
    { label: 'Peace Road Manila (2015)', value: '4,000+', sub: 'participants' },
    { label: "Witnessing (Nov '23–Jan '24)", value: '99', sub: 'new members' },
    { label: 'Activated (same period)', value: '14', sub: 'members' },
    { label: 'Priority Cities (2024)', value: '5', sub: 'major churches' },
  ]

  return (
    <SectionShell className='py-10 md:py-14'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
        {stats.map((s) => (
          <div
            key={s.label}
            className='relative overflow-hidden rounded-2xl border bg-card px-4 py-6 md:px-6 md:py-8'
          >
            <div className='absolute -inset-10 bg-gradient-to-tr from-sky-500/10 via-blue-500/10 to-indigo-500/10 blur-2xl' />
            <div className='relative'>
              <div className='text-3xl md:text-4xl font-extrabold tracking-tight'>
                {s.value}
              </div>
              <div className='text-muted-foreground text-sm md:text-base'>
                {s.sub}
              </div>
              <div className='mt-2 text-xs uppercase tracking-wide opacity-70'>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
