import Image from "next/image";
import { SectionShell } from "../ui/section-shell";
import { TitleBlock } from "../ui/title-block";
import { Flame, Sparkles, Users2 } from "lucide-react";
import Link from "next/link";

export function AboutCheonShimWonSection() {
  return (
    <SectionShell>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16'>
        <div className='relative'>
          <div className='absolute -inset-6 rounded-3xl bg-gradient-to-tr from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 blur-2xl' />
          <Image
            src='/csw-devotion.jpg'
            alt='Cheon Shim Won vigil prayer'
            width={900}
            height={700}
            className='relative rounded-3xl ring-1 ring-black/10 object-cover w-full h-auto'
          />
        </div>
        <div className='space-y-6'>
          <TitleBlock
            eyebrow='Cheon Shim Won • Devotional Life'
            title='A holy place of prayer for renewal and guidance'
            highlightedText='holy place of prayer'
            gradient='bg-gradient-to-r from-violet-800 via-purple-800 to-fuchsia-800 bg-clip-text text-transparent'
            description='Night-vigil prayer (jeongseong) in Cheon Shim Won nurtures filial hearts and brings clarity to families and leaders seeking to align with Heavenly Parent’s will.'
          />
          <div className='flex flex-wrap gap-3'>
            <span className='inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm'>
              <Flame className='h-4 w-4' /> Vigil devotion
            </span>
            <span className='inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm'>
              <Sparkles className='h-4 w-4' /> Healing & renewal
            </span>
            <span className='inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm'>
              <Users2 className='h-4 w-4' /> Community prayer
            </span>
          </div>
          <div className='pt-2'>
            <Link
              href='/about/cheon-shim-won'
              className='underline underline-offset-4'
            >
              Learn more about Cheon Shim Won
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
