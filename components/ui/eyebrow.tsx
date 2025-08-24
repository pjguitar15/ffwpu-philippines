export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-primary font-semibold tracking-wide uppercase text-xs md:text-sm'>
      {children}
    </p>
  )
}