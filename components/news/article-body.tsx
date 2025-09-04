'use client'

import { useMemo } from 'react'
import Link from 'next/link'

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

      {/* Cute & fun CTA under the article */}
      <div className='relative mt-10'>
        {/* sparkles */}
        <span className='hidden sm:block absolute -top-2 right-6 select-none cta-sparkle'>
          ✨
        </span>
        <span className='hidden sm:block absolute -bottom-3 left-10 select-none cta-sparkle delay-300'>
          ✨
        </span>

        <div className='rounded-2xl border border-sky-200/70 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-900/30 dark:to-indigo-900/20 p-4 sm:p-5 flex items-center gap-4 shadow-[0_8px_20px_-8px_rgba(2,132,199,0.35)]'>
          {/* Cute owl avatar (inline SVG) */}
          <div className='h-12 w-12 sm:h-14 sm:w-14 rounded-full ring-2 ring-sky-300 bg-white flex items-center justify-center overflow-hidden'>
            <svg viewBox='0 0 64 64' className='h-10 w-10 sm:h-12 sm:w-12'>
              <defs>
                <clipPath id='owlCircle'>
                  <circle cx='32' cy='32' r='28' />
                </clipPath>
              </defs>
              <g clipPath='url(#owlCircle)'>
                <circle cx='32' cy='36' r='24' fill='#fde68a' />
                <ellipse cx='32' cy='40' rx='18' ry='16' fill='#f59e0b' />
                <circle cx='24' cy='28' r='9' fill='#fff' />
                <circle cx='40' cy='28' r='9' fill='#fff' />
                <circle cx='24' cy='28' r='4' fill='#0f172a' />
                <circle cx='40' cy='28' r='4' fill='#0f172a' />
                <polygon points='32,34 28,42 36,42' fill='#e11d48' />
                <path
                  d='M12 20 Q24 8 32 20 Q40 8 52 20'
                  fill='none'
                  stroke='#0ea5e9'
                  strokeWidth='3'
                  strokeLinecap='round'
                />
              </g>
            </svg>
          </div>
          <div className='flex-1'>
            <div className='text-sm font-semibold text-slate-800 dark:text-slate-100'>
              Looking for more stories?
            </div>
            <p className='text-xs text-slate-600 dark:text-slate-300 mt-0.5'>
              We share updates, events, and inspiring testimonies ✨
            </p>
            <Link
              href='/news'
              aria-label='Explore more news'
              className='group inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white text-xs sm:text-sm hover:from-indigo-700 hover:via-sky-700 hover:to-emerald-700 active:scale-[0.99] transition shadow-sm'
            >
              Explore more news
              <span
                aria-hidden
                className='transition-transform group-hover:translate-x-0.5'
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

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
          border-left: 3px solid rgb(203 213 225); /* slate-300 */
          padding-left: 0.75rem;
          margin: 0.75rem 0 1rem;
          color: rgb(100 116 139);
          font-style: italic;
          background: rgba(241, 245, 249, 0.35);
        }
        /* Cute CTA micro-animations */
        .cta-sparkle {
          animation: floaty 4.8s ease-in-out infinite;
          opacity: 0.9;
        }
        .cta-sparkle.delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes floaty {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(6deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        .cta-wiggle:hover {
          animation: wiggle 0.7s ease-in-out;
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
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
