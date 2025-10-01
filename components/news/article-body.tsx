'use client'

import { useMemo } from 'react'
import Link from 'next/link'

export function ArticleBody({ content }: { content: string }) {
  const html = useMemo(() => {
    let s = (content || '').trim()
    if (!s) return ''

    // Normalize Windows newlines
    s = s.replace(/\r\n?/g, '\n')

    // If it already has standard block tags, keep as-is
    const hasStandardBlocks = /<(p|h[1-6]|ul|ol|li|blockquote)\b/i.test(s)

    if (!hasStandardBlocks) {
      if (/<div\b/i.test(s)) {
        // Merge consecutive non-empty divs into one paragraph.
        // New paragraph only when there's an intentionally blank div (or a div that only has <br/>).
        const container = document.createElement('div')
        container.innerHTML = s

        const paras: string[] = []
        let buf: string[] = []

        const flush = () => {
          if (!buf.length) return
          // Join fragments with a single space; collapse extra whitespace
          const inner = buf.join(' ').replace(/\s+/g, ' ').trim()
          if (inner) paras.push(`<p>${inner}</p>`)
          buf = []
        }

        Array.from(container.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement
            if (el.tagName === 'DIV') {
              const html = el.innerHTML.trim()
              // Blank div if no text content and no media/embedded content
              const isBlank =
                (el.textContent || '').replace(/\u00A0/g, ' ').trim() === '' &&
                !/<(img|iframe|video|audio|svg|canvas)\b/i.test(html)

              if (isBlank) {
                flush()
              } else {
                buf.push(html)
              }
            } else {
              // Other elements: treat as inline fragments of current paragraph
              buf.push(el.outerHTML || '')
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            const txt = (node.textContent || '').trim()
            if (txt) buf.push(txt)
          }
        })
        flush()

        // If we built paragraphs, use them; otherwise fall back to original
        s = paras.length ? paras.join('\n') : container.innerHTML
      } else {
        // Plain text: split on blank lines into paragraphs;
        // single newlines are just spaces (no <br/>).
        s = s
          .split(/\n{2,}|\n\s*\n/g)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => `<p>${p}</p>`)
          .join('\n')
      }
    }

    return s
  }, [content])

  if (!html) return null

  return (
    <div className='mt-6 text-slate-800 dark:text-slate-100'>
      <article
        className='news-article max-w-none font-serif'
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
          font-weight: 700;
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
          border-left: 3px solid rgb(203 213 225);
          padding-left: 0.75rem;
          margin: 0.75rem 0 1rem;
          color: rgb(100 116 139);
          font-style: italic;
          background: rgba(241, 245, 249, 0.35);
        }
        .cta-sparkle {
          animation: floaty 4.8s ease-in-out infinite;
          opacity: 0.9;
        }
        .cta-sparkle.delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes floaty {
          0% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-6px) rotate(6deg);
          }
          100% {
            transform: translateY(0) rotate(0);
          }
        }
        .cta-wiggle:hover {
          animation: wiggle 0.7s ease-in-out;
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0);
          }
          25% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
      `}</style>
    </div>
  )
}
