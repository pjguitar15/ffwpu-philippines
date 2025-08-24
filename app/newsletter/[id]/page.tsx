"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EnhancedNewsletterSignup } from "@/components/newsletter/enhanced-signup"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Users, Share2, Mail } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Newsletter {
  id: string
  title: string
  date: string
  status: string
  subscribers: number
  content: string
  author: string
}

export default function NewsletterDetailPage() {
  const params = useParams()
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadNewsletter = async () => {
      try {
        const response = await fetch("/data/newsletters.json")
        const data: Newsletter[] = await response.json()
        const item = data.find((item) => item.id === params.id)
        setNewsletter(item || null)
      } catch (error) {
        console.error("Failed to load newsletter:", error)
      }
    }

    if (params.id) {
      loadNewsletter()
    }
  }, [params.id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsletter?.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied! 📋",
        description: "The newsletter link has been copied to your clipboard.",
      })
    }
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Newsletter Not Found</h1>
            <Link href="/newsletter">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Newsletter
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/newsletter">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Newsletter
              </Button>
            </Link>
          </div>

          <article className="max-w-4xl mx-auto">
            {/* Newsletter Header */}
            <header className="space-y-6 mb-8">
              <div className="flex items-center gap-2">
                <Badge variant={newsletter.status === "published" ? "default" : "secondary"}>
                  {newsletter.status === "published" ? "Published" : "Draft"}
                </Badge>
                <Badge variant="outline">Newsletter</Badge>
              </div>

              <h1 className="font-heading text-4xl font-bold leading-tight">{newsletter.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{newsletter.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(newsletter.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{newsletter.subscribers} subscribers</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Newsletter
                </Button>
              </div>
            </header>

            {/* Newsletter Content */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Newsletter Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none mx-auto">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{newsletter.content}</p>

                  {/* Sample newsletter sections */}
                  <div className="mt-8 space-y-6">
                    <div className="border-l-4 border-primary pl-6">
                      <h3 className="font-heading text-xl font-semibold mb-2">This Week's Reflection</h3>
                      <p className="text-muted-foreground">
                        True Parents have taught us that the path to peace begins within our own hearts and families. As
                        we practice living for the sake of others, we create ripples of love that extend throughout our
                        communities and beyond.
                      </p>
                    </div>

                    <div className="border-l-4 border-accent pl-6">
                      <h3 className="font-heading text-xl font-semibold mb-2">Community Highlights</h3>
                      <p className="text-muted-foreground">
                        This week, our youth participated in a service project at the local community center, embodying
                        True Parents' teaching of living for others. Their dedication and joy touched many hearts in the
                        neighborhood.
                      </p>
                    </div>

                    <div className="border-l-4 border-secondary pl-6">
                      <h3 className="font-heading text-xl font-semibold mb-2">Upcoming Events</h3>
                      <p className="text-muted-foreground">
                        Join us for our monthly family gathering this Saturday. We'll be sharing testimonies and
                        enjoying fellowship together as one family under God.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </article>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto mt-16 bg-muted/30 rounded-lg p-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Enjoyed This Newsletter?</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to receive weekly inspiration and updates from our FFWPU Philippines community.
            </p>
            <EnhancedNewsletterSignup variant="compact" className="justify-center" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
