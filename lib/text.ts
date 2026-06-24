export function htmlToText(html: string) {
  return (
    decodeHtmlEntities(html)
      // drop scripts/styles just in case
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      // remove all tags
      .replace(/<\/?[^>]+>/g, ' ')
      // collapse whitespace
      .replace(/\s+/g, ' ')
      .trim()
  )
}

export function decodeHtmlEntities(value: string) {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }

  return (value || '').replace(
    /&(#x?[0-9a-f]+|[a-z]+);/gi,
    (entity, code: string) => {
      if (code[0] === '#') {
        const isHex = code[1]?.toLowerCase() === 'x'
        const number = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10)
        return Number.isFinite(number) ? String.fromCodePoint(number) : entity
      }

      return named[code.toLowerCase()] ?? entity
    },
  )
}

export function excerptFromHtml(html: string, maxChars = 180) {
  const text = htmlToText(html)
  if (text.length <= maxChars) return text
  const cut = text.slice(0, maxChars)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

// Create a URL-friendly slug from a title
export function slugify(input: string) {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Turn a multiline string into HTML paragraphs if not already HTML
export function toParagraphHtml(input: string) {
  const s = (input || '').trim()
  if (!s) return ''
  // If content already contains common block-level tags from a rich editor, return as-is
  if (
    /(<p[\s>]|<h[1-6][\s>]|<ul[\s>]|<ol[\s>]|<li[\s>]|<blockquote[\s>])/i.test(
      s,
    )
  )
    return s
  return s
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('\n')
}
