"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Calendar, MapPin } from "lucide-react"
import { loadJsonData } from "@/lib/data-loader"
import { useToast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: "active" | "inactive"
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load active announcement from data
    const loadAnnouncement = async () => {
      try {
        const announcements = await loadJsonData<Announcement>("/data/announcements.json")
        const activeAnnouncement = announcements.find((a) => a.status === "active")
        setAnnouncement(activeAnnouncement || null)
      } catch (error) {
        console.error("[v0] Failed to load announcements:", error)
        toast({
          title: "Error",
          description: "Failed to load announcements",
          variant: "destructive",
        })
      }
    }

    loadAnnouncement()
  }, [toast])

  if (!announcement || !isVisible) {
    return null
  }

  return (
    <div className="container">
      <Card className="border-l-4 border-l-primary bg-primary/5 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <h3 className="font-heading font-semibold text-lg">{announcement.title}</h3>
              <p className="text-muted-foreground">{announcement.description}</p>
              <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(announcement.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{announcement.location}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="ml-4 h-8 w-8 p-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close announcement</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
