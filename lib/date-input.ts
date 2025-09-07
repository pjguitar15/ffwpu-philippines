// lib/date-input.ts
export const DEFAULT_TIME = '10:00' // 10:00 AM for <input type="time">

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

export function toMMDDYYYY(d: Date) {
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`
}

export function parseMMDDYYYY(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const mm = Number(m[1])
  const dd = Number(m[2])
  const yyyy = Number(m[3])
  const d = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0)
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd)
    return null
  return d
}

/** Compose local 'YYYY-MM-DDTHH:mm' from 'MM/DD/YYYY' + 'HH:mm' */
export function combineLocalISOShort(dateStr: string, timeStr: string) {
  const d = parseMMDDYYYY(dateStr)
  if (!d) return ''
  const [hh, min] = timeStr.split(':').map(Number)
  d.setHours(hh || 0, min || 0, 0, 0)
  const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(
    d.getDate(),
  )}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export function splitToDateTimeStrings(isoLike?: string | null) {
  if (!isoLike)
    return { dateStr: toMMDDYYYY(new Date()), timeStr: DEFAULT_TIME }
  const d = new Date(isoLike)
  if (isNaN(d.getTime()))
    return { dateStr: toMMDDYYYY(new Date()), timeStr: DEFAULT_TIME }
  const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return {
    dateStr: toMMDDYYYY(d),
    timeStr: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
  }
}
