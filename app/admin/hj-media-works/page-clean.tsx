'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusIcon, Pencil, Trash2, Eye, EyeOff, ExternalLink, GripVertical, Youtube } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

interface YouTubeVideo {
  _id: string
  title: string
  description?: string
  videoId: string
  thumbnailUrl: string
  order: number
  isActive: boolean
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
  const [showModal, setShowModal] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
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
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
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
    setShowModal(true)
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
    setShowModal(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingId ? `/api/youtube-videos/${editingId}` : '/api/youtube-videos'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Video ${editingId ? 'updated' : 'added'} successfully`,
        })
        fetchVideos()
        resetForm()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to save video',
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
        method: 'PATCH',
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

  const handleDragStart = (e: React.DragEvent, videoId: string) => {
    setDraggedItem(videoId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const draggedVideo = videos.find(v => v._id === draggedItem)
    const targetVideo = videos.find(v => v._id === targetId)
    
    if (!draggedVideo || !targetVideo) return

    try {
      // Update the dragged video's order to match the target
      const response = await fetch(`/api/youtube-videos/${draggedItem}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: targetVideo.order })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Video order updated successfully',
        })
        fetchVideos()
      }
    } catch (error) {
      console.error('Error updating video order:', error)
      toast({
        title: 'Error',
        description: 'Failed to update video order',
        variant: 'destructive',
      })
    }
    
    setDraggedItem(null)
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
              <Image
                src="/hj-media-works.jpg"
                alt="HJ Media Works Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HJ Media Works</h1>
                <p className="text-gray-600 mt-1">Manage YouTube videos and content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                asChild
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <a
                  href="https://www.youtube.com/@hjmediaworks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Channel
                </a>
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </div>
          </div>

          {/* Add/Edit Video Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Video' : 'Add New Video'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    type="text"
                    placeholder="Video title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    placeholder="Video description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <Input
                    type="number"
                    placeholder="Display order"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Update' : 'Add Video'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
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

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
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

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
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

          {/* Videos Grid */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="flex items-center space-x-2">
                <Youtube className="h-5 w-5 text-red-600" />
                <span>Video Library ({videos.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Your First Video
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div
                      key={video._id}
                      className={`group relative bg-white rounded-lg shadow-md border-2 border-gray-200 hover:border-red-300 transition-all duration-200 cursor-move ${
                        draggedItem === video._id ? 'opacity-50' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, video._id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, video._id)}
                    >
                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                      </div>

                      {/* Video Thumbnail */}
                      <div className="relative w-full h-32 rounded-t-lg overflow-hidden">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Youtube className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <Badge variant={video.isActive ? "default" : "secondary"} className="text-xs">
                            {video.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        
                        {/* Order Display */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>Order: {video.order}</span>
                          <span>ID: {video.videoId}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(video)}
                              className="h-7 px-2"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleActive(video)}
                              className="h-7 px-2"
                            >
                              {video.isActive ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(video._id, video.title)}
                              className="h-7 px-2 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <a
                            href={`https://www.youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
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
