"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NewsCard } from "@/components/news/news-card"
import type { NewsItem } from "@/data/news"

type Props = {
  sampleNews: NewsItem[]
}

export function RecentNewsSection({ sampleNews }: Props) {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Philippine Providence</h2>
          <p className="text-muted-foreground">Stay updated with our community happenings</p>
        </div>
        <Button variant="outline" asChild className="cursor-pointer bg-transparent">
          <Link href="/news">
            View All News
            {/* eslint-disable-next-line @next/next/no-img-element */}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleNews[0] && (
          <Link
            href={`/news/${sampleNews[0].slug}`}
            className="relative group md:row-span-2 md:col-span-2 h-80 md:h-[400px] overflow-hidden shadow-lg bg-black/80 cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sampleNews[0].image}
              alt={sampleNews[0].title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-colors duration-300"></div>
            <div className="relative z-10 flex flex-col justify-end h-full p-8">
              <div className="mb-2">
                <Badge variant="secondary" className="bg-white/80 text-black font-semibold">
                  {sampleNews[0].tags[0]}
                </Badge>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{sampleNews[0].title}</h3>
              <div className="text-white/80 text-sm mb-2">
                {sampleNews[0].author} &middot; {new Date(sampleNews[0].date).toLocaleDateString()}
              </div>
              <div className="overflow-hidden relative">
                <p className="text-white/90 text-base line-clamp-2 md:line-clamp-3 transition-all duration-300 group-hover:line-clamp-none group-hover:max-h-32 max-h-12">
                  {sampleNews[0].content}
                </p>
                <div className="absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
            </div>
          </Link>
        )}

        <div
          className={`grid grid-cols-1 ${
            sampleNews.slice(1, 4).length === 2
              ? "md:grid-rows-2"
              : sampleNews.slice(1, 4).length === 1
              ? "md:grid-rows-1"
              : "md:grid-rows-3"
          } gap-4 md:col-span-1`}
        >
          {sampleNews.slice(1, 4).map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="relative group h-40 overflow-hidden shadow-md bg-black/80 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-colors duration-300"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-4">
                <div className="mb-1">
                  <Badge variant="secondary" className="bg-white/80 text-black font-semibold">
                    {item.tags[0]}
                  </Badge>
                </div>
                <h4 className="text-lg font-bold text-white mb-1 line-clamp-2">{item.title}</h4>
                <div className="text-white/80 text-xs">
                  {item.author} &middot; {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="overflow-hidden relative">
                  <p className="text-white/90 text-sm line-clamp-1 transition-all duration-300 group-hover:line-clamp-none group-hover:max-h-16 max-h-6">
                    {item.content}
                  </p>
                  <div className="absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
