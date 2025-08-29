'use client'

export function NewsDetailSkeleton() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <main className='flex-1'>
        <div className='container mx-auto py-10 px-4 md:px-6 mb-12'>
          {/* Breadcrumbs */}
          <div className='mb-4 -mx-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
            <div className='mx-2 inline-flex items-center gap-1'>
              <div className='h-8 w-20 rounded-md bg-slate-300 animate-pulse' />
              <div className='h-4 w-4 rounded-full bg-slate-300 animate-pulse' />
              <div className='h-8 w-20 rounded-md bg-slate-300 animate-pulse' />
              <div className='h-4 w-4 rounded-full bg-slate-300 animate-pulse' />
              <div className='h-8 w-48 md:w-80 rounded-md bg-slate-300 animate-pulse' />
            </div>
          </div>

          {/* HERO image */}
          <div className='relative w-full rounded-xl overflow-hidden ring-1 ring-black/10 shadow'>
            <div className='w-full h-[320px] md:h-[420px] bg-slate-300 animate-pulse' />
          </div>

          {/* Main + Sidebar */}
          <div className='mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10'>
            {/* MAIN */}
            <div className='lg:col-span-2'>
              <div className='h-3 w-56 bg-slate-300 rounded animate-pulse mb-3' />
              <div className='space-y-3'>
                <div className='h-8 w-3/4 bg-slate-300 rounded animate-pulse' />
                <div className='h-8 w-2/3 bg-slate-300 rounded animate-pulse' />
              </div>
              <div className='mt-4 flex gap-2'>
                <div className='h-6 w-16 rounded-full bg-slate-300 animate-pulse' />
                <div className='h-6 w-16 rounded-full bg-slate-300 animate-pulse' />
                <div className='h-6 w-16 rounded-full bg-slate-300 animate-pulse' />
              </div>
              <div className='prose max-w-none mt-6 space-y-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-4 w-full bg-slate-300 rounded animate-pulse'
                    style={{ width: i % 3 === 2 ? '80%' : '100%' }}
                  />
                ))}
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className='lg:col-span-1'>
              <div className='h-4 w-44 bg-slate-300 rounded animate-pulse' />
              <div className='mt-4 space-y-6'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <div className='relative rounded-lg overflow-hidden ring-1 ring-black/10 shadow bg-white'>
                      <div className='w-full h-32 bg-slate-300 animate-pulse' />
                    </div>
                    <div className='mt-2 h-3 w-40 bg-slate-300 rounded animate-pulse' />
                    <div className='mt-2 h-4 w-3/4 bg-slate-300 rounded animate-pulse' />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
