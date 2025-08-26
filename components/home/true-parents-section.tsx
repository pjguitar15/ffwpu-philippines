'use client'

import Link from 'next/link'
import { SideBySide } from '@/components/side-by-side'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { Crown } from 'lucide-react'

export function TrueParentsSection() {
  return (
    <section className='relative overflow-hidden'>
      {/* Royal crest (top center) */}
      <div className='pointer-events-none absolute left-1/2 -translate-x-1/2 top-4 z-40'>
        <div className='relative flex items-center justify-center'>
          <div className='absolute -inset-8 rounded-full bg-amber-300/30 blur-3xl' />
          <Crown className='relative h-7 w-7 md:h-10 md:w-10 text-amber-400 drop-shadow-[0_12px_28px_rgba(251,191,36,0.55)]' />
        </div>
      </div>

      <SideBySide
        withSocials
        imgUrl='/true-parents-portrait.jpg'
        imgAlt='True Parents - Rev. Sun Myung Moon and Hak Ja Han Moon'
        eyebrow='Cheon Il Guk • Heavenly Parent’s Holy Community'
        title='True Parents: Building One Family Under God'
        highlightedText='True Parents'
        highlightedGradientClassName='bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-800 bg-clip-text text-transparent'
        sideText='CHEON IL GUK'
        description='Rev. Sun Myung Moon and Dr. Hak Ja Han Moon—revered as the True Parents—devoted their lives to realizing a world of interdependence, mutual prosperity, and universally shared values. Today, Holy Mother Han continues this providence, guiding families to live for the sake of others and to establish Cheon Il Guk in daily life.'
        bottomLinks={[
          { label: 'Life Course', href: '/about/true-parents' },
          { label: 'Cheon Il Guk Vision', href: '/about/cheoneilguk' },
          { label: 'True Mother’s Messages', href: '/messages/true-mother' },
        ]}
        className='py-16'
      />

      {/* subtle decorative blobs */}
      <div className='pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl' />

      {/* crown watermark (bottom-right) */}
      <Crown className='pointer-events-none absolute right-8 bottom-6 h-24 w-24 text-amber-300/15' />

      {/* details / artistry */}
      <div className='container mx-auto px-4 md:px-6 pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Core themes */}
          <div className='group relative rounded-2xl bg-white/70 dark:bg-slate-900/60 ring-1 ring-black/5 p-6 backdrop-blur'>
            <div className='absolute inset-0 rounded-2xl group-hover:ring-2 group-hover:ring-fuchsia-400/50 transition-all' />
            <h3 className='text-lg font-extrabold tracking-wide uppercase'>
              Core Themes
            </h3>
            <ul className='mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300'>
              {[
                'Hyojeong (filial heart)',
                'Blessing & Family',
                'Cheon Shim Won devotion',
                'Peace & Service',
              ].map((t) => (
                <li
                  key={t}
                  className='rounded-full bg-slate-100/70 dark:bg-slate-800/60 px-3 py-1'
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* True Mother today */}
          <div className='relative overflow-hidden rounded-2xl ring-1 ring-black/5 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/10 to-rose-500/10 p-[1px]'>
            <div className='rounded-2xl bg-white/80 dark:bg-slate-900/70 p-6 backdrop-blur'>
              <h3 className='text-lg font-extrabold tracking-wide uppercase flex items-center gap-2'>
                <Crown className='h-4 w-4 text-amber-500' />
                True Mother Today
              </h3>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>
                Holy Mother Han calls families to be <em>pure water</em>—clear,
                life-giving, and without shadow—through daily jeongseong,
                education, and service that uplift the community and nation.
              </p>
              <div className='mt-4 flex flex-wrap gap-3'>
                <span className='inline-flex items-center rounded-full bg-fuchsia-600/10 px-3 py-1 text-xs font-semibold text-fuchsia-700'>
                  Pure Water
                </span>
                <span className='inline-flex items-center rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-700'>
                  HJ CheonBo
                </span>
                <span className='inline-flex items-center rounded-full bg-rose-600/10 px-3 py-1 text-xs font-semibold text-rose-700'>
                  Peace Initiatives
                </span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className='relative rounded-2xl bg-white/80 dark:bg-slate-900/70 ring-1 ring-black/5 p-6 backdrop-blur'>
            <div className='absolute -left-0 top-0 h-full w-1.5 rounded-bl-2xl rounded-tl-2xl bg-gradient-to-b from-fuchsia-500 to-indigo-500' />
            <p className='text-slate-700 dark:text-slate-200 italic'>
              “Let families become beacons of hope—living for the sake of
              others—so that one global family under God may shine.”{' '}
              <span className='not-italic font-semibold'>
                — True Mother Hak Ja Han Moon
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
