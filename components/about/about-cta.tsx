import Link from "next/link";
import { Eyebrow } from "../ui/eyebrow";
import { HighlightTitle } from "../ui/highlight-title";
import { SectionShell } from "../ui/section-shell";
import { EpicButton } from "../ui/epic-button";
import { HeartHandshake } from "lucide-react";

export function AboutCTA() {
  return (
    <SectionShell className='overflow-hidden'>
      <div className='max-w-4xl mx-auto text-center space-y-4'>
        <Eyebrow>Get Involved</Eyebrow>
        <HighlightTitle
          as='h3'
          text='Walk the path of love and service with us'
          highlightedText='love and service'
          className='text-3xl md:text-5xl'
          uppercase
          gradientClassName='bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 bg-clip-text text-transparent'
        />
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Join a local vigil, volunteer in youth programs, or support Peace
          Road. Your heart and hands can bless many families.
        </p>
        <div className='pt-2 flex justify-center gap-3'>
          <Link href='/contact' className='inline-block'>
            <EpicButton>Join Us Now</EpicButton>
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}
