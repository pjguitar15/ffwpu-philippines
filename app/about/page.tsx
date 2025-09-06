import { AboutIntroSection } from '@/components/about/about-intro-section'
import { AboutStatsStrip } from '@/components/about/about-stats'
import { AboutPeaceRoadSection } from '@/components/about/about-peace-road'
import { AboutCheonShimWonSection } from '@/components/about/about-csw'
import { AboutCheonBoSection } from '@/components/about/about-cheonbo'
import { AboutVisionSection } from '@/components/about/about-vision'
import { AboutCTA } from '@/components/about/about-cta'
import ChurchLeadershipGrid from '@/components/about/church-leadership-grid'
import { AboutWorldCarpSection } from '@/components/about/about-carp'
import { FadeIn } from '@/components/ui/motion'

export default function AboutPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1 scroll-smooth'>
        <div>
          <div className='min-w-0'>
            <FadeIn>
              <AboutVisionSection />
            </FadeIn>
            <ChurchLeadershipGrid />
            <FadeIn delay={0.1}>
              <AboutIntroSection />
            </FadeIn>
            <FadeIn delay={0.14}>
              <AboutPeaceRoadSection />
            </FadeIn>
            <FadeIn delay={0.16}>
              <AboutCheonShimWonSection />
            </FadeIn>
            <FadeIn delay={0.18}>
              <AboutCheonBoSection />
            </FadeIn>
            <FadeIn delay={0.2}>
              <AboutWorldCarpSection />
            </FadeIn>
            <FadeIn delay={0.22}>
              <AboutCTA />
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  )
}
