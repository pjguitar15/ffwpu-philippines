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
    title: 'Philippines: Community Teaching',
    author: 'FFWPU Philippines',
    date: '2025-02-19',
    image:
      'https://familyfedihq.org/wp-content/uploads/2025/02/ph-cm-tc-1-1024x683.jpg',
    tags: ['community', 'youth', 'service', 'IAYSP', 'Antipolo'],
    status: 'active',
    views: 412,
    likes: 37,
    content:
      'On Feb 15, 2025, FFWPU Philippines with IAYSP and local youth leaders ran a community teaching project in Sitio Upper Hinapao, Antipolo. 94 participants joined activities that built leadership, cooperation, and a spirit of service.',
    comments: [],
    slug: 'philippines-community-teaching',
  },
  {
    id: '2',
    title: 'Philippine: Japanese Cultural Experience',
    author: 'FFWPU Philippines',
    date: '2025-02-19',
    image:
      'https://familyfedihq.org/wp-content/uploads/2025/02/JPcevent-1024x514.jpg',
    tags: ['culture', 'Cebu', 'HTG', 'BUCCI', 'youth'],
    status: 'active',
    views: 358,
    likes: 29,
    content:
      'FFWPU Cebu teamed up with HTG Missionaries Japan and BUCCI to host a Japanese Cultural Experience on Feb 14, 2025—featuring songs, dance, calligraphy, origami, and norimaki tasting—plus messages on pure love and family.',
    comments: [],
    slug: 'philippine-japanese-cultural-experience',
  },
  {
    id: '3',
    title: 'Philippines: National Youth Leaders Convergence',
    author: 'Philippines Blessed Children Dept. & Youth Dept.',
    date: '2025-01-06',
    image:
      'https://familyfedihq.org/wp-content/uploads/2025/01/dream-1024x624.jpg',
    tags: [
      'leadership',
      'workshop',
      'youth',
      'DREAM Philippines',
      'PBCD',
      'IAYSP',
      'CARP',
    ],
    status: 'active',
    views: 501,
    likes: 45,
    content:
      'Held Dec 22–24, 2024 at Sun Hwa International Academy, the DREAM Philippines convergence gathered youth leaders from IAYSP, BCD, CARP and others for lectures, skills-building, and planning toward unified youth ministry goals.',
    comments: [],
    slug: 'philippines-national-youth-leaders-convergence',
  },
  {
    id: '4',
    title: 'Unified Sunday Service — Metro Manila Family Church',
    author: 'FFWPU Philippines',
    date: '2024-12-15',
    image: '/news/unified-svc-mmfc.jpg',
    tags: ['worship', 'family', 'NCR'],
    status: 'active',
    views: 208,
    likes: 19,
    content:
      'The MMFC community gathered for a unified Sunday service highlighting testimonies, family values, and preparations for year-end programs.',
    comments: [],
    slug: 'unified-sunday-service-mmfc-2024',
  },
  {
    id: '5',
    title: 'CARP Healing Café — Cebu Chapter',
    author: 'W-CARP Philippines',
    date: '2024-11-06',
    image: '/news/carp-healing-cafe-cebu.jpg',
    tags: ['CARP', 'youth', 'Cebu'],
    status: 'active',
    views: 172,
    likes: 22,
    content:
      'Students came together for reflection and bonding at the CARP Healing Café, with sharings on campus life, faith, and friendships.',
    comments: [],
    slug: 'carp-healing-cafe-cebu-2024',
  },
  {
    id: '6',
    title: 'IAYSP Outreach — Character Education Workshop',
    author: 'IAYSP Pilipinas',
    date: '2025-02-03',
    image: '/news/iaysp-character-ed-workshop.jpg',
    tags: ['IAYSP', 'education', 'youth'],
    status: 'active',
    views: 246,
    likes: 33,
    content:
      'IAYSP volunteers hosted a character education workshop for senior high students, focusing on leadership, service, and family values.',
    comments: [],
    slug: 'iaysp-character-education-workshop-2025',
  },
  {
    id: '7',
    title: 'Blessing Preparation Seminar — Couples & Families',
    author: 'FFWPU Philippines',
    date: '2025-01-20',
    image: '/news/blessing-prep-seminar.jpg',
    tags: ['blessing', 'family', 'education'],
    status: 'active',
    views: 193,
    likes: 27,
    content:
      'Couples participated in a full-day Blessing Preparation Seminar, with guidance on commitment, communication, and shared life of faith.',
    comments: [],
    slug: 'blessing-preparation-seminar-2025',
  },
  {
    id: '8',
    title: 'UPF Ambassadors for Peace Meetup — Manila',
    author: 'UPF Philippines',
    date: '2025-02-10',
    image: '/news/upf-ambassadors-meetup.jpg',
    tags: ['UPF', 'peace', 'interfaith'],
    status: 'active',
    views: 221,
    likes: 25,
    content:
      'Ambassadors for Peace convened to discuss service initiatives, interfaith cooperation, and family-strengthening projects in communities.',
    comments: [],
    slug: 'upf-ambassadors-for-peace-meetup-2025',
  },
  {
    id: '9',
    title: 'Community Service Drive — Relief Goods Distribution',
    author: 'FFWPU Philippines',
    date: '2025-02-08',
    image: '/news/community-service-relief.jpg',
    tags: ['service', 'relief', 'volunteers'],
    status: 'active',
    views: 289,
    likes: 31,
    content:
      'Volunteers packed and delivered relief goods to families in need, partnering with local barangays and youth groups.',
    comments: [],
    slug: 'community-service-relief-drive-2025',
  },
]

