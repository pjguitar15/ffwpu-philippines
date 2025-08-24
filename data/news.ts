export interface NewsItem {
  id: string
  title: string
  author: string
  date: string
  image: string
  tags: string[]
  status: string
  views: number
  likes: number
  content: string
  comments: any[]
  slug: string
}

export const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'FFWPU Philippines Celebrates Foundation Day 2025',
    author: 'Rev. Maria Santos',
    date: '2025-01-15',
    image: '/church-family-celebration.png',
    tags: ['celebration', 'foundation-day', 'community'],
    status: 'active',
    views: 245,
    likes: 18,
    content:
      'Our community came together to celebrate another year of growth and spiritual development...',
    comments: [],
    slug: 'ffwpu-philippines-celebrates-foundation-day-2025',
  },
  {
    id: '2',
    title: "Youth Summit 2025: Building Tomorrow's Leaders",
    author: 'Pastor John Cruz',
    date: '2025-01-10',
    image: '/placeholder-q1vz8.png',
    tags: ['youth', 'leadership', 'education'],
    status: 'active',
    views: 189,
    likes: 24,
    content:
      'Over 200 young people gathered for our annual Youth Summit focusing on leadership development...',
    comments: [],
    slug: 'youth-summit-2025-building-tomorrows-leaders',
  },
  {
    id: '3',
    title: 'Community Service Project: Helping Flood Victims',
    author: 'Sister Grace Reyes',
    date: '2025-01-05',
    image: '/disaster-relief-volunteers.png',
    tags: ['service', 'disaster-relief', 'community'],
    status: 'active',
    views: 156,
    likes: 31,
    content:
      'Our members mobilized quickly to provide aid and comfort to families affected by recent flooding...',
    comments: [],
    slug: 'community-service-project-helping-flood-victims',
  },
]
