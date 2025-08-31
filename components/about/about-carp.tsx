import Image from 'next/image'
import { SectionShell } from '../ui/section-shell'
import { TitleBlock } from '../ui/title-block'
import { GraduationCap, Users2, Sparkles, HandHeart } from 'lucide-react'
import Link from 'next/link'

export function AboutWorldCarpSection() {
  return (
    <SectionShell>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16'>
        {/* Image column (now left on desktop) */}
        <div className='order-1 md:order-1 relative'>
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-cyan-500/15 blur-2xl' />
          <Image
            src='/section-images/wcarp.webp'
            alt='W-CARP Philippines campus service project'
            width={900}
            height={700}
            className='relative rounded-3xl ring-1 ring-black/10 object-cover w-full h-auto'
          />
        </div>

        {/* Text column (now right on desktop) */}
        <div className='order-2 md:order-2 space-y-6'>
          <TitleBlock
            eyebrow='W-CARP Philippines • Campus Leadership'
            title='Raising principled campus leaders'
            highlightedText='principled campus leaders'
            gradient='bg-gradient-to-r from-blue-900 via-indigo-800 to-cyan-700 bg-clip-text text-transparent'
            description='World CARP is an international campus movement that raises young leaders of character who live for the greater good. In the Philippines, chapters host leadership training, service outreach, and values-based activities with students.'
          />

          <div className='flex flex-wrap gap-3'>
            <span className='inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm'>
              <GraduationCap className='h-4 w-4' /> Leadership training
            </span>
            <span className='inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm'>
              <Users2 className='h-4 w-4' /> Campus chapters
            </span>
            <span className='inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm'>
              <HandHeart className='h-4 w-4' /> Service outreach
            </span>
            <span className='inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm'>
              <Sparkles className='h-4 w-4' /> Values formation
            </span>
          </div>

          <div className='pt-2'>
            <Link
              href='https://www.facebook.com/wcarpph/'
              target='_blank'
              className='underline underline-offset-4'
            >
              Join W-CARP Philippines on Facebook
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
