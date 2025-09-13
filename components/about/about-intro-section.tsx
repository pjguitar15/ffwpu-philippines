import Link from "next/link";
import { EpicButton } from "../ui/epic-button";
import { HeartHandshake } from "lucide-react";
import { SectionShell } from "../ui/section-shell";
import { Eyebrow } from "../ui/eyebrow";
import { HighlightTitle } from "../ui/highlight-title";

export function AboutIntroSection() {
  const CTA_SIZE =
    'h-11 md:h-12 px-6 md:px-8 min-w-[200px] whitespace-nowrap leading-none'
  return (
    <SectionShell className='overflow-hidden'>
      <div className='max-w-5xl mx-auto text-center space-y-6 relative'>
        <Eyebrow>About • FFWPU Philippines</Eyebrow>
        <HighlightTitle
          as='h1'
          text='Heavenly Parent Centered Mission for the Philippines'
          highlightedText='Heavenly Parent'
          className='text-4xl md:text-6xl'
          uppercase
          gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 bg-clip-text text-transparent'
        />
        <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'>
          We are families united with True Parents’ vision, raising filial
          hearts through Cheon Shim Won devotion, character education, service,
          and the culture of heart.
        </p>
        <div className='flex items-center justify-center gap-3 pt-2'>
          <Link href='#peace-road' className='inline-block'>
            <EpicButton
              className={`bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-700 ${CTA_SIZE}`}
            >
              Explore Highlights
            </EpicButton>
          </Link>

          <Link
            href='/contact'
            className={`inline-flex items-center justify-center gap-2 rounded-full border text-sm md:text-base hover:bg-accent/50 ${CTA_SIZE}`}
          >
            <HeartHandshake className='h-4 w-4' />
            Connect with us
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}
