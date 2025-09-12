import Image from 'next/image'
import { SectionShell } from '../ui/section-shell'
import { TitleBlock } from '../ui/title-block'
import { Globe2, HeartHandshake } from 'lucide-react'
import Link from 'next/link'

export function AboutCheonBoSection() {
  return (
    <SectionShell dark>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16'>
        {/* Text column (CheonBo content) */}
        <div className='order-2 md:order-1 space-y-6'>
          <TitleBlock
            dark
            eyebrow='HJ CheonBo • HyoJeong Culture'
            title='Family restoration and ancestor liberation'
            highlightedText='Family restoration'
            // lighter gradient so it reads well on dark
            gradient='bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent'
            description='Through HJ CheonBo grace, families experience healing and new beginnings—strengthening lineage and love across generations.'
          />

          {/* Badges (dark-styled) */}
          <div className='flex flex-wrap gap-3'>
            <span className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90'>
              <HeartHandshake className='h-4 w-4' /> Blessing culture
            </span>
            <span className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90'>
              <Globe2 className='h-4 w-4' /> National gatherings
            </span>
          </div>
        </div>

        {/* Image column */}
        <div className='order-1 md:order-2 relative'>
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-orange-500/10 to-amber-500/20 blur-2xl' />
          <Image
            src='https://en.hjcbt.org/data/file/EN/ceremony/2886740466_qeLIVvaT_3dba8160f9cc68c1efa049c1db6c06d59ecc54f0.jpg'
            alt='HJ CheonBo Philippines event'
            width={900}
            height={700}
            className='relative rounded-3xl ring-1 ring-white/10 object-cover w-full h-auto'
          />
        </div>
      </div>
    </SectionShell>
  )
}
