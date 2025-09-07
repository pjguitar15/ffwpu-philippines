export interface TestimonyVideo {
  _id: string
  title: string
  description?: string
  speaker: string
  duration: string
  category: 'couples' | 'family' | 'parenting' | 'personal'
  videoId: string
  thumbnailUrl: string
  isActive: boolean
  order: number
  tags?: string[]
  episodeNumber?: string
}
