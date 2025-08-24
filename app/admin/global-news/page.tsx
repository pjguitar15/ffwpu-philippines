"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Globe, Calendar, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GlobalNewsItem {
  id: string
  title: string
  youtubeUrl: string
  date: string
}

export default function AdminGlobalNewsPage() {
  const [globalNews, setGlobalNews] = useState<GlobalNewsItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<GlobalNewsItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    date: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadGlobalNews = async () => {
      try {
        const response = await fetch("/data/globalNews.json")
        const data: GlobalNewsItem[] = await response.json()
        setGlobalNews(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      } catch (error) {
        console.error("Failed to load global news:", error)
      }
    }

    loadGlobalNews()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingItem) {
      // Update existing item
      setGlobalNews((items) => items.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)))
      toast({
        title: "Global News Updated",
        description: "The global news episode has been successfully updated.",
      })
    } else {
      // Create new item
      const newItem: GlobalNewsItem = {
        id: `g${Date.now()}`,
        ...formData,
      }
      setGlobalNews((items) => [newItem, ...items])
      toast({
        title: "Global News Created",
        description: "New global news episode has been successfully created.",
      })
    }

    // Reset form
    setFormData({ title: "", youtubeUrl: "", date: "" })
    setIsEditing(false)
    setEditingItem(null)
  }

  const handleEdit = (item: GlobalNewsItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      youtubeUrl: item.youtubeUrl,
      date: item.date,
    })
    setIsEditing(true)
  }

  const handleDelete = (id: string) => {
    setGlobalNews((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Global News Deleted",
      description: "The global news episode has been successfully deleted.",
    })
  }

  const handleCancel = () => {
    setFormData({ title: "", youtubeUrl: "", date: "" })
    setIsEditing(false)
    setEditingItem(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold">Global News Management</h1>
              <p className="text-muted-foreground">Manage weekly YouTube global news episodes</p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Global News
              </Button>
            )}
          </div>

          {/* Add/Edit Form */}
          {isEditing && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingItem ? "Edit Global News Episode" : "Add New Global News Episode"}</CardTitle>
                <CardDescription>
                  {editingItem ? "Update the global news episode details" : "Create a new weekly global news episode"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Episode Title *</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Global News Weekly - [Date]"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Episode Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube URL *</Label>
                    <Input
                      id="youtubeUrl"
                      type="url"
                      placeholder="https://youtube.com/watch?v=... or https://youtube.com/embed/..."
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste the YouTube video URL. Both watch and embed URLs are supported.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingItem ? "Update Episode" : "Create Episode"}</Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Total Episodes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalNews.length}</div>
                <p className="text-xs text-muted-foreground">All global news episodes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Latest Episode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {globalNews.length > 0 ? new Date(globalNews[0].date).toLocaleDateString() : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Most recent episode</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    globalNews.filter((item) => {
                      const itemDate = new Date(item.date)
                      const now = new Date()
                      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Episodes this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Global News Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Global News Episodes</CardTitle>
              <CardDescription>Manage your weekly global news YouTube episodes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>YouTube URL</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.title}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground truncate max-w-xs mx-auto">
                            {item.youtubeUrl}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {globalNews.length === 0 && (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No global news episodes found</p>
                  <Button className="mt-4" onClick={() => setIsEditing(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Episode
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
