"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedNewsletterSignup } from "@/components/newsletter/enhanced-signup"
import { Calendar, Globe, Play, Clock, Users } from "lucide-react"

interface GlobalNewsItem {
  id: string
  title: string
  youtubeUrl: string
  date: string
}

export default function GlobalNewsPage() {
  const [globalNews, setGlobalNews] = useState<GlobalNewsItem[]>([])
  const [currentNews, setCurrentNews] = useState<GlobalNewsItem | null>(null)

  useEffect(() => {
    const loadGlobalNews = async () => {
      try {
        const response = await fetch("/data/globalNews.json")
        const data: GlobalNewsItem[] = await response.json()

        // Sort by date, newest first
        const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setGlobalNews(sortedData)
        setCurrentNews(sortedData[0] || null)
      } catch (error) {
        console.error("Failed to load global news:", error)
      }
    }

    loadGlobalNews()
  }, [])

  const getYouTubeEmbedUrl = (url: string) => {
    // Convert YouTube URL to embed format
    if (url.includes("youtube.com/embed/")) {
      return url
    }
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return `https://youtube.com/embed/${videoId}`
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return `https://youtube.com/embed/${videoId}`
    }
    return url
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-12 mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <h1 className="font-heading text-4xl font-bold">Global News</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay connected with our worldwide FFWPU family through weekly global updates, featuring news from True
              Mother and our international community.
            </p>
          </div>

          {/* Current Week's Global News */}
          {currentNews ? (
            <div className="mb-12">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Badge variant="default" className="w-fit">
                        Latest Episode
                      </Badge>
                      <CardTitle className="font-heading text-2xl">{currentNews.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(currentNews.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Weekly Update</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* YouTube Video Embed */}
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                    <iframe
                      src={getYouTubeEmbedUrl(currentNews.youtubeUrl)}
                      title={currentNews.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="prose prose-lg max-w-none mx-auto">
                      <p className="text-muted-foreground">
                        This week's global news brings you the latest updates from True Mother Hak Ja Han Moon and our
                        international FFWPU community. Discover inspiring stories of peace-building, family values, and
                        spiritual growth from around the world.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Global Updates</Badge>
                      <Badge variant="outline">True Mother</Badge>
                      <Badge variant="outline">International Community</Badge>
                      <Badge variant="outline">Peace Building</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="mb-12">
              <Card>
                <CardContent className="py-12 text-center">
                  <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-heading text-xl font-semibold mb-2">No Global News Available</h3>
                  <p className="text-muted-foreground mb-6">
                    We're preparing this week's global news update. Please check back soon!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Previous Episodes */}
          {globalNews.length > 1 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold">Previous Episodes</h2>
                <Badge variant="outline">{globalNews.length - 1} Episodes</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {globalNews.slice(1).map((newsItem) => (
                  <Card key={newsItem.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4 relative group-hover:scale-105 transition-transform">
                        <iframe
                          src={getYouTubeEmbedUrl(newsItem.youtubeUrl)}
                          title={newsItem.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <CardTitle className="font-heading text-lg line-clamp-2">{newsItem.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(newsItem.date).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* About Global News */}
          <section className="mb-12">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">About Global News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Our weekly Global News program connects you with the worldwide FFWPU family, bringing you the
                      latest updates, inspirational messages, and important announcements from True Mother and our
                      international community.
                    </p>
                    <p className="text-muted-foreground">
                      Each episode features highlights from different regions, testimonies of faith, and guidance for
                      living according to True Parents' teachings in our daily lives.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Weekly Updates</p>
                        <p className="text-sm text-muted-foreground">New episodes every week</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Global Community</p>
                        <p className="text-sm text-muted-foreground">Stories from around the world</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">True Mother's Guidance</p>
                        <p className="text-sm text-muted-foreground">Messages and teachings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Newsletter Signup */}
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Never Miss an Update</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to be notified when new Global News episodes are available, plus receive
              weekly inspiration from our community.
            </p>
            <EnhancedNewsletterSignup variant="compact" className="justify-center" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
