import { Building2 } from "lucide-react";
import { SectionShell } from "../ui/section-shell";
import { TitleBlock } from "../ui/title-block";

export function AboutVisionSection() {
  return (
    <SectionShell dark>
      <div className='max-w-5xl mx-auto grid grid-cols-1 gap-8'>
        <TitleBlock
          dark
          eyebrow='Vision & Strategy • Philippine Providence'
          title='Growing vibrant family churches across the nation'
          highlightedText='family churches'
          gradient='bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent'
          description='Leaders focus on church growth and member care—raising committed communities in key cities, training leaders, and expanding outreach.'
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
          {[
            { city: 'Metro Manila', note: 'Urban ministry hub' },
            { city: 'Antipolo', note: 'East Metro gateway' },
            { city: 'Cauayan', note: 'Northern Luzon growth' },
            { city: 'Legazpi', note: 'Bicol expansion' },
            { city: 'Cebu', note: 'Visayas center' },
          ].map((x) => (
            <div
              key={x.city}
              className='rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-5'
            >
              <div className='flex items-center gap-2 text-sm opacity-80'>
                <Building2 className='h-4 w-4' /> City Focus
              </div>
              <p className='mt-2 font-semibold'>{x.city}</p>
              <p className='text-sm opacity-80'>{x.note}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
