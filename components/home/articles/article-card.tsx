"use client"

import Link from "next/link"
import type { NewsItem } from "@/data/news"

type Props = { item: NewsItem }

export function ArticleCard({ item }: Props) {
  return (
    <article className="shadow-sm bg-white transition hover:shadow-md">
      {/* Image: same fixed height for all, no radius */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />

      {/* Content: square edges, simple meta */}
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-2">
          {new Date(item.date).toLocaleDateString()}
        </div>
        <Link href={`/articles`} className="block">
          <h3 className="text-base font-semibold leading-snug hover:underline">{item.title}</h3>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.content}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>By {item.author}</span>
          <div className="flex items-center gap-3">
            <span>❤ {item.likes}</span>
            <span>👁 {item.views}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
