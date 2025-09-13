// types/event.ts
export type Area =
  | 'Area 1'
  | 'Area 2'
  | 'Area 3'
  | 'Area 4'
  | 'Area 5'
  | 'Nationwide'

export type EventItem = {
  _id?: string
  title: string
  /** stored as 'YYYY-MM-DDTHH:mm' (local), composed from UI inputs */
  date: string
  end?: string
  location: string
  area: Area
  region: string // 'NCR' | 'Region 1' | ... | 'Region 13'
  church?: string
  image: string
  description?: string
  button?: string
  href?: string
}
