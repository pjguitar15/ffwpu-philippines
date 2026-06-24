export function ArticleBody({ content }: { content: string }) {
  let html = (content || '').trim().replace(/\r\n?/g, '\n')
  if (!html) return null

  const hasStandardBlocks = /<(p|h[1-6]|ul|ol|li|blockquote|div)\b/i.test(html)
  if (!hasStandardBlocks) {
    html = html
      .split(/\n{2,}|\n\s*\n/g)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, ' ')}</p>`)
      .join('\n')
  }

  if (!html) return null

  return (
    <div className='mt-6 text-slate-800 dark:text-slate-100'>
      <div
        className='news-article max-w-none font-serif'
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style jsx>{`
        :global(.news-article) {
          line-height: 1.8;
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
