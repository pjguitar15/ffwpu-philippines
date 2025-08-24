"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { NewsItem, sampleNews } from "../data/news"
import { HeroSection } from "@/components/home/hero-section"
import { RecentNewsSection } from "@/components/home/recent-news-section"
import { UpcomingEventsSection } from "@/components/home/upcoming-events-section"
import { ArticlesGridSection } from "@/components/home/articles/articles-grid-section"
import { QuickLinksSection } from "@/components/home/quick-links-section"
import { TrueParentsSection } from "@/components/home/true-parents-section"
import { NewsletterCtaSection } from "@/components/home/newsletter-cta-section"
import { ChurchBranchesSection } from "@/components/home/church-branches-section"
import { NewsletterBanner } from "@/components/home/newsletter-banner"

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
    content: 'True Love is not just a concept but a living practice that transforms our relationships...',
    comments: [],
    slug: ''
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
    content: "In our fast-paced world, recognizing God's hand in daily events becomes crucial for spiritual growth...",
    comments: [],
    slug: ''
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
    content: 'Our recent interfaith gathering demonstrated the power of respectful dialogue in building understanding...',
    comments: [],
    slug: ''
  },
]

// Event data
const upcomingEvents = [
  {
    id: 1,
    title: 'Together, We Build a Stronger Community',
    date: '2024-12-02T15:00:00',
    end: '2024-12-02T19:00:00',
    location: '85 Preston Rd. Inglewood, Maine 980.',
    image: '/church-community-gathering.png',
    button: 'Contact Us',
  },
  {
    id: 2,
    title: 'Family Worship & Fellowship',
    date: '2024-12-10T10:00:00',
    end: '2024-12-10T12:00:00',
    location: 'FFWPU Manila Center, Quezon City',
    image: '/family-worship.png',
    button: 'Join Event',
  },
  {
    id: 3,
    title: 'Youth Leadership Summit',
    date: '2025-01-15T09:00:00',
    end: '2025-01-15T17:00:00',
    location: 'Cebu City Convention Hall',
    image: '/youth-fellowship.png',
    button: 'Learn More',
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
        {/* Hero Section */}
        <HeroSection />

        <div className='container mx-auto py-12 space-y-16'>
          {/* Announcement Banner */}
          <AnnouncementBanner />

          {/* Recent News Section */}
          <RecentNewsSection sampleNews={sampleNews} />

          {/* Upcoming Events Section */}
          <UpcomingEventsSection events={upcomingEvents} />

          {/* Quick Links Section */}
          <QuickLinksSection />

          {/* Recent Articles Section */}
          <ArticlesGridSection items={recentArticles} />

          {/* True Parents Section */}
          <TrueParentsSection />

          {/* Church Branches Section */}
          <ChurchBranchesSection />
        </div>
      </main>

      {/* Newsletter Signup full-bleed banner */}
      <NewsletterBanner />

      <Footer />
    </div>
  )
}
