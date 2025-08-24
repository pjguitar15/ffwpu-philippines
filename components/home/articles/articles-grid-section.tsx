"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import type { NewsItem } from "@/data/news"
import { ArticleCard } from "./article-card"

export function ArticlesGridSection({ items }: { items: NewsItem[] }) {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl font-bold">Featured Articles</h2>
          <p className="text-muted-foreground">Insights and reflections from our community</p>
        </div>
        <Button variant="outline" asChild className="cursor-pointer bg-transparent">
          <Link href="/articles">View All Articles</Link>
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ArticleCard key={`article-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Loading featured articles...</p>
        </div>
      )}
    </section>
  )
}
