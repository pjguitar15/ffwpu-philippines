import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionNav } from '@/components/about/section-nav'
import { AboutHero } from '@/components/about/hero'
import { AboutIntroSection } from '@/components/about/about-intro-section'
import { AboutStatsStrip } from '@/components/about/about-stats'
import { AboutPeaceRoadSection } from '@/components/about/about-peace-road'
import { AboutCheonShimWonSection } from '@/components/about/about-csw'
import { AboutYouthServiceSection } from '@/components/about/about-youth-service'
import { AboutCheonBoSection } from '@/components/about/about-cheonbo'
import { AboutVisionSection } from '@/components/about/about-vision'
import { AboutCTA } from '@/components/about/about-cta'

export default function AboutPage() {
  const sections = [
    { id: 'vision', label: 'Vision' },
    { id: 'about-intro', label: 'Overview' },
    { id: 'stats', label: 'Highlights' },
    { id: 'peace-road', label: 'Peace Road' },
    { id: 'cheon-shim-won', label: 'Cheon Shim Won' },
    { id: 'youth-service', label: 'Youth & Service' },
    { id: 'cheonbo', label: 'HJ CheonBo' },
    { id: 'get-involved', label: 'Get Involved' },
  ]

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 scroll-smooth'>
        <div>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4'>
            <div className='min-w-0'>
              <div id='vision' className='scroll-mt-24'>
                <AboutVisionSection />
              </div>

              {/* Added sections (wrapped with IDs + offset for sticky header) */}
              <div id='about-intro' className='scroll-mt-24'>
                <AboutIntroSection />
              </div>

              <div id='stats' className='scroll-mt-24'>
                <AboutStatsStrip />
              </div>

              <div id='peace-road' className='scroll-mt-24'>
                <AboutPeaceRoadSection />
              </div>

              <div id='cheon-shim-won' className='scroll-mt-24'>
                <AboutCheonShimWonSection />
              </div>

              <div id='youth-service' className='scroll-mt-24'>
                <AboutYouthServiceSection />
              </div>

              <div id='cheonbo' className='scroll-mt-24'>
                <AboutCheonBoSection />
              </div>

              <div id='get-involved' className='scroll-mt-24'>
                <AboutCTA />
              </div>
            </div>

            <div>
              <SectionNav sections={sections} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
