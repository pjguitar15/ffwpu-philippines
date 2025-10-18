'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Eye, Calendar, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NewsItem {
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
  slug: string
}

interface NewsCardProps {
  item: NewsItem
  type: 'news' | 'articles'
}

export function NewsCard({ item, type }: NewsCardProps) {
  const [likes, setLikes] = useState(item.likes)
  const [isLiked, setIsLiked] = useState(false)
  const { toast } = useToast()

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
      toast({
        title: 'Like removed',
        description: "You've unliked this post.",
      })
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
      toast({
        title: 'Thank you! ❤️',
        description: "You've liked this post.",
      })
    }
  }

  return (
    <Card className='group hover:shadow-lg transition-all duration-300'>
      <CardHeader className='p-0'>
        <div className='relative overflow-hidden rounded-t-lg'>
          <img
            src={item.image || '/placeholder.svg'}
            alt={item.title}
            className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
          />
          <div className='absolute top-4 left-4'>
            <Badge
              variant='secondary'
              className='bg-background/90 backdrop-blur-sm'
            >
              {type === 'news' ? 'Updates' : 'Article'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            {item.tags.map((tag) => (
              <Badge key={tag} variant='outline' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className='font-heading text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors'>
            <Link href={`/${type}/${item.slug}`}>{item.title}</Link>
          </h3>

          <p className='text-muted-foreground line-clamp-3'>{item.content}</p>

          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <User className='h-4 w-4' />
              <span>{item.author}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='px-6 py-4 border-t bg-muted/20'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <Eye className='h-4 w-4' />
              <span>{item.views}</span>
            </div>
            <div className='flex items-center gap-1'>
              <MessageCircle className='h-4 w-4' />
              <span>{item.comments.length}</span>
            </div>
          </div>

          <Button
            variant='ghost'
            size='sm'
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              isLiked ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
