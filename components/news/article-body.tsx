'use client'

import { useMemo } from 'react'

export function ArticleBody({ content }: { content: string }) {
  const html = useMemo(() => {
    let s = (content || '').trim()
    if (!s) return ''
    // If there are no common block-level tags, try to normalize
    const hasBlocks = /<(p|h[1-6]|ul|ol|li|blockquote)\b/i.test(s)
    if (!hasBlocks) {
      if (/<div\b/i.test(s)) {
        // Treat divs as paragraphs so spacing applies
        s = s.replace(/<div[^>]*>/gi, '<p>').replace(/<\/div>/gi, '</p>')
      } else {
        // Convert plain text to paragraphs, preserving single newlines as <br/>
        s = s
          .split(/\n\s*\n/g)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
          .join('\n')
      }
    }
    return s
  }, [content])
  if (!html) return null

  return (
    <div className='mt-6 text-slate-800 dark:text-slate-100'>
      <article
        className='news-article max-w-none'
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style jsx>{`
        :global(.news-article) {
          line-height: 1.8;
        }
        :global(.news-article p) {
          margin: 0 0 1rem 0;
        }
        :global(.news-article p:last-child) {
          margin-bottom: 0;
        }
        :global(.news-article h1) {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 800;
          margin: 1.25rem 0 0.75rem;
        }
        :global(.news-article h2) {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
          margin: 1.25rem 0 0.5rem;
        }
        :global(.news-article h3) {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        :global(.news-article h4) {
          font-size: 1.125rem;
          line-height: 1.75rem;
          font-weight: 700;
          margin: 0.75rem 0 0.5rem;
        }
        :global(.news-article ul),
        :global(.news-article ol) {
          margin: 0.25rem 0 1rem 1.25rem;
          padding: 0 0 0 0.75rem;
        }
        :global(.news-article ul) {
          list-style: disc;
        }
        :global(.news-article ol) {
          list-style: decimal;
        }
        :global(.news-article li) {
          margin: 0.25rem 0;
        }
        :global(.news-article li p) {
          margin: 0.25rem 0;
        }
        :global(.news-article a) {
          color: #2563eb;
          text-decoration: underline;
        }
        :global(.news-article blockquote) {
          border-left: 3px solid rgb(203 213 225); /* slate-300 */
          padding-left: 0.75rem;
          margin: 0.75rem 0 1rem;
          color: rgb(100 116 139);
          font-style: italic;
          background: rgba(241, 245, 249, 0.35);
        }
      `}</style>
    </div>
  )
}
