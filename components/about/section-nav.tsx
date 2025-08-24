"use client"

import { useEffect, useMemo, useState } from "react"

type Section = {
  id: string
  label: string
}

interface SectionNavProps {
  sections: Section[]
  /** Offset in pixels to account for fixed headers before considering a section active */
  offset?: number
}

/**
 * Sticky right-side navigation for in-page sections.
 * - Highlights the active section using IntersectionObserver
 * - Smooth scrolls to anchors on click
 */
export function SectionNav({ sections, offset = 120 }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id)

  const ids = useMemo(() => sections.map((s) => s.id), [sections])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      }
    }

    // Use rootMargin so a section becomes active a bit before it hits the very top
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: `-${offset}px 0px -60% 0px`,
      threshold: [0, 0.25, 0.5, 1],
    })

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    observers.push(observer)

    return () => observers.forEach((o) => o.disconnect())
  }, [ids, offset])

  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - (offset - 16)
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <nav className="hidden lg:block sticky top-28">
      <ul className="relative">
        {sections.map((s, idx) => {
          const isActive = s.id === activeId
          return (
            <li key={s.id} className='relative'>
              <a
                href={`#${s.id}`}
                onClick={(e) => onClick(e, s.id)}
                className={
                  'block text-sm transition-colors pl-4 cursor-pointer py-3 ' +
                  (isActive
                    ? 'text-foreground font-semibold border-blue-500 border-l-3'
                    : 'text-muted-foreground hover:text-foreground border-blue-300 border-l-2')
                }
              >
                {s.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
