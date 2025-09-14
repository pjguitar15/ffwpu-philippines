import { Calendar, MapPin, Users, Award, Heart } from 'lucide-react'

export const ICONS = {
  calendar: Calendar,
  map: MapPin,
  users: Users,
  award: Award,
  heart: Heart,
} as const

export type Leader = {
  id: string
  name: string
  tenure: string // e.g. "1996.06 – 2009.12" or "1982–1989; 1996–1999"
  role?: string // "National Leader" (label)
  imageUrl?: string | null // put a /public path to show their photo
  description?: string
}

export const LEADERS: Leader[] = [
  {
    id: 'doroski',
    name: 'John & Nanette Doroski',
    role: 'Former National Leaders',
    tenure: '1978.10 – 1982.02',
    imageUrl: '/national-leaders/john-and-nanette-doroski.png',
    // description: 'Photo & full bio coming soon.',
  },
  {
    id: 'morutani',
    name: 'Yoshinobu Morutani',
    role: 'Former National Leader',
    tenure: '1982',
    imageUrl: '/national-leaders/yoshinobu-morutani.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'niduasa',
    name: 'Rev. Federico V. Niduasa',
    role: 'Former National Leader',
    tenure: '1982–1989; 1996–1999',
    imageUrl: '/national-leaders/rev-federico-niduasa.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'josol',
    name: 'Rev. Felomino A. Josol',
    role: 'Former National Leader',
    tenure: '1989–1992',
    imageUrl: '/national-leaders/rev-felomino-josol.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'soria',
    name: 'Bp. Elias T. Soria',
    role: 'Former National Leader',
    tenure: '1992.01 – 1992.12',
    imageUrl: '/national-leaders/bp-elias-soria.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'navalta',
    name: 'Prof. Celestino Jose V. Navalta, Jr.',
    role: 'Former National Leader',
    tenure: '1992–1994; 1995–1997',
    imageUrl: '/national-leaders/prof-celestino-navalta.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'zablan',
    name: 'Dr. Michael G. Zablan',
    role: 'Former National Leader',
    tenure: '1996.06 – 2009.12',
    imageUrl: '/national-leaders/dr-michael-zablan.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'basuil',
    name: 'Rev. Rolando C. Basuil, Jr.',
    role: 'Former National Leader',
    tenure: '2009.12 – 2011.07.01',
    imageUrl: '/national-leaders/rev-rolando-basuil.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'malicdem',
    name: 'Rev. Julius B. Malicdem',
    role: 'Former National Leader',
    tenure: '2011.08.01 – 2019.07.07',
    imageUrl: '/national-leaders/rev-julius-malicdem.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'halog',
    name: 'Rev. Leo Angelo Halog',
    role: 'Former National Leader',
    tenure: '2019.07.07 – 2025.05.01',
    imageUrl: '/national-leaders/leo-angelo-halog.png',
    // description: 'Photo & description coming soon.',
  },
  {
    id: 'sodusta',
    name: 'Rev. Ronnie Sodusta',
    role: 'Current National Leader',
    tenure: '2025.05.01 – Present',
    imageUrl: '/national-leaders/rev-ronnie-sodusta.png',
    // description: 'Photo & description coming soon.',
  },
]

export function getInitials(name: string) {
  return name
    .split(/\s|&/)
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 3)
    .join('')
}

export type TimelineItem = {
  id: string
  year: string | number
  title: string
  content: string
  icon: keyof typeof ICONS
  imageUrl?: string | null
  type?: 'event' | 'leader'
  _y?: number
  _m?: number
  _d?: number // for sorting
}

export function parseAppointmentStarts(
  tenure: string,
): { y: number; m: number; d: number }[] {
  return tenure.split(';').map((seg) => {
    const left = seg.trim().split('–')[0].split('-')[0].trim() // left date before dash
    const [yS, mS, dS] = left.split('.')
    const y = parseInt(yS || '0', 10)
    const m = parseInt(mS || '1', 10)
    const d = parseInt(dS || '1', 10)
    return { y, m, d }
  })
}