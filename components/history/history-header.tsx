import { Eyebrow } from '../ui/eyebrow'
import { HighlightTitle } from '../ui/highlight-title'
import { SectionShell } from '../ui/section-shell'

export function HistoryHeader() {
  return (
    <SectionShell smallPy dark className='overflow-hidden'>
      <div className='max-w-4xl mx-auto text-center space-y-4'>
        <Eyebrow>TIMELINE</Eyebrow>
        <HighlightTitle
          dark
          as='h3'
          text='OUR HISTORY'
          highlightedText='HISTORY'
          className='text-3xl md:text-5xl'
          uppercase
          gradientClassName='bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent'
        />
        <p className='text-gray-300 max-w-2xl mx-auto'>
          The journey of FFWPU Philippines began with the vision of True Parents
          to establish God's kingdom on earth, with the Philippines as a key
          nation in Asia.
        </p>
      </div>
    </SectionShell>
  )
}
