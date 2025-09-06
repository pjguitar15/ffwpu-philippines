import { Building2 } from "lucide-react";
import { SectionShell } from "../ui/section-shell";
import { TitleBlock } from "../ui/title-block";

export function AboutVisionSection() {
  return (
    <SectionShell dark>
      <div className='max-w-5xl mx-auto'>
        <TitleBlock
          dark
          eyebrow='Vision & Strategy • Philippine Providence'
          title='Growing vibrant family churches across the nation'
          highlightedText='family churches'
          gradient='bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent'
          description='Leaders focus on church growth and member care—raising committed communities in key cities, training leaders, and expanding outreach.'
        />
      </div>
    </SectionShell>
  )
}
