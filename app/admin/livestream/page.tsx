'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, StopCircle, Eye, ExternalLink, Radio } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LivestreamSettings {
  _id: string
  url: string
  isActive: boolean
}

export default function LivestreamPage() {
  const [settings, setSettings] = useState<LivestreamSettings | null>(null)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/livestream')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        setUrl(data.url || '')
      }
    } catch (error) {
      console.error('Error fetching livestream settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load livestream settings',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<LivestreamSettings>) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/livestream', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        toast({
          title: 'Success',
          description: 'Livestream settings updated successfully',
        })
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating livestream settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to update livestream settings',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const startLivestream = async () => {
    if (!url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a livestream URL first',
        variant: 'destructive',
      })
      return
    }

    await updateSettings({
      url: url.trim(),
      isActive: true,
    })
  }

  const stopLivestream = async () => {
    await updateSettings({ isActive: false })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                <p className="mt-2 text-slate-600">Loading livestream settings...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Livestream Management</h1>
        <p className="text-slate-600 mt-2">
          Manage your live streaming settings and control when the LIVE indicator appears on the website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Livestream Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">Livestream URL *</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or https://facebook.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 border border-slate-300"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter the URL where viewers can watch the livestream
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Livestream Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Current Status:</p>
                  <div className="flex items-center gap-2 mt-1">
                    {settings?.isActive ? (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        🔴 LIVE
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100">
                        ⚫ Offline
                      </Badge>
                    )}
                  </div>
                </div>
                {settings?.isActive && url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Stream
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                {!settings?.isActive ? (
                  <Button
                    onClick={startLivestream}
                    disabled={isSaving || !url.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Show LIVE Icon on Navbar
                  </Button>
                ) : (
                  <Button
                    onClick={stopLivestream}
                    disabled={isSaving}
                    variant="outline"
                    className="flex-1 cursor-pointer"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Hide LIVE Icon
                  </Button>
                )}
              </div>

              {!url.trim() && (
                <p className="text-sm text-slate-500 mt-2">
                  Please enter a livestream URL to show the LIVE icon
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <p className="text-sm text-slate-600">
                This is how the LIVE indicator will appear on your website navbar
              </p>
            </CardHeader>
            <CardContent>
              {/* Navbar Preview */}
              <div className="border rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Actual FFWPU Logo */}
                    <Image
                      src="/ffwpu-ph-logo.webp"
                      alt="FFWPU Philippines Logo"
                      width={32}
                      height={32}
                      className="h-8 w-auto object-contain"
                    />
                    
                    {/* LIVE indicator - always show in preview for demonstration */}
                    <div className="flex items-center">
                      <div className="inline-flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-red-700 transition-colors">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu placeholder */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>Home</span>
                    <span>News</span>
                    <span>About</span>
                    <span>Contact</span>
                  </div>
                </div>
              </div>

              {settings?.isActive ? (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    🔴 LIVE icon is currently visible on navbar
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Visitors will see the LIVE badge and can click it to open your stream
                  </p>
                  {url && (
                    <p className="text-xs text-red-600 mt-1">
                      <strong>Stream URL:</strong> {url}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600">
                    LIVE icon is currently hidden from navbar
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Show the LIVE icon to make it visible to visitors
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <p>Enter your <strong>livestream URL</strong> (YouTube, Facebook, or any streaming platform)</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <p>Click <strong>"Show LIVE Icon on Navbar"</strong> to display the red LIVE badge next to your logo</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <p>Visitors can click the <strong>LIVE badge</strong> to open your stream in a new tab</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                <p>Click <strong>"Hide LIVE Icon"</strong> when finished to remove the badge from the navbar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}
