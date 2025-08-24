"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AboutHeroProps {
  id?: string
}

export function AboutHero({ id }: AboutHeroProps) {
  return (
    <section
      id={id}
      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-white"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/church-community-gathering.png"
          alt="FFWPU Philippines community gathering"
          className="w-full h-[320px] md:h-[440px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
              About FFWPU Philippines
            </h1>
            <p className="mt-3 text-white/90 max-w-2xl mx-auto text-base md:text-lg">
              Use your gifts to build God’s family. Join a team and make a difference in our community.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="cursor-pointer">
                <Link href="/contact">Join a Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
