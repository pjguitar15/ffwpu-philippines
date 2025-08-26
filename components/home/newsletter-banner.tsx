"use client"

import { NewsletterSignup } from "@/components/newsletter-signup"

export function NewsletterBanner() {
  return (
    <section className="newsletter-signup-gradient py-12 px-4 md:px-0 full-bleed">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl">
        <div className="flex-1 min-w-[260px]">
          <div className="mb-6">
            <span className="inline-block bg-blue-900/80 text-white text-xs font-semibold rounded px-3 py-1 mb-3">
              Our newsletters
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2 text-left">Join Our Spiritual Family</h2>
            <p className="text-blue-100 mb-6 text-left">
              Receive weekly inspiration, community updates, and spiritual guidance directly to your inbox
            </p>
          </div>
          <NewsletterSignup className="newsletter-signup-form" />
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="6" r="6" fill="white" />
                </svg>
              </span>
              <span className="text-white text-sm">Weekly updates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-white bg-transparent"></span>
              <span className="text-white text-sm">Monthly updates</span>
            </div>
          </div>
        </div>
        <div className="flex-1 md:flex justify-center hidden md:justify-end mt-8 md:mt-0">
            <img src="/white-ffwpu.png" alt="FFWPU Philippines Church Logo" className="max-w-[200px] w-full h-auto" />
        </div>
      </div>
    </section>
  )
}
