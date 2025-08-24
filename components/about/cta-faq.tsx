"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CtaFaqProps {
  id?: string
}

export function CtaFaq({ id }: CtaFaqProps) {
  return (
    <section id={id} className='py-16 bg-muted/20 px-12'>
      <div className='container mx-auto px-4'>
        <div className='text-center'>
          <h2 className='text-3xl md:text-4xl font-bold'>
            See what God can do through you.
          </h2>
          <p className='mt-3 text-muted-foreground max-w-2xl mx-auto'>
            Learn more about volunteering at your local center or online.
          </p>
          <div className='mt-6'>
            <Button asChild size='lg' className='cursor-pointer'>
              <Link href='/contact'>Register for Orientation</Link>
            </Button>
          </div>
        </div>

        {/* Quick FAQ starter */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[
            {
              q: 'What volunteer opportunities are available?',
              a: 'We have teams for greeting, production, children & youth, online ministry, outreach, and admin support.',
            },
            {
              q: 'How do I get started?',
              a: 'Register for our orientation and we’ll walk you through next steps and help you find your best fit.',
            },
            {
              q: 'Can I volunteer if I attend online?',
              a: 'Yes! Our online team serves families and guests across the Philippines and worldwide.',
            },
            {
              q: 'Do I need prior experience?',
              a: 'No experience required. Training is provided and we’ll equip you to serve with confidence.',
            },
          ].map((f) => (
            <div key={f.q} className='p-5 bg-white rounded-lg border shadow-sm'>
              <h4 className='font-semibold'>{f.q}</h4>
              <p className='mt-1 text-sm text-muted-foreground'>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
