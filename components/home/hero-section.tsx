"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MovingImages } from "@/components/moving-images"

export function HeroSection() {
  return (
    <section className="relative bg-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="text-primary font-semibold tracking-wide uppercase text-sm">FFWPU Philippines</p>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              LEARNING TO FOLLOW
              <br />
              <span className="whitespace-nowrap">
                TRUE PARENTS{" "}
                <span className="text-transparent bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#3b82f6] bg-clip-text">
                  TOGETHER
                </span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mt-6">
              FFWPU Philippines is a spiritual family that prays for one another, learns from True Parents' teachings,
              worships God, and lives life in community.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#3b82f6] hover:from-[#334155] hover:to-[#2563eb] text-white px-8 py-6 rounded-full font-bold uppercase text-lg cursor-pointer border-0 shadow-lg"
              >
                JOIN US
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <MovingImages />
    </section>
  )
}
