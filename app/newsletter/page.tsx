"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsletterCard } from "@/components/newsletter/newsletter-card"
import { EnhancedNewsletterSignup } from "@/components/newsletter/enhanced-signup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Users, Calendar, TrendingUp } from "lucide-react"

interface Newsletter {
  id: string
  title: string
  date: string
  status: string
  subscribers: number
  content: string
  author: string
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    totalNewsletters: 0,
    latestDate: "",
  })

  useEffect(() => {
    const loadNewsletters = async () => {
      try {
        const response = await fetch("/data/newsletters.json")
        const data: Newsletter[] = await response.json()
        const publishedNewsletters = data.filter((newsletter) => newsletter.status === "published")

        // Sort by date, newest first
        publishedNewsletters.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setNewsletters(publishedNewsletters)

        // Calculate stats
        const totalSubscribers = Math.max(...data.map((n) => n.subscribers), 0)
        const latestNewsletter = publishedNewsletters[0]

        setStats({
          totalSubscribers,
          totalNewsletters: publishedNewsletters.length,
          latestDate: latestNewsletter?.date || "",
        })
      } catch (error) {
        console.error("Failed to load newsletters:", error)
      }
    }

    loadNewsletters()
  }, [])

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        <div className='container py-12 mx-auto'>
          {/* Page Header */}
          <div className='text-center space-y-4 mb-12'>
            <h1 className='font-heading text-4xl font-bold'>
              Community Newsletter
            </h1>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Stay connected with our FFWPU Philippines family through weekly
              inspiration, community updates, and spiritual guidance from True
              Parents' teachings.
            </p>
          </div>

          {/* Newsletter Signup Hero */}
          <div className='mb-16'>
            <EnhancedNewsletterSignup
              variant='hero'
              className='max-w-md mx-auto'
            />
          </div>

          {/* Stats Section */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Subscribers
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.totalSubscribers.toLocaleString()}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Active community members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Published Issues
                </CardTitle>
                <Mail className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.totalNewsletters}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Weekly inspirations sent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Latest Issue
                </CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.latestDate
                    ? new Date(stats.latestDate).toLocaleDateString()
                    : 'N/A'}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Most recent newsletter
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Newsletter Archive */}
          <section className='space-y-8'>
            <div className='text-center space-y-4'>
              <h2 className='font-heading text-3xl font-bold'>
                Newsletter Archive
              </h2>
              <p className='text-muted-foreground max-w-2xl mx-auto'>
                Browse our collection of past newsletters filled with
                inspiration, community news, and spiritual insights.
              </p>
            </div>

            {newsletters.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {newsletters.map((newsletter) => (
                  <NewsletterCard key={newsletter.id} newsletter={newsletter} />
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <Mail className='h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50' />
                <h3 className='font-heading text-xl font-semibold mb-2'>
                  No Newsletters Yet
                </h3>
                <p className='text-muted-foreground mb-6'>
                  We're preparing our first newsletter. Subscribe to be notified
                  when it's ready!
                </p>
                <EnhancedNewsletterSignup
                  variant='compact'
                  className='justify-center'
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
