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
          <Link href='/events' className='inline-block'>
            <EpicButton className='bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-700'>
              See Upcoming Events
            </EpicButton>
          </Link>
          <Link
            href='/donate'
            className='inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm md:text-base hover:bg-accent/50'
          >
            <HeartHandshake className='h-4 w-4' /> Donate / Volunteer
          </Link>
        </div>
      </div>
    </SectionShell>
  )
}
