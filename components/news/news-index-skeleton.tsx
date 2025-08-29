'use client'

export function NewsIndexSkeleton({ cards = 9 }: { cards?: number }) {
  return (
    <section className='overflow-hidden'>
      <div className='container mx-auto space-y-6 px-4 md:px-6 py-10'>
        {/* Header */}
        <div className='space-y-3 text-center md:text-left'>
          <div className='mx-auto md:mx-0 h-3 w-40 rounded bg-slate-300 animate-pulse' />
          <div className='mx-auto md:mx-0 h-8 w-64 md:w-96 rounded bg-slate-300 animate-pulse' />
        </div>

        {/* Controls */}
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          {/* Search */}
          <div className='w-full md:max-w-md'>
            <div className='h-10 w-full rounded-xl border bg-white animate-pulse' />
          </div>
          {/* Sort + View */}
          <div className='flex items-center gap-2'>
            <div className='h-10 w-32 rounded-xl border bg-white animate-pulse' />
            <div className='ml-1 inline-flex overflow-hidden rounded-xl border'>
              <div className='h-10 w-10 bg-slate-300 animate-pulse' />
              <div className='h-10 w-10 bg-slate-300 animate-pulse' />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className='flex items-center gap-2 overflow-x-auto pt-1 pb-2'>
          <div className='h-4 w-12 rounded bg-slate-300 shrink-0 animate-pulse' />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='h-7 w-20 rounded-full border bg-white shrink-0 animate-pulse'
            />
          ))}
        </div>

        {/* Grid of cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: cards }).map((_, i) => (
            <div
              key={i}
              className='relative rounded-xl overflow-hidden ring-1 ring-black/10 bg-white'
            >
              <div className='h-44 md:h-52 w-full bg-slate-300 animate-pulse' />
              <div className='p-4 space-y-3'>
                <div className='h-3 w-32 rounded bg-slate-300 animate-pulse' />
                <div className='h-5 w-3/4 rounded bg-slate-300 animate-pulse' />
                <div className='h-4 w-full rounded bg-slate-300 animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
