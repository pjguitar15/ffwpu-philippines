import { CalendarDays, Route } from "lucide-react";
import { SectionShell } from "../ui/section-shell";
import { TitleBlock } from "../ui/title-block";
import Link from "next/link";
import Image from "next/image";

export function AboutPeaceRoadSection() {
  return (
    <SectionShell dark className='overflow-hidden'>
      <div
        id='peace-road'
        className='grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16'
      >
        <div className='order-2 md:order-1 space-y-6'>
          <TitleBlock
            dark
            eyebrow='Peace Road • Culture of Peace'
            title='Building a World Highway of Peace across the archipelago'
            highlightedText='Highway of Peace'
            gradient='bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent'
            description='Peace Road Philippines unites cyclists, runners, and families to celebrate interdependence, mutual prosperity, and universal values—linking communities from Manila to the regions through public rallies, rides, and service.'
          />
          <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {[
              {
                icon: <Route className='h-5 w-5' />,
                label: '4,000+ participants joined in Manila (2015)',
              },
              {
                icon: <CalendarDays className='h-5 w-5' />,
                label: 'Annual rallies held in succeeding years',
              },
            ].map((i, idx) => (
              <li
                key={idx}
                className='flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3'
              >
                <div className='mt-0.5'>{i.icon}</div>
                <span className='opacity-90'>{i.label}</span>
              </li>
            ))}
          </ul>
          <div className='pt-2 flex gap-3'>
            <Link
              href='https://familyfedihq.org/2017/08/philippines-peace-road-2017/'
              target='_blank'
              className='underline underline-offset-4 opacity-90 hover:opacity-100'
            >
              See Peace Road stories
            </Link>
          </div>
        </div>

        <div className='order-1 md:order-2 relative'>
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 blur-2xl' />
          <Image
            src='https://familyfedihq.org/wp-content/uploads/2017/08/phi-pr-20.jpg'
            alt='Peace Road rally in the Philippines'
            width={900}
            height={700}
            className='relative rounded-3xl ring-1 ring-white/10 object-cover w-full h-auto'
          />
        </div>
      </div>
    </SectionShell>
  )
}
