"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Calendar, MapPin, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: "active" | "inactive"
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetch("/data/announcements.json")
        const data: Announcement[] = await response.json()
        setAnnouncements(data)
      } catch (error) {
        console.error("Failed to load announcements:", error)
      }
    }

    loadAnnouncements()
  }, [])

  const handleStatusToggle = (id: string) => {
    setAnnouncements((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item,
      ),
    )
    toast({
      title: "Status Updated",
      description: "Announcement status has been updated.",
    })
  }

  const handleDelete = (id: string) => {
    setAnnouncements((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been successfully deleted.",
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold">Announcements</h1>
              <p className="text-muted-foreground">Manage community announcements and events</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{announcements.length}</div>
                <p className="text-xs text-muted-foreground">All announcements</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {announcements.filter((item) => item.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently showing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inactive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">
                  {announcements.filter((item) => item.status === "inactive").length}
                </div>
                <p className="text-xs text-muted-foreground">Hidden from users</p>
              </CardContent>
            </Card>
          </div>

          {/* Announcements Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Announcements</CardTitle>
              <CardDescription>Toggle announcements on/off and manage event details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <p className="font-medium">{announcement.title}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2">{announcement.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {new Date(announcement.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4" />
                          {announcement.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={announcement.status === "active"}
                            onCheckedChange={() => handleStatusToggle(announcement.id)}
                          />
                          <Badge variant={announcement.status === "active" ? "default" : "secondary"}>
                            {announcement.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(announcement.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
