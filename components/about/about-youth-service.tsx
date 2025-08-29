import { Building2, Users2 } from "lucide-react";
import { SectionShell } from "../ui/section-shell";
import { TitleBlock } from "../ui/title-block";
import Link from "next/link";
import Image from "next/image";

export function AboutYouthServiceSection() {
  return (
    <SectionShell dark>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16'>
        <div className='order-2 md:order-1 space-y-6'>
          <TitleBlock
            dark
            eyebrow='IAYSP & FFWPU Youth • Service'
            title='Raising leaders of character through education and outreach'
            highlightedText='leaders of character'
            gradient='bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent'
            description='From campus programs to barangay partnerships, our youth bring character education and service to local communities—shaping future peacemakers.'
          />
          <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {[
              {
                icon: <Users2 className='h-5 w-5' />,
                label: 'Youth-led community classes',
              },
              {
                icon: <Building2 className='h-5 w-5' />,
                label: 'Partnerships with local councils',
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
              href='https://www.facebook.com/iaysppilipinas/'
              target='_blank'
              className='underline underline-offset-4 opacity-90 hover:opacity-100'
            >
              IAYSP Philippines
            </Link>
          </div>
        </div>
        <div className='order-1 md:order-2 relative'>
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-cyan-500/20 blur-2xl' />
          <Image
            src='/ysp.jpg'
            alt='Youth service and character education in the community'
            width={900}
            height={700}
            className='relative rounded-3xl ring-1 ring-white/10 object-cover w-full h-auto'
          />
        </div>
      </div>
    </SectionShell>
  )
}
