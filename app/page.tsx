"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ClientMetadata } from '@/components/seo/client-metadata'
import { pageMetadataConfigs } from '@/lib/metadata'
import { AnnouncementBanner } from '@/components/announcement-banner'
import { NewsItem, sampleNews } from '../data/news'
import { HeroSection } from '@/components/home/hero-section'
import { RecentNewsSection } from '@/components/home/recent-news-section'
import { UpcomingEventsSection } from '@/components/home/upcoming-events-section'
import { QuickLinksSection } from '@/components/home/quick-links-section'
import { HistorySection } from '@/components/home/history-section'
import { SideBySide } from '@/components/side-by-side'
import AffiliatedOrganizationsLogos from '@/components/home/affiliated-organizations'
import WordOfTheDayModal from '@/components/word-of-the-day/word-of-the-day'
import SectionGlare from '@/components/ui/section-glare'

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
    <>
      <ClientMetadata config={pageMetadataConfigs.home} />
      <div className='min-h-screen flex flex-col'>
        <main className='flex-1'>
          <HeroSection />

          {/* Letters to True Mother - Compact CTA Section */}
          <section className='bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border-y border-rose-100'>
            <div className='container mx-auto px-4 py-6'>
              <div className='flex flex-col lg:flex-row items-center justify-between gap-8 mx-auto'>
                {/* Left side - Image */}
                <div className='flex-shrink-0'>
                  <div className='relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-pink-200 shadow-md'>
                    <Image
                      src='/letter-for-tm.png'
                      alt='True Mother'
                      width={80}
                      height={80}
                      className='object-cover'
                    />
                  </div>
                </div>

                {/* Center - Content */}
                <div className='flex-1 text-center lg:text-left'>
                  <h3 className='text-2xl md:text-3xl font-handwriting font-bold text-gray-800 mb-1'>
                    Share Your Love with{' '}
                    <span className='bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent'>
                      True Mother
                    </span>{' '}
                    💌
                  </h3>
                  <p className='text-sm md:text-base font-handwriting text-gray-600'>
                    Send heartfelt messages of comfort and encouragement
                  </p>
                </div>

                {/* Sample Notes - Design Elements */}
                <div className='hidden lg:flex flex-shrink-0 gap-4'>
                  {/* First Note */}
                  <div className='bg-yellow-100 border-yellow-200 border-2 w-40 h-28 rounded-lg shadow-md relative transform rotate-3 hover:rotate-1 transition-transform duration-200'>
                    {/* Paper tape effect */}
                    <div className='absolute w-8 h-4 bg-white/70 opacity-90 shadow-sm border border-gray-200/50 -top-2 left-6'></div>

                    {/* Note content */}
                    <div className='p-3 h-full flex flex-col justify-between'>
                      <div className='text-center mb-1'>
                        <p className='text-xs font-handwriting text-gray-500 italic'>
                          Dear True Mother,
                        </p>
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs font-handwriting text-gray-700 leading-tight'>
                          "Thank you for your endless love and guidance..."
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs font-handwriting text-gray-600 italic'>
                          With love,
                        </p>
                        <p className='text-xs font-handwriting text-gray-700 font-normal'>
                          💝 Maria
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Second Note - Only on XL screens */}
                  <div className='hidden xl:block bg-pink-100 border-pink-200 border-2 w-40 h-28 rounded-lg shadow-md relative transform -rotate-2 hover:rotate-0 transition-transform duration-200'>
                    {/* Paper tape effect */}
                    <div className='absolute w-8 h-4 bg-white/70 opacity-90 shadow-sm border border-gray-200/50 -top-2 right-6'></div>

                    {/* Note content */}
                    <div className='p-3 h-full flex flex-col justify-between'>
                      <div className='text-center mb-1'>
                        <p className='text-xs font-handwriting text-gray-500 italic'>
                          Dear True Mother,
                        </p>
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs font-handwriting text-gray-700 leading-tight'>
                          "Your wisdom guides us through each day..."
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs font-handwriting text-gray-600 italic'>
                          Gratefully,
                        </p>
                        <p className='text-xs font-handwriting text-gray-700 font-normal'>
                          🌸 Sarah
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - CTA Button */}
                <div className='flex-shrink-0'>
                  <a
                    href='/letter-to-true-mother'
                    className='inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-handwriting px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105'
                  >
                    <span>Write a Letter</span>
                    <span className='group-hover:translate-x-0.5 transition-transform duration-200'>
                      💌
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className='container mx-auto py-12 space-y-16'>
            <AnnouncementBanner />
            {/* Recent news with soft background accent */}
            <section className='relative'>
              <SectionGlare />
              <RecentNewsSection />
            </section>

            {/* Blessing & Matching section with accent */}
            <section className='relative'>
              <SectionGlare />
              <SideBySide
                withSocials
                imgUrl='https://images.squarespace-cdn.com/content/v1/62fa4ede47f10a2311b0f84e/6ba29bab-f2ad-4451-ad7c-b194fafb60fe/6T0A5606-2.jpg'
                imgAlt='FFWPU Philippines Blessing Ceremony'
                eyebrow='Blessing & Matching • FFWPU Philippines'
                title='The Blessing: Sacred Marriage for God’s Ideal Families'
                highlightedText='The Blessing'
                highlightedGradientClassName='bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-700 bg-clip-text text-transparent'
                sideText='MATCHING & BLESSING'
                description={`The Blessing in FFWPU Philippines is the joyous culmination of a guided Matching process. Couples, rooted in God's love and supported by dedicated Matching supporters, enter into a sacred union that restores Divine family ideals. This ceremony unites partners under Heavenly Parent and True Parents, marking the birth of Blessed Central Families, with a mission of faith, harmony, and legacy.`}
                bottomLinks={
                  [
                    // {
                    //   label: 'Learn About Matching Support',
                    //   href: 'https://bfm.familyfed.org/resources',
                    // },
                    // {
                    //   label: 'Blessing Process Guide',
                    //   href: 'https://bfm.familyfed.org/hj-blessing-guide',
                    // },
                  ]
                }
              />
            </section>

            <div id='cheon-shim-won' className='scroll-mt-24 relative'>
              <SectionGlare />
              <SideBySide
                reversed
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
                    label: 'CheonBo Training Center',
                    href: 'https://en.hjcbt.org/index.php',
                  },
                ]}
              />
            </div>
          </div>

          <UpcomingEventsSection />
          <div className='container mx-auto py-12 space-y-16'>
            <section className='relative'>
              <SectionGlare />
              <SideBySide
                withSocials
                imgUrl='https://familyfedihq.org/wp-content/uploads/2023/10/ph-pclc-1-1024x516.jpg'
                imgAlt='PCLC – Pacific Christian Leadership Conference graphic'
                eyebrow='PCLC • FFWPU Philippines'
                title='Strengthening Faith & Families'
                highlightedText='Faith & Families'
                highlightedGradientClassName='bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent'
                sideText='PCLC'
                description={`The Pacific Christian Leadership Conference (PCLC) is a coalition of Christian leaders and organizations across the Asia-Pacific region. Under FFWPU Philippines, PCLC unites clergy and faith communities to strengthen marriages, families, and nation-building through seminars and conferences. Its vision is to restore communities of faith and fulfill Christianity’s destiny as One Family under God.`}
              />
            </section>

            <section className='relative'>
              <SectionGlare />
              <SideBySide
                withSocials
                reversed
                imgUrl='/pure-water.webp'
                imgAlt='FFWPU Pure Water youth assembly'
                eyebrow='Pure Water • Heavenly Parent’s Holy Community'
                title='Become like the pure water the world needs'
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
            </section>
          </div>

          <section>
            <HistorySection />
          </section>

          <div className='container mx-auto py-12 space-y-16'>
            <section className='relative'>
              <SectionGlare />
              <SideBySide
                withSocials
                imgUrl='https://familyfedihq.org/wp-content/uploads/2024/11/ph-4dws-2-1024x768.jpg'
                imgAlt='Heavenly Top Gun missionaries with participants in the Philippines'
                eyebrow='Heavenly Top Gun • Asia Pacific • Philippines'
                title='Heavenly Top Gun: Leaders of Heart & Mission'
                highlightedText='Heavenly Top Gun'
                highlightedGradientClassName='bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent'
                sideText='HEAVENLY TOP GUN'
                description={`Heavenly Top Gun (HTG) trains youth to live God-centered lives of prayer, service, and witness. Launched in Asia Pacific with its opening at the Philippine National HQ, HTG runs intensive workshops, 40-day trainings, and on-the-ground missions that empower young leaders to teach Divine Principle, serve communities, and advance Heaven’s providence.`}
                bottomLinks={[
                  {
                    label: 'AP Opening at PH National HQ',
                    href: 'https://m.facebook.com/100064313636496/posts/april-30-2025-the-heavenly-top-gun-htg-asia-pacific-opening-ceremony-was-held-at/1095029989317445/',
                  },
                  {
                    label: '40-Day AP Completion',
                    href: 'https://www.instagram.com/p/DNUXOLdyP6H/',
                  },
                ]}
              />
            </section>

            <section className='relative'>
              <SectionGlare />
              <SideBySide
                reversed
                withSocials
                imgUrl='https://i.ytimg.com/vi/FmH7xAuPzEg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDnM9dO_16ok4IYjakFzNJbYlL38g' // Thumbnail from "Testimonies from the Philippines!"
                imgAlt='Group of FFWPU members sharing testimonies in the Philippines'
                eyebrow='HJ Testimonies • FFWPU Philippines'
                title='HJ Testimonies: Stories of Faith & Family'
                description={`An episode series from FFWPU Philippines where families, youth, and leaders share real testimonies—parenting lessons, family bonds, mission journeys, and milestone moments like Blessing 2025—offering hope-filled stories that strengthen hearts and homes.`}
                highlightedText='HJ Testimonies'
                highlightedGradientClassName='bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-700 bg-clip-text text-transparent'
                sideText='HJ TESTIMONIES'
                bottomLinks={[
                  {
                    label: 'Watch Testimonies',
                    href: 'https://www.facebook.com/hjtestimonies/',
                  },
                  {
                    label: 'HJ Testimonies YouTube',
                    href: 'https://www.youtube.com/@hjtestimonies25',
                  },
                ]}
              />
            </section>
          </div>
          <AffiliatedOrganizationsLogos />
          <QuickLinksSection />
          {/* ChurchBranchesSection is now rendered globally from the layout */}
        </main>
        {/* NewsletterBanner is now rendered globally from the layout */}
        <WordOfTheDayModal />
      </div>
    </>
  )
}
