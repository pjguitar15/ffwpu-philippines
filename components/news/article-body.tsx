'use client'

import { useMemo } from 'react'

export function ArticleBody({ content }: { content: string }) {
  const paragraphs = useMemo(() => {
    const s = (content || '').trim()
    if (!s) return []

    if (/<p[\s>]/i.test(s)) {
      const matches = s.match(/<p[\s\S]*?<\/p>/gi) || []
      if (matches.length) {
        return matches
          .map((p) =>
            p
              .replace(/^<p[^>]*>/i, '')
              .replace(/<\/p>$/i, '')
              .trim(),
          )
          .filter(Boolean)
      }
    }

    return s
      .split(/\n\s*\n/g)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => p.replace(/\n/g, '<br/>'))
  }, [content])

  return (
    <div className='mt-6 text-slate-800 dark:text-slate-100'>
      <div className='flex flex-col gap-3 md:gap-4 leading-7 md:leading-8'>
        {paragraphs.map((html, i) => (
          <p
            key={i}
            className='m-0'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </div>
    </div>
  )
}
