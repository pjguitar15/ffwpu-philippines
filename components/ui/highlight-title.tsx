'use client'
import * as React from 'react'


type HighlightTitleProps = {
  text: string
  highlightedText?: string | string[]
  as?: React.ElementType
  className?: string
  uppercase?: boolean
  gradientClassName?: string
  dark?: boolean
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderHighlighted(
  text: string,
  highlight?: string | string[],
  gradientClassName = 'bg-gradient-to-r from-indigo-900 via-violet-800 to-purple-800 bg-clip-text text-transparent',
) {
  const terms = Array.isArray(highlight)
    ? highlight
    : highlight
    ? [highlight]
    : []
  if (terms.length === 0) return text

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  const parts = text.split(pattern)

  return parts.map((part, i) => {
    const isHit = terms.some((t) => part.toLowerCase() === t.toLowerCase())
    return (
      <span key={i} className={isHit ? gradientClassName : undefined}>
        {part}
      </span>
    )
  })
}

export function HighlightTitle({
  text,
  highlightedText,
  as,
  className = '',
  uppercase = false,
  gradientClassName,
  dark = false,
}: HighlightTitleProps) {
  const Tag = (as || 'h2') as React.ElementType
  return (
    <Tag
      className={[
        'font-extrabold leading-tight tracking-wide text-slate-900',
        uppercase ? 'uppercase' : '',
        className,
        `${dark ? 'text-white/80' : 'text-muted-foreground'}`,
      ].join(' ')}
    >
      {renderHighlighted(text, highlightedText, gradientClassName)}
    </Tag>
  )
}
