"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { NewsItem, sampleNews } from "../data/news"
import { HeroSection } from "@/components/home/hero-section"
import { RecentNewsSection } from "@/components/home/recent-news-section"
import { UpcomingEventsSection } from '@/components/home/upcoming-events-section'
import { QuickLinksSection } from '@/components/home/quick-links-section'
import { TrueParentsSection } from '@/components/home/true-parents-section'
import { ChurchBranchesSection } from '@/components/home/church-branches-section'
import { NewsletterBanner } from '@/components/home/newsletter-banner'
import { SideBySide } from '@/components/side-by-side'

const sampleArticles: NewsItem[] = [
  {
    id: '4',
    title: 'The Power of True Love in Daily Life',
    author: 'Rev. Michael Torres',
    date: '2025-01-12',
    image: '/peaceful-family-prayer.png',
    tags: ['true-love', 'family', 'spirituality'],
    status: 'active',
    views: 312,
    likes: 42,
    content:
      'True Love is not just a concept but a living practice that transforms our relationships...',
    comments: [],
    slug: '',
  },
  {
    id: '5',
    title: "Understanding God's Providence in Modern Times",
    author: 'Dr. Sarah Kim',
    date: '2025-01-08',
    image: '/peaceful-meditation-prayer.png',
    tags: ['providence', 'faith', 'modern-life'],
    status: 'active',
    views: 278,
    likes: 35,
    content:
      "In our fast-paced world, recognizing God's hand in daily events becomes crucial for spiritual growth...",
    comments: [],
    slug: '',
  },
  {
    id: '6',
    title: 'Building Bridges: Interfaith Dialogue and Unity',
    author: 'Rev. David Gonzales',
    date: '2025-01-03',
    image: '/diverse-religious-leaders-meeting.png',
    tags: ['interfaith', 'unity', 'dialogue'],
    status: 'active',
    views: 201,
    likes: 28,
    content:
      'Our recent interfaith gathering demonstrated the power of respectful dialogue in building understanding...',
    comments: [],
    slug: '',
  },
]

const upcomingEvents = [
  // 🟢 your originals
  {
    id: 1,
    title: 'Together, We Build a Stronger Community',
    date: '2024-12-02T15:00:00',
    end: '2024-12-02T19:00:00',
    location: '85 Preston Rd. Inglewood, Maine 980.',
    region: 'International',
    image: '/church-community-gathering.png',
    button: 'Contact Us',
  },
  {
    id: 2,
    title: 'Family Worship & Fellowship',
    date: '2024-12-10T10:00:00',
    end: '2024-12-10T12:00:00',
    location: 'FFWPU Manila Center, Quezon City',
    region: 'NCR',
    image: '/family-worship.png',
    button: 'Join Event',
  },
  {
    id: 3,
    title: 'Youth Leadership Summit',
    date: '2025-01-15T09:00:00',
    end: '2025-01-15T17:00:00',
    location: 'Cebu City Convention Hall',
    region: 'Region VII',
    image: '/youth-fellowship.png',
    button: 'Learn More',
  },

  // 🟣 real/events list you added
  {
    id: 4,
    title: 'HyoJeong Family Festival (National Sunday Service)',
    date: '2024-01-21T10:00:00',
    end: '2024-01-21T12:00:00',
    location: 'FFWPU Metro Manila Church, Quezon City • Onsite & Online',
    region: 'NCR',
    image: '/events/hyojeong-family-festival-2024.jpg',
    button: 'Watch Recap',
  },
  {
    id: 5,
    title: 'HJ CheonBo Special Event (La Union) – Purify & Heal',
    date: '2024-04-07T09:00:00',
    end: '2024-04-07T17:00:00',
    location: 'La Union, Philippines • Hybrid',
    region: 'Region I',
    image: '/events/cheonbo-la-union-2024.jpg',
    button: 'View Report',
  },
  {
    id: 6,
    title: 'Heavenly Asia Pacific HJ CheonBo Special Event',
    date: '2024-07-20T09:00:00',
    end: '2024-07-21T17:00:00',
    location: 'FFWPU Metro Manila Family Church • Hybrid',
    region: 'NCR',
    image: '/events/cheonbo-metro-manila-2024.jpg',
    button: 'Highlights',
  },
  {
    id: 7,
    title: 'Pure Water Workshop — “Live a Life Without Shadow”',
    date: '2024-10-05T09:00:00',
    end: '2024-10-06T17:00:00',
    location: 'Albay Provincial Campsite, Ligao City',
    region: 'Region V',
    image: '/events/pure-water-albay-2024.jpg',
    button: 'Learn More',
  },
  {
    id: 8,
    title: 'HJ CheonBo Special Event (Asia Pacific) – Antipolo',
    date: '2024-12-20T09:00:00',
    end: '2024-12-21T17:00:00',
    location: 'Ynares Center, Antipolo City, Rizal',
    region: 'Region IV-A',
    image: '/events/cheonbo-ynares-2024.jpg',
    button: 'Event Info',
  },

  // 🌙 devotional / vigil (online-friendly)
  {
    id: 9,
    title: 'Cheon Shim Won Night Prayer Vigil (Online & Onsite)',
    date: '2024-11-08T21:00:00',
    end: '2024-11-09T00:00:00',
    location: 'Metro Manila Family Church + Zoom',
    region: 'NCR',
    image: '/events/csw-vigil-2024.jpg',
    button: 'Join via Zoom',
  },

  // 🧑‍🤝‍🧑 rites (with Zoom)
  {
    id: 10,
    title: 'Coming of Age Festival (National)',
    date: '2023-07-04T09:00:00',
    end: '2023-07-04T12:00:00',
    location: 'Philippines • Onsite + Zoom',
    region: 'Online / Nationwide',
    image: '/events/coming-of-age-2023.jpg',
    button: 'See Photos',
  },

  // 💻 Zoom / online (AP region, PH audience welcome)
  {
    id: 11,
    title: 'Online Community Gathering (Asia Pacific) — Zoom',
    date: '2025-07-09T19:30:00',
    end: '2025-07-09T21:00:00',
    location: 'Zoom (Philippines / AP Region)',
    region: 'Online / Nationwide',
    image: '/events/online-community-gathering-2025.jpg',
    button: 'Join on Zoom',
  },

  // 🕯️ annual/global vigil
  {
    id: 12,
    title: 'New Year Cheon Shim Won Special Devotional Prayer Vigil',
    date: '2023-12-30T21:00:00',
    end: '2023-12-31T00:30:00',
    location: 'Local Churches Nationwide + Zoom',
    region: 'Online / Nationwide',
    image: '/events/csw-newyear-vigil-2024.jpg',
    button: 'Join Vigil',
  },
]

function getCountdown(dateStr: string) {
  const eventDate = new Date(dateStr)
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const mins = Math.floor((diff / (1000 * 60)) % 60)
  const secs = Math.floor((diff / 1000) % 60)
  return { days, hours, mins, secs }
}

export default function HomePage() {
  const [recentNews, setRecentNews] = useState<NewsItem[]>([])
  const [recentArticles, setRecentArticles] = useState<NewsItem[]>([])

  useEffect(() => {
    setRecentNews(sampleNews.slice(0, 3))
    setRecentArticles(sampleArticles.slice(0, 3))
  }, [])

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1'>
        <HeroSection />
        <div className='container mx-auto py-12 space-y-16'>
          <AnnouncementBanner />
          <RecentNewsSection sampleNews={sampleNews} />
          <div id='cheon-shim-won' className='scroll-mt-24'>
            <SideBySide
              withSocials
              imgUrl='/csw.webp'
              imgAlt='Cheon Shim Won prayer hall'
              eyebrow='Cheon Shim Won • HJ CheonBo Providence'
              title='Cheon Shim Won: A Holy Place of Devotional Prayer and Renewal'
              highlightedText='Cheon Shim Won'
              highlightedGradientClassName='bg-gradient-to-r from-violet-900 via-purple-800 to-fuchsia-800 bg-clip-text text-transparent'
              sideText='CHEON SHIM WON'
              description='Cheon Shim Won is a dedicated holy space for deep, heartfelt prayer (jeongseong)—specially designed to foster healing, renewal, and clarity. Around the world, communities gather here for night-vigil devotion to seek guidance, offer gratitude, and intercede for others. Cheon Shim Won vigils have become a living tradition within the HJ CheonBo providence, inspiring personal transformation and communal hope.'
              bottomLinks={[
                {
                  label: 'Join the Vigil Prayer',
                  href: '/events/cheon-shim-won-vigil',
                },
                {
                  label: 'What is Cheon Shim Won?',
                  href: '/about/cheon-shim-won',
                },
                {
                  label: 'CheonBo Training Center',
                  href: 'https://en.hjcbt.org/index.php',
                },
              ]}
            />
          </div>

          <SideBySide
            withSocials
            reversed
            imgUrl='/pure-water.webp'
            imgAlt='FFWPU Pure Water youth assembly'
            eyebrow='Pure Water • Heavenly Parent’s Holy Community'
            title='Pure Water: Live a Life Without Shadow'
            highlightedText='Pure Water'
            highlightedGradientClassName='bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 bg-clip-text text-transparent'
            sideText='PURE WATER'
            description='Pure Water is a current providential focus inspired by Holy Mother Dr. Hak Ja Han Moon—calling youth and families to become “pure water”: clear, life-giving, and without shadows. Through Cheon Shim Won devotion, character education, and service, Pure Water seminars and assemblies unite young people across the Philippines and worldwide to pray, learn, and advance Heaven’s mission together.'
            bottomLinks={[
              { label: 'Upcoming Assemblies', href: '/events/pure-water' },
              {
                label: 'PH: Pure Water Workshop',
                href: 'https://familyfedihq.org/2024/10/philippines-pure-water-workshop-pure-love-2-0/',
              },
              {
                label: 'Holy Mother’s Guidance',
                href: 'https://familyfedihq.org/2025/02/the-chosen-blessed-families-attending-holy-mother-han/',
              },
              {
                label: 'Regional Youth Assembly',
                href: 'https://familyfedihq.org/2025/08/kenya-pure-water-youth-assembly/',
              },
            ]}
          />
        </div>
        <UpcomingEventsSection events={upcomingEvents} />
        <div className='container mx-auto py-12 space-y-16'>
          <SideBySide
            withSocials
            imgUrl='/church-visitation.webp' // replace with your photo
            imgAlt='Rev. Ronnie Sodusta visiting an FFWPU Philippines church'
            eyebrow='FFWPU Philippines • Church Visitation'
            title='Church Visitation with Rev. Ronnie Sodusta'
            highlightedText='Rev. Ronnie Sodusta'
            highlightedGradientClassName='bg-gradient-to-r from-amber-900 via-yellow-700 to-amber-500 bg-clip-text text-transparent'
            sideText='VISITATION'
            description='As National Leader and Regional Director for FFWPU Philippines, Rev. Ronnie Sodusta has been making local church visitations to share direction for the Philippine providence, strengthen family-based ministry, and encourage youth engagement and Cheon Shim Won devotion.'
          />
          <QuickLinksSection />
          <TrueParentsSection />
          <ChurchBranchesSection />
        </div>
      </main>
      <NewsletterBanner />
      <Footer />
    </div>
  )
}
