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
import { SectionShell } from '@/components/ui/section-shell'

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

export default function HomePage() {
  const [recentNews, setRecentNews] = useState<NewsItem[]>([])
  const [recentArticles, setRecentArticles] = useState<NewsItem[]>([])

  useEffect(() => {
    setRecentNews(sampleNews.slice(0, 3))
    setRecentArticles(sampleArticles.slice(0, 3))
  }, [])

  return (
    <div className='min-h-screen flex flex-col'>
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
                // {
                //   label: 'Join the Vigil Prayer',
                //   href: '/events/cheon-shim-won-vigil',
                // },
                // {
                //   label: 'What is Cheon Shim Won?',
                //   href: '/about/cheon-shim-won',
                // },
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
            bottomLinks={
              [
                // {
                //   label: 'Holy Mother’s Guidance',
                //   href: 'https://familyfedihq.org/2025/02/the-chosen-blessed-families-attending-holy-mother-han/',
                // },
                // {
                //   label: 'Regional Youth Assembly',
                //   href: 'https://familyfedihq.org/2025/08/kenya-pure-water-youth-assembly/',
                // },
              ]
            }
          />
        </div>
        <UpcomingEventsSection />
        <div className='container mx-auto py-12 space-y-16'>
          {/* IAYSP Pilipinas */}
          <SideBySide
            withSocials
            imgUrl='https://familyfedihq.org/wp-content/uploads/2022/03/iaysp-1-1024x683.jpg'
            imgAlt='IAYSP Pilipinas youth activity'
            eyebrow='IAYSP Pilipinas • Youth & Students for Peace'
            title='Empowering Youth for Peace and Character'
            highlightedText='Youth for Peace'
            highlightedGradientClassName='bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-700 bg-clip-text text-transparent'
            sideText='IAYSP Philippines'
            description='IAYSP Pilipinas (International Association of Youth and Students for Peace) empowers Filipino youth through character education, leadership programs, and peace/service projects—cultivating global citizenship and a culture of peace in campuses and communities.'
            bottomLinks={[
              {
                label: 'Follow IAYSP Pilipinas on Facebook',
                href: 'https://www.facebook.com/iaysppilipinas/',
              },
            ]}
          />

          {/* W-CARP Philippines */}
          <SideBySide
            withSocials
            imgUrl='https://scontent.fpnh11-1.fna.fbcdn.net/v/t39.30808-6/503683692_1077241481127786_5573928803462332427_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeENNhOLyWEY7Pa2M7DpoL1jhLuYXqMYkOmEu5heoxiQ6Syhbsqhh_E4gLsT92Np0j2vrhRyXdvLdREdaLERgRNt&_nc_ohc=h8ONxUKxRPIQ7kNvwExtzme&_nc_oc=Adn1aC2mieiplnUdeYt093So3MQdMLlI2_LZT-T1jR91Ak1a5htqQvXZycp7OTsHxP0&_nc_zt=23&_nc_ht=scontent.fpnh11-1.fna&_nc_gid=VEkrqnF_Wr-_P48CpW6pMg&oh=00_AfWqjxovvTv--28uYhHeJmSQ6LKkeHeaCsXhH5nE0iGRww&oe=68B3E4F2'
            imgAlt='W-CARP Philippines campus service project'
            eyebrow='W-CARP Philippines • Campus Leadership'
            title='Raising Principled Campus Leaders'
            highlightedText='Campus Leaders'
            highlightedGradientClassName='bg-gradient-to-r from-blue-900 via-indigo-800 to-cyan-700 bg-clip-text text-transparent'
            sideText='W-CARP Philippines'
            description='World CARP is an international campus-based organization that raises young leaders of character who live for the greater good; in the Philippines, chapters host leadership training, service outreach, and values-based activities with students.'
            reversed
            bottomLinks={[
              {
                label: 'Join W-CARP Philippines on Facebook',
                href: 'https://www.facebook.com/wcarpph/',
              },
            ]}
          />

          {/* Universal Peace Federation (UPF) Philippines */}
          <SideBySide
            withSocials
            imgUrl='https://scontent.fpnh11-1.fna.fbcdn.net/v/t39.30808-6/481038312_679169144444225_8623738338219458726_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHZ20OVg08kRrytqmCgx-3jvuCl7H-t2o6-4KXsf63ajqDbws5RB7j1thrN_33sj0HR7NGoEWOvcBttN3pKGBZK&_nc_ohc=gFNK8nTa61cQ7kNvwGQvApk&_nc_oc=Adn8AqL7vbe7NZw1_ivYquTWNdQ3ju-wqsVToAU9Gz7wLynsyB9n2qwGyk7G24dV_P8&_nc_zt=23&_nc_ht=scontent.fpnh11-1.fna&_nc_gid=0mJDKODYML1rGP6-2zbbTg&oh=00_AfW5M8YH_XR4P6RlAk__OPQtACYQj96-YsuaMnhenzn7xQ&oe=68B3EFDB'
            imgAlt='UPF Philippines meeting in Manila'
            eyebrow='Universal Peace Federation • Philippines'
            title='Interfaith & Peacebuilding Network'
            highlightedText='Peacebuilding Network'
            highlightedGradientClassName='bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-800 bg-clip-text text-transparent'
            sideText='UPF Philippines'
            description='UPF is a global NGO with General Consultative Status at the UN ECOSOC that advances interfaith peacebuilding, peace education, and strong families; UPF-Philippines convenes Ambassadors for Peace and partners for initiatives in Manila and nationwide.'
            bottomLinks={[
              {
                label: 'Visit UPF Philippines on Facebook',
                href: 'https://www.facebook.com/upfphilippines/',
              },
            ]}
          />
        </div>
        <QuickLinksSection />
        <div className='container mx-auto space-y-16'>
          <TrueParentsSection />
          <ChurchBranchesSection />
        </div>
      </main>
      <NewsletterBanner />
    </div>
  )
}
