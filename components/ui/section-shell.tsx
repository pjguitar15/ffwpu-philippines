export function SectionShell({
  children,
  dark = false,
  className = '',
}: {
  children: React.ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <section
      className={`relative ${
        dark ? 'bg-slate-950 text-white' : 'bg-background'
      } ${className}`}
    >
      {/* soft gradient wash */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 ${
          dark
            ? '[mask-image:radial-gradient(50%_50%_at_50%_40%,#000_40%,transparent_70%)]'
            : '[mask-image:radial-gradient(50%_50%_at_50%_40%,#000_35%,transparent_70%)]'
        }`}
        style={{
          background: dark
            ? 'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.12), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.18), transparent 60%)'
            : 'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.15), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(59,130,246,0.12), transparent 60%)',
        }}
      />
      <div className='container mx-auto px-4 py-16 md:py-24'>{children}</div>
    </section>
  )
}
