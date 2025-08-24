"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { loadJsonData } from "@/lib/data-loader"
import { useToast } from "@/hooks/use-toast"
import { Mail, Plus, Edit, Send, Users, Calendar, Eye } from "lucide-react"

interface Newsletter {
  id: string
  title: string
  date: string
  status: string
  subscribers: number
  content: string
  author: string
}

export default function AdminNewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadNewsletters = async () => {
      try {
        const data = await loadJsonData<Newsletter>("/data/newsletters.json")
        setNewsletters(data)
      } catch (error) {
        console.error("[v0] Failed to load newsletters:", error)
        toast({
          title: "Error",
          description: "Failed to load newsletters",
          variant: "destructive",
        })
      }
    }

    loadNewsletters()
  }, [toast])

  const handleCreate = () => {
    const newNewsletter: Newsletter = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      status: formData.status,
      date: new Date().toISOString().split("T")[0],
      author: "Admin",
      subscribers: 2847,
    }

    setNewsletters([newNewsletter, ...newsletters])
    setFormData({ title: "", content: "", status: "draft" })
    setIsCreating(false)

    toast({
      title: "Success",
      description: "Newsletter created successfully",
    })
  }

  const handlePublish = (id: string) => {
    setNewsletters(
      newsletters.map((newsletter) =>
        newsletter.id === id
          ? { ...newsletter, status: "published", date: new Date().toISOString().split("T")[0] }
          : newsletter,
      ),
    )

    toast({
      title: "Success",
      description: "Newsletter published successfully",
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="container p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold">Newsletter Management</h1>
              <p className="text-muted-foreground">Create, edit, and manage community newsletters</p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Create Newsletter
            </Button>
          </div>

          {/* Create/Edit Form */}
          {(isCreating || editingId) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-heading">
                  {isCreating ? "Create New Newsletter" : "Edit Newsletter"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Newsletter title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Newsletter content..."
                    rows={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate} className="cursor-pointer">
                    {isCreating ? "Create" : "Update"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setEditingId(null)
                      setFormData({ title: "", content: "", status: "draft" })
                    }}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Newsletters List */}
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-semibold text-lg">{newsletter.title}</h3>
                        <Badge variant={newsletter.status === "published" ? "default" : "secondary"}>
                          {newsletter.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(newsletter.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{newsletter.subscribers.toLocaleString()} subscribers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>By {newsletter.author}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground line-clamp-2">{newsletter.content}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" className="cursor-pointer">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(newsletter.id)
                          setFormData({
                            title: newsletter.title,
                            content: newsletter.content,
                            status: newsletter.status,
                          })
                        }}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {newsletter.status === "draft" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handlePublish(newsletter.id)}
                          className="cursor-pointer"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {newsletters.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-heading text-xl font-semibold mb-2">No Newsletters Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first newsletter to get started.</p>
              <Button onClick={() => setIsCreating(true)} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Create Newsletter
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
