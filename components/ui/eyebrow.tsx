export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-primary font-semibold tracking-wide uppercase text-xs md:text-sm ${className}`}
    >
      {children}
    </p>
  )
}