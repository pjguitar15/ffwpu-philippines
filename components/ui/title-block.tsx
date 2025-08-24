import { Eyebrow } from './eyebrow'
import { HighlightTitle } from './highlight-title'

export function TitleBlock({
  eyebrow,
  title,
  highlightedText,
  gradient,
  description,
  dark = false,
}: {
  eyebrow: string
  title: string
  highlightedText: string
  gradient: string
  description: string
  dark?: boolean
}) {
  return (
    <div className='space-y-4'>
      <Eyebrow>{eyebrow}</Eyebrow>

      {/* On dark sections, make the non-highlighted text white */}
      <HighlightTitle
        as='h2'
        text={title}
        highlightedText={highlightedText}
        className={`text-3xl md:text-5xl ${dark ? 'text-white' : ''}`}
        uppercase
        gradientClassName={gradient}
      />

      <p
        className={`leading-relaxed max-w-2xl ${
          dark ? 'text-white/80' : 'text-muted-foreground'
        }`}
      >
        {description}
      </p>
    </div>
  )
}
