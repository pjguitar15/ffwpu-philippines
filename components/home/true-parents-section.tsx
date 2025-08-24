"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TrueParentsSection() {
  return (
    <section className="bg-gradient-to-r from-primary/5 via-yellow-50 to-primary/5 rounded-xl p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-4 right-4 opacity-30">
        <div className="w-8 h-8 bg-pink-200 rounded-full blur-sm"></div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-30">
        <div className="w-6 h-6 bg-yellow-200 rounded-full blur-sm"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-bold">True Parents</h2>
          <p className="text-muted-foreground leading-relaxed">
            Rev. Sun Myung Moon and Hak Ja Han Moon, known as True Parents, dedicated their lives to building a world of
            peace and unity. Their teachings continue to inspire millions worldwide to live for the sake of others and
            create one human family under God.
          </p>
          <div className="bg-white/50 p-4 rounded-lg border-l-4 border-primary">
            <p className="text-muted-foreground leading-relaxed font-medium">
              Today, <span className="text-primary font-bold">Holy Mother Han</span> (True Mother Hak Ja Han Moon)
              continues this providential mission, guiding us toward the realization of Cheon Il Guk - God's Kingdom on
              Earth.
            </p>
          </div>
          <Button asChild className="cursor-pointer">
            <Link href="/about/true-parents">
              Learn More About True Parents
            </Link>
          </Button>
        </div>
        <div className="order-first lg:order-last">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/true-parents-portrait.jpg"
            alt="True Parents - Rev. Sun Myung Moon and Hak Ja Han Moon"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>
    </section>
  )
}
