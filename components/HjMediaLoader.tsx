export default function HjMediaLoader({name }: {name: string} ) {
  return (
    <div className='relative min-h-screen flex items-center justify-center bg-gray-50 text-slate-800 overflow-hidden dark:bg-slate-950 dark:text-slate-200'>
      {/* soft glows */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20' />
        <div className='absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/20' />
      </div>

      <div
        role='status'
        aria-live='polite'
        className='relative z-10 flex flex-col items-center'
      >
        {/* spinner */}
        <div className='relative h-20 w-20'>
          {/* outer ring (spinning conic gradient) */}
          <div className='absolute inset-0 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-indigo-500 via-sky-400 to-cyan-400 motion-safe:animate-[spin_1.4s_linear_infinite] motion-reduce:animate-none' />
          {/* cutout to make the ring */}
          <div className='absolute inset-[6px] rounded-full bg-gray-50 dark:bg-slate-950 ring-1 ring-black/5 dark:ring-white/10' />
          {/* glowing core */}
          <div className='absolute inset-0 grid place-items-center'>
            <div className='h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-cyan-400 animate-pulse' />
          </div>
        </div>

        <p className='mt-6 text-lg font-medium'>Loading {name}…</p>

        {/* shimmer progress bar */}
        <div className='mt-4 h-1.5 w-56 rounded-full bg-slate-200/80 overflow-hidden dark:bg-white/10'>
          <div className='h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 motion-safe:animate-[progress_1.2s_ease-in-out_infinite] motion-reduce:animate-none' />
        </div>

        {/* sr-only live text for screen readers */}
        <span className='sr-only'>Content is loading</span>
      </div>

      {/* keyframes for the shimmer bar */}
      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  )
}
