"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CommentsSection } from "@/components/news/comments-section"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Eye, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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

export default function ArticleDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<ArticleItem | null>(null)
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch("/data/news.json")
        const data: ArticleItem[] = await response.json()
        const item = data.find((item) => item.id === params.id)
        if (item) {
          setArticle(item)
          setLikes(item.likes)
        }
      } catch (error) {
        console.error("Failed to load article:", error)
      }
    }

    if (params.id) {
      loadArticle()
    }
  }, [params.id])

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
      toast({
        title: "Like removed",
        description: "You've unliked this article.",
      })
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
      toast({
        title: "Thank you! ❤️",
        description: "You've liked this article.",
      })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied! 📋",
        description: "The article link has been copied to your clipboard.",
      })
    }
  }

  const handleAddComment = (name: string, comment: string) => {
    console.log("Adding comment:", { name, comment })
  }

  const handleAddReply = (commentId: string, name: string, reply: string) => {
    console.log("Adding reply:", { commentId, name, reply })
  }

  if (!article) {
    return (
      <div className='min-h-screen flex flex-col'>
        <main className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold mb-4'>Article Not Found</h1>
            <Link href='/articles'>
              <Button>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Articles
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        <div className='container py-8'>
          {/* Back Button */}
          <div className='mb-6'>
            <Link href='/articles'>
              <Button variant='ghost'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Articles
              </Button>
            </Link>
          </div>

          <article className='max-w-4xl mx-auto'>
            {/* Article Header */}
            <header className='space-y-6 mb-8'>
              <div className='flex flex-wrap gap-2'>
                {article.tags.map((tag) => (
                  <Badge key={tag} variant='outline'>
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className='font-heading text-4xl font-bold leading-tight'>
                {article.title}
              </h1>

              <div className='flex flex-wrap items-center gap-6 text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <User className='h-4 w-4' />
                  <span>{article.author}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Eye className='h-4 w-4' />
                  <span>{article.views} views</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-4 pt-4 border-t'>
                <Button
                  variant='outline'
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${
                    isLiked ? 'text-red-500 border-red-200' : ''
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                  />
                  <span>{likes}</span>
                </Button>
                <Button variant='outline' onClick={handleShare}>
                  <Share2 className='h-4 w-4 mr-2' />
                  Share
                </Button>
              </div>
            </header>

            {/* Featured Image */}
            <div className='mb-8'>
              <img
                src={article.image || '/placeholder.svg'}
                alt={article.title}
                className='w-full h-64 md:h-96 object-cover rounded-lg shadow-lg'
              />
            </div>

            {/* Article Content */}
            <div className='prose prose-lg max-w-none mx-auto mb-12'>
              <p className='text-lg leading-relaxed'>{article.content}</p>
            </div>

            {/* Comments Section */}
            <div className='border-t pt-8'>
              <CommentsSection
                comments={article.comments}
                onAddComment={handleAddComment}
                onAddReply={handleAddReply}
              />
            </div>
          </article>

          {/* Newsletter Signup */}
          <div className='max-w-2xl mx-auto mt-16 bg-muted/30 rounded-lg p-8 text-center'>
            <h2 className='font-heading text-2xl font-bold mb-4'>
              Weekly Inspiration
            </h2>
            <p className='text-muted-foreground mb-6'>
              Get more thoughtful articles and spiritual insights delivered to
              your inbox.
            </p>
            <NewsletterSignup variant='compact' className='justify-center' />
          </div>
        </div>
      </main>
    </div>
  )
}
