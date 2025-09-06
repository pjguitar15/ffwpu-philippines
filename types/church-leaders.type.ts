export type Level = 'National' | 'Department' | 'Area' | 'Region'

export type Role = { level: Level; title: string; tag?: string; order?: number }

export type JoinedLeader = {
  name: string
  photoUrl?: string
  roles: Role[]
}

export type Leader = {
  name: string
  title: string // displayed under name (e.g., National Leader, Area 1 Leader)
  photoUrl: string // standing/portrait image (3:4 or 4:5 works best)
  level: Level
  tag?: string // e.g., “Area 1”, “R7”, “Youth Dept”
  order?: number // custom ordering within the level
}
