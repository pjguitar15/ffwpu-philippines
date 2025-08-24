"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsCard } from "@/components/news/news-card"
import { SearchAndFilter } from "@/components/news/search-and-filter"
import { NewsletterSignup } from "@/components/newsletter-signup"

interface ArticleItem {
  id: string
  title: string
  author: string
  date: string
  image: string
  tags: string[]
  status: string
  views: number
  likes: number
  content: string
  comments: any[]
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [filteredItems, setFilteredItems] = useState<ArticleItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    // For now, we'll use the same news data but filter for article-type content
    // In a real app, you'd have separate articles.json
    const loadArticles = async () => {
      try {
        const response = await fetch("/data/news.json")
        const data: ArticleItem[] = await response.json()
        const activeArticles = data.filter((item) => item.status === "active")
        setArticles(activeArticles)
        setFilteredItems(activeArticles)

        // Extract unique tags
        const tags = Array.from(new Set(activeArticles.flatMap((item) => item.tags)))
        setAvailableTags(tags)
      } catch (error) {
        console.error("Failed to load articles:", error)
      }
    }

    loadArticles()
  }, [])

  useEffect(() => {
    // Filter items based on search and tags
    let filtered = articles

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) => selectedTags.some((tag) => item.tags.includes(tag)))
    }

    setFilteredItems(filtered)
  }, [searchQuery, selectedTags, articles])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-12 mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="font-heading text-4xl font-bold">Inspirational Articles</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover insights, reflections, and spiritual guidance from our community leaders and members. Explore
              articles that inspire growth in faith, family, and service to others.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <SearchAndFilter
              onSearch={setSearchQuery}
              onTagFilter={setSelectedTags}
              availableTags={availableTags}
              selectedTags={selectedTags}
            />
          </div>

          {/* Articles Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredItems.map((item) => (
                <NewsCard key={item.id} item={item} type="articles" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || selectedTags.length > 0
                  ? "No articles found matching your search criteria."
                  : "No articles available at the moment."}
              </p>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Weekly Inspiration</h2>
            <p className="text-muted-foreground mb-6">
              Get thoughtful articles and spiritual insights delivered to your inbox every week.
            </p>
            <NewsletterSignup variant="compact" className="justify-center" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
