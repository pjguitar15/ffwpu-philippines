'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PlusIcon, Pencil, Trash2, Eye, EyeOff, Youtube, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

interface YouTubeVideo {
  _id: string
  title: string
  description?: string
  videoId: string
  thumbnailUrl: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

interface VideoFormData {
  title: string
  description: string
  videoUrl: string
  order: number
  isActive: boolean
}

export default function YouTubeVideosAdmin() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    videoUrl: '',
    order: 0,
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/youtube-videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.sort((a: YouTubeVideo, b: YouTubeVideo) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch videos',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      order: 0,
      isActive: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingId
        ? `/api/youtube-videos/${editingId}`
        : '/api/youtube-videos'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Video ${editingId ? 'updated' : 'created'} successfully`,
        })
        resetForm()
        fetchVideos()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to save video',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving video:', error)
      toast({
        title: 'Error',
        description: 'Failed to save video',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (video: YouTubeVideo) => {
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      order: video.order,
      isActive: video.isActive,
    })
    setEditingId(video._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const response = await fetch(`/api/youtube-videos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Video deleted successfully',
        })
        fetchVideos()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete video',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete video',
        variant: 'destructive',
      })
    }
  }

  const toggleActive = async (video: YouTubeVideo) => {
    try {
      const response = await fetch(`/api/youtube-videos/${video._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !video.isActive }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Video ${!video.isActive ? 'activated' : 'deactivated'}`,
        })
        fetchVideos()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update video status',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error toggling video status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update video status',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1">
          <div className="p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl shadow-lg">
                <Image
                  src="/hj-media-works.jpg"
                  alt="HJ Media Works Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HJ Media Works</h1>
                <p className="text-gray-600 mt-1">Manage YouTube videos and content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                asChild
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <a 
                  href="https://www.youtube.com/@HJMediaWorks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Channel
                </a>
              </Button>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Videos</p>
                    <p className="text-3xl font-bold">{videos.length}</p>
                  </div>
                  <Youtube className="h-12 w-12 text-blue-100" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Videos</p>
                    <p className="text-3xl font-bold">{videos.filter(v => v.isActive).length}</p>
                  </div>
                  <Eye className="h-12 w-12 text-green-100" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Inactive Videos</p>
                    <p className="text-3xl font-bold">{videos.filter(v => !v.isActive).length}</p>
                  </div>
                  <EyeOff className="h-12 w-12 text-purple-100" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <Card className="mb-8 shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <CardTitle className="flex items-center space-x-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <span>{editingId ? 'Edit Video' : 'Add New Video'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Video Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter video title"
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        YouTube URL *
                      </label>
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, videoUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the full YouTube URL or just the video ID
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Enter video description"
                      rows={4}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Display Order
                      </label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value) })
                        }
                        min="0"
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3 pt-6">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                        Active (visible on website)
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      {saving ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Videos List */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="flex items-center space-x-2">
                <Youtube className="h-5 w-5 text-red-600" />
                <span>Video Library ({videos.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {videos.length === 0 ? (
                <div className="text-center py-16">
                  <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Videos Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by adding your first YouTube video.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Your First Video
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {videos.map((video, index) => (
                    <div key={video._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Youtube className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">{video.title}</h3>
                              {video.description && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {video.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <Badge 
                                  variant={video.isActive ? 'default' : 'secondary'}
                                  className={video.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                >
                                  {video.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <span className="flex items-center">
                                  Order: <span className="font-medium ml-1">{video.order}</span>
                                </span>
                                <span className="flex items-center">
                                  ID: <span className="font-mono text-xs ml-1">{video.videoId}</span>
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleActive(video)}
                                className="border-gray-200 hover:bg-gray-50"
                              >
                                {video.isActive ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(video)}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(video._id, video.title)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
