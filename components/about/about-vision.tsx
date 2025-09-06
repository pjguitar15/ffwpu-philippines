import { SectionShell } from '../ui/section-shell'
import { TitleBlock } from '../ui/title-block'

export function AboutVisionSection() {
  return (
    <SectionShell dark>
      <div className='container mx-auto lg:pe-60'>
        <TitleBlock
          dark
          eyebrow='Vision & Strategy • Philippine Providence'
          title='About the Heavenly Philippines'
          highlightedText='Heavenly Philippines'
          gradient='bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent'
          description='FFWPU Philippines strengthens Cheon Shim Won devotion, the Blessing & family ministry, HTM witnessing, youth formation through CARP/IAYSP, and UPF peace work—building vibrant churches across Luzon, Visayas, and Mindanao.'
        />
      </div>
    </SectionShell>
  )
}
