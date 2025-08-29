export function htmlToText(html: string) {
  return (
    html
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

export function excerptFromHtml(html: string, maxChars = 180) {
  const text = htmlToText(html)
  if (text.length <= maxChars) return text
  const cut = text.slice(0, maxChars)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}
