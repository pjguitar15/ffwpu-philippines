"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NewsItem {
  id: string
  title: string
  author: string
  date: string
  tags: string[]
  status: string
  views: number
  likes: number
}

export default function AdminNewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch("/data/news.json")
        const data: NewsItem[] = await response.json()
        setNewsItems(data)
        setFilteredItems(data)
      } catch (error) {
        console.error("Failed to load news:", error)
      }
    }

    loadNews()
  }, [])

  useEffect(() => {
    const filtered = newsItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredItems(filtered)
  }, [searchQuery, newsItems])

  const handleDelete = (id: string) => {
    // Mock delete - in real app would make API call
    setNewsItems((items) => items.filter((item) => item.id !== id))
    toast({
      title: "News Deleted",
      description: "The news article has been successfully deleted.",
    })
  }

  const handleStatusToggle = (id: string) => {
    // Mock status toggle
    setNewsItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: item.status === "active" ? "inactive" : "active" } : item,
      ),
    )
    toast({
      title: "Status Updated",
      description: "News article status has been updated.",
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
              <h1 className="font-heading text-3xl font-bold">News Management</h1>
              <p className="text-muted-foreground">Manage community news and articles</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create News Article
            </Button>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Search News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, author, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{newsItems.length}</div>
                <p className="text-xs text-muted-foreground">All news articles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{newsItems.filter((item) => item.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">Currently published</p>
              </CardContent>
            </Card>
          </div>

          {/* News Table */}
          <Card>
            <CardHeader>
              <CardTitle>All News Articles</CardTitle>
              <CardDescription>Manage your community news and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <div className="flex gap-1 mt-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "active" ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleStatusToggle(item.id)}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.views}</TableCell>
                      <TableCell>{item.likes}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
