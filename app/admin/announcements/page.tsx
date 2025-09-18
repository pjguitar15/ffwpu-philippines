"use client"

import { useState, useEffect } from "react"
import { Suspense } from 'react'
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Calendar, MapPin, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import OwlCta from '@/components/admin/owl-cta'

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
    <Suspense>
      <div className='flex h-screen bg-background'>
        <AdminSidebar />
        <main className='flex-1 overflow-auto'>
          <div className='p-8'>
            {/* Header with subtle gradient */}
            <div className='mb-8 rounded-xl border bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20'>
              <div className='px-6 py-6 flex items-center justify-between'>
                <div>
                  <h1 className='font-heading text-3xl font-bold'>
                    Announcements
                  </h1>
                  <p className='text-muted-foreground'>
                    Manage community announcements and events
                  </p>
                </div>
                <Button className='bg-indigo-600 hover:bg-indigo-700'>
                  <Plus className='mr-2 h-4 w-4' />
                  Create Announcement
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Total Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {announcements.length}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    All announcements
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-green-600'>
                    {
                      announcements.filter((item) => item.status === 'active')
                        .length
                    }
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Currently showing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Inactive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-muted-foreground'>
                    {
                      announcements.filter((item) => item.status === 'inactive')
                        .length
                    }
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Hidden from users
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Helpful CTA */}
            <div className='mb-6'>
              <OwlCta
                title='Got something timely to announce?'
                subtitle='Quickly add a new announcement for members to see.'
                buttonLabel='Add Announcement'
                href='/admin/announcements'
              />
            </div>

            {/* Announcements Table */}
            <Card className='shadow-sm overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-background dark:to-slate-950/20'>
              <div className='h-1 w-full bg-indigo-500' />
              <CardHeader>
                <CardTitle>All Announcements</CardTitle>
                <CardDescription>
                  Toggle announcements on/off and manage event details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='relative -mx-2 md:mx-0 overflow-auto rounded-xl border border-border/60'>
                  <Table className='min-w-[880px]'>
                    <TableHeader className='sticky top-0 z-[1] bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-900/60 dark:to-sky-950/40 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                      <TableRow className='h-14'>
                        <TableHead className='text-base'>Title</TableHead>
                        <TableHead className='text-base'>Description</TableHead>
                        <TableHead className='text-base'>Date</TableHead>
                        <TableHead className='text-base'>Location</TableHead>
                        <TableHead className='text-base'>Status</TableHead>
                        <TableHead className='text-base'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {announcements.map((announcement) => (
                        <TableRow
                          key={announcement.id}
                          className='h-16 hover:bg-sky-50/60 dark:hover:bg-sky-950/20'
                        >
                          <TableCell>
                            <p className='font-medium'>{announcement.title}</p>
                          </TableCell>
                          <TableCell>
                            <p className='text-sm text-muted-foreground line-clamp-2'>
                              {announcement.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-1 text-sm'>
                              <Calendar className='h-4 w-4' />
                              {new Date(announcement.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-1 text-sm'>
                              <MapPin className='h-4 w-4' />
                              {announcement.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <Switch
                                checked={announcement.status === 'active'}
                                onCheckedChange={() =>
                                  handleStatusToggle(announcement.id)
                                }
                              />
                              <Badge
                                variant={
                                  announcement.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className='capitalize'
                              >
                                {announcement.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <Button
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-blue-700 hover:text-blue-800 hover:bg-blue-50'
                              >
                                <Edit className='h-4 w-4' /> Edit
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDelete(announcement.id)}
                                className='text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
