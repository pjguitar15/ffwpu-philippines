import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Users, ArrowRight } from "lucide-react"

interface Newsletter {
  id: string
  title: string
  date: string
  status: string
  subscribers: number
  content: string
  author: string
}

interface NewsletterCardProps {
  newsletter: Newsletter
}

export function NewsletterCard({ newsletter }: NewsletterCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant={newsletter.status === "published" ? "default" : "secondary"}>
              {newsletter.status === "published" ? "Published" : "Draft"}
            </Badge>
            <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors">
              <Link href={`/newsletter/${newsletter.id}`}>{newsletter.title}</Link>
            </CardTitle>
          </div>
        </div>
        <CardDescription className="line-clamp-3">{newsletter.content}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{newsletter.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(newsletter.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{newsletter.subscribers} subscribers</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" asChild>
            <Link href={`/newsletter/${newsletter.id}`}>
              Read Full Newsletter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
