import React from 'react'
import clsx from 'clsx'

export type SectionGlareProps = {
  className?: string
  /** Overall vertical gradient wash classes (tailwind). Defaults to sky→white. */
  washClassName?: string
  /** Whether to include the top-centered halo circle. */
  halo?: boolean
  /** Halo size (height x width) in Tailwind arbitrary values. */
  haloSizeClassName?: string
  /** Halo color classes. */
  haloClassName?: string
  /** Position tweaks for the halo div. */
  haloPositionClassName?: string
}

/**
 * SectionGlare renders a non-interactive background accent like the one in Church Branches.
 * Place it as the first child inside a relatively positioned section/container.
 */
export default function SectionGlare({
  className,
  washClassName = 'bg-gradient-to-b from-sky-50/60 via-slate-50/40 to-white',
  halo = true,
  haloSizeClassName = 'h-72 w-72',
  haloClassName = 'rounded-full bg-sky-200/30 blur-3xl',
  haloPositionClassName = 'left-1/2 top-0 -translate-x-1/2',
}: SectionGlareProps) {
  return (
    <div className={clsx('pointer-events-none absolute inset-0 -z-10', className)}>
      <div className={clsx('absolute inset-0', washClassName)} />
      {halo && (
        <div className={clsx('absolute', haloSizeClassName, haloClassName, haloPositionClassName)} />
      )}
    </div>
  )
}
