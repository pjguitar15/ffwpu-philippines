'use client'

import { useState, useEffect } from 'react'
import { EpicButton } from '@/components/ui/epic-button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { ArrowRight, Clock, Users, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// All historical images from the timeline data
const allHistoryImages = [
  { src: '/history-images/first-missionaries.png', alt: 'First missionaries Gary Brown, Jiro Hirano, and Ulrich Voelkel arriving in the Philippines', caption: 'First Missionaries Arrive', era: '1975' },
  { src: '/history-images/church-established.png', alt: 'Official establishment of the Unification Church in the Philippines', caption: 'Official Establishment', era: '1976' },
  { src: '/history-images/bacolod-rally.png', alt: 'Rally in Bacolod City central park proclaiming God\'s Kingdom through True Parents', caption: 'Bacolod Rally', era: '1979' },
  { src: '/history-images/cebu-church-center.png', alt: 'Permanent Unification Church center purchased in Cebu City', caption: 'Cebu Church Center', era: '1980' },
  { src: '/history-images/1981-7day-workshop.png', alt: 'First 7-day workshop in the Philippines laying foundation for national training', caption: 'First 7-Day Workshop', era: '1981' },
  { src: '/history-images/1981-21day-workshop.png', alt: 'First national 21-day training workshop held in Cebu raising Filipino leaders', caption: 'First 21-Day Workshop', era: '1981' },
  { src: '/history-images/1982-davao-workshop.png', alt: 'First 2-day workshop in Mindanao expanding outreach to the south', caption: 'First Davao Workshop', era: '1982' },
  { src: '/history-images/1979-1989-tongil-moodo.png', alt: 'Early Tong-Il Moo-Do practitioners and Master Kensaku Takahashi training', caption: 'Tong-Il Moo-Do Training', era: '1979-1989' },
  { src: '/history-images/1983-qc-hq.png', alt: 'Philippine National Headquarters in Diliman, Quezon City acquired with prize money from True Parents', caption: 'National HQ Established', era: '1983' },
  { src: '/history-images/1984-antipolo-properties.png', alt: 'Properties in Antipolo acquired and developed into Asian Leadership Peace Academy', caption: 'Antipolo Properties', era: '1984' },
  { src: '/history-images/1988-6500blessing.png', alt: '6,500 Couples Blessing with 15 Filipino participants matched internationally', caption: '6,500 Couples Blessing', era: '1988' },
  { src: '/history-images/1989-1275blessing.png', alt: '1,275 Couples Blessing with 64 Filipino members blessed by True Parents', caption: '1,275 Couples Blessing', era: '1989' },
  { src: '/history-images/1989-21day-leadership.png', alt: 'Second 21-day leadership training with Rev. Yoshinobu Murotani', caption: '2nd Leadership Training', era: '1989' },
  { src: '/history-images/1992-wfwp-launch.png', alt: 'True Mother visiting the Philippines to launch Women\'s Federation for World Peace', caption: 'True Mother\'s First Visit', era: '1992' },
  { src: '/history-images/1992-30000blessing.png', alt: '30,000 Couples Blessing with Filipino international couples participation', caption: '30,000 Couples Blessing', era: '1992' },
  { src: '/history-images/1994-assembly-world-peace.png', alt: 'Philippine Assembly for World Peace at Westin Philippine Plaza Hotel', caption: 'Assembly for World Peace', era: '1994' },
  { src: '/history-images/1995-worldtour-manila.png', alt: 'True Parents World Tour at Philippine International Convention Center in Manila', caption: 'True Parents World Tour', era: '1995' },
  { src: '/history-images/1996-1998-picc-blessing-victory.png', alt: 'PICC Blessing ceremony and religious freedom victory celebration', caption: 'PICC Blessing Victory', era: '1996-1998' },
  { src: '/history-images/1999-true-mother-visit.png', alt: 'True Mother speaking in Manila during her 80-city world peace tour', caption: 'True Mother World Tour', era: '1999' },
  { src: '/history-images/1999-rys-philippines.png', alt: 'Religious Youth Service project with Southeast Asian volunteers', caption: 'Religious Youth Service', era: '1999' },
  { src: '/history-images/2001-timd-calligraphy.png', alt: 'True Father bestowing Tong-Il Moo-Do calligraphy and symbol', caption: 'Tong-Il Moo-Do Calligraphy', era: '2001' },
  { src: '/history-images/2002-shia-founded.png', alt: 'Sun Hwa International Academy Foundation established in Antipolo City', caption: 'Sun Hwa Academy Founded', era: '2002' },
  { src: '/history-images/2005-upf-inaugural.png', alt: 'Universal Peace Federation inaugural convocation at Manila Hotel with 5,000 participants', caption: 'UPF Launch in Manila', era: '2005' },
  { src: '/history-images/2005-12-01-upf.png', alt: 'Hoon Dok Hae and victory celebration with True Parents at Manila Hotel', caption: 'Victory Celebration', era: '2005' },
  { src: '/history-images/2005-11-07-ancestral-liberation.png', alt: 'Ancestral liberation workshop in Tanay, Rizal', caption: 'Ancestral Liberation', era: '2005' },
  { src: '/history-images/2006-true-mother-peace-tour.png', alt: 'True Mother visiting Manila during world peace tour', caption: 'True Mother Peace Tour', era: '2006' },
  { src: '/history-images/2006-araneta-assembly.png', alt: 'Large collegiate and university student assembly at Araneta Coliseum', caption: 'Araneta Student Assembly', era: '2006' },
  { src: '/history-images/2006-05-29-hdh.png', alt: '4,000 members and guests gathered for Hoon Dok Hae with True Mother', caption: 'Hoon Dok Hae Gathering', era: '2006' },
  { src: '/history-images/2006-09-25-wpt3.png', alt: 'World Peace Tour III in Manila with three generations participation', caption: 'World Peace Tour III', era: '2006' },
  { src: '/history-images/2007-02-10-bfwp.png', alt: 'Barangay Federation for World Peace launched mobilizing grassroots leadership', caption: 'Barangay Federation Launch', era: '2007' },
  { src: '/history-images/2009-upf-qc.png', alt: 'First Universal Peace Federation chapter launched in Quezon City', caption: 'First UPF Chapter', era: '2009' },
  { src: '/history-images/2010-memorial-festival.png', alt: 'Memorial Festival Honoring a Legacy of Peace at AFCOC Camp Aguinaldo', caption: 'Memorial Festival', era: '2010' },
  { src: '/history-images/2010-hj-visit.png', alt: '4,000 members gathered at Philippine HQ for international leaders visit', caption: 'International Leaders Visit', era: '2010' },
  { src: '/history-images/2010-01-17-visit.png', alt: 'Visit of Rev. Peter Kim and welcome gatherings at headquarters', caption: 'Rev. Peter Kim Visit', era: '2010' },
  { src: '/history-images/2010-little-angels.png', alt: 'Little Angels of Korea performing at Cultural Center of the Philippines', caption: 'Little Angels Performance', era: '2010' },
  { src: '/history-images/2010-little-angels-visit.png', alt: 'Little Angels courtesy call at Malacañang with President Aquino III', caption: 'Malacañang Courtesy Call', era: '2010' },
  { src: '/history-images/2011-03-13-iplc-groundbreaking.png', alt: 'International Peace Leadership College groundbreaking ceremony in Tanay, Rizal', caption: 'IPLC Groundbreaking', era: '2011' },
  { src: '/history-images/2011-01-life-course-seminar.png', alt: 'True Parents Life Course seminar at National HQ with Rev. Jin Hun Yong', caption: 'Life Course Seminar', era: '2011' },
  { src: '/history-images/2011-07-life-course-seminar.png', alt: 'Two-day seminar at National HQ with Rev. Jin Hun Yong and Tim Elder', caption: 'July Life Course Seminar', era: '2011' },
  { src: '/history-images/2011-120day-education.png', alt: '120-day special education workshops for Asian leaders series', caption: '120-Day Education', era: '2011-2012' },
  { src: '/history-images/2011-04-10-hdh-100.png', alt: 'Hoon Dok Hae revolution emphasis to read Divine Principle 100 times', caption: 'Hoon Dok Hae Revolution', era: '2011' },
  { src: '/history-images/2011-07-01-basuil-seonghwa.png', alt: 'Seonghwa ceremony of Rev. Rolando C. Basuil Jr., National Leader', caption: 'Rev. Basuil Seonghwa', era: '2011' },
  { src: '/history-images/2012-seonghwa-memorial.png', alt: 'True Father Seonghwa memorial ceremony and gathering', caption: 'True Father Memorial', era: '2012' },
  { src: '/history-images/2012-03-30-ilc-davao.png', alt: 'Interfaith Leadership Conference in Davao City', caption: 'ILC Davao Conference', era: '2012' },
  { src: '/history-images/2012-07-21-ipbf-dumaguete.png', alt: 'Interfaith Peace Blessing Festival in Dumaguete', caption: 'IPBF Dumaguete', era: '2012' },
  { src: '/history-images/2012-08-04-ipbf-higaonon.png', alt: 'Interfaith Peace Blessing Festival with Higaonon tribe', caption: 'IPBF Higaonon', era: '2012' },
  { src: '/history-images/2012-10-13-ipbf-cebu.png', alt: 'Interfaith Peace Blessing Festival in Cebu', caption: 'IPBF Cebu', era: '2012' },
  { src: '/history-images/2013-cjg-inauguration.png', alt: 'Cheon Jeong Gung inauguration ceremony', caption: 'Cheon Jeong Gung', era: '2013' },
  { src: '/history-images/2013-iplc-inauguration.png', alt: 'International Peace Leadership College inauguration', caption: 'IPLC Inauguration', era: '2013' },
  { src: '/history-images/2018-peace-road.png', alt: 'Peace Road cycling event promoting peace and unity', caption: 'Peace Road Event', era: '2018' }
]

// Function to shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function HistorySection() {
  const [historyImages] = useState(() => shuffleArray(allHistoryImages))
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % historyImages.length
      )
    }, 3000) // Change every 3 seconds for better viewing experience

    return () => clearInterval(interval)
  }, [])

  return (
    <section className='relative overflow-hidden bg-slate-950 text-slate-100 py-24'>
      {/* Background gradient overlay */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background:
            'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.10), transparent 60%)',
        }}
      />
      
      <div className='container mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Content Side */}
          <div className='space-y-6'>
            <div className='space-y-4'>
              <Eyebrow className='text-cyan-300'>
                TIMELINE • OUR JOURNEY
              </Eyebrow>
              <HighlightTitle
                dark
                as='h2'
                text='Discover Our Rich History'
                highlightedText='Our Rich History'
                className='text-3xl md:text-5xl'
                gradientClassName='bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent'
              />
              <p className='text-gray-300 text-lg leading-relaxed max-w-xl'>
                The journey of FFWPU Philippines began with the vision of True Parents
                to establish God's kingdom on earth. Explore our transformative timeline
                from the early missions to becoming a key nation in Asia.
              </p>
            </div>

            {/* Feature highlights */}
            <div className='grid gap-4 md:grid-cols-3 pt-4'>
              <div className='flex items-center gap-3 text-sm'>
                <div className='p-2 rounded-lg bg-blue-500/10 border border-blue-500/20'>
                  <Clock className='w-4 h-4 text-blue-400' />
                </div>
                <span className='text-gray-300'>50+ Years of History</span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <div className='p-2 rounded-lg bg-purple-500/10 border border-purple-500/20'>
                  <Users className='w-4 h-4 text-purple-400' />
                </div>
                <span className='text-gray-300'>National Leaders</span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <div className='p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20'>
                  <MapPin className='w-4 h-4 text-indigo-400' />
                </div>
                <span className='text-gray-300'>Key Milestones</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className='pt-4'>
              <Link href='/about/history' className='inline-block'>
                <EpicButton className='bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 ring-1 ring-white/10 shadow-[0_8px_30px_rgba(34,211,238,0.35)] !px-6 !py-2.5 !text-sm'>
                  <span className='inline-flex items-center gap-2'>
                    Explore Our Timeline
                    <ArrowRight className='h-3.5 w-3.5' />
                  </span>
                </EpicButton>
              </Link>
            </div>
          </div>

          {/* Image Side - Carousel */}
          <div className='relative'>
            {/* Main image container */}
            <div className='relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl'>
              {/* Image carousel with fade transitions */}
              {historyImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 50vw'
                    priority={index === 0} // Priority load for first image
                  />
                </div>
              ))}
              
              {/* Overlay gradient */}
              <div className='absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent' />
              
              {/* Dynamic timeline badge overlay */}
              <div className='absolute bottom-4 left-4 right-4'>
                <div className='bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50'>
                  <p className='text-cyan-300 text-sm font-semibold'>
                    {historyImages[currentImageIndex].era}
                  </p>
                  <p className='text-white text-lg font-bold'>
                    {historyImages[currentImageIndex].caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-xl' />
            <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-xl' />
          </div>
        </div>
      </div>
    </section>
  )
}