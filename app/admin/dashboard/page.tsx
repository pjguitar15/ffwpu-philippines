"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Mail, Megaphone, Users, TrendingUp, Activity, Globe } from "lucide-react"

interface DashboardStats {
  totalNews: number
  totalNewsletters: number
  totalSubscribers: number
  activeAnnouncements: number
  totalAdmins: number
  recentActivity: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalNewsletters: 0,
    totalSubscribers: 0,
    activeAnnouncements: 0,
    totalAdmins: 0,
    recentActivity: 0,
  })

  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load all data files to calculate stats
        const [newsRes, newslettersRes, announcementsRes, adminsRes, auditRes] = await Promise.all([
          fetch("/data/news.json"),
          fetch("/data/newsletters.json"),
          fetch("/data/announcements.json"),
          fetch("/data/admins.json"),
          fetch("/data/auditLog.json"),
        ])

        const [news, newsletters, announcements, admins, auditLog] = await Promise.all([
          newsRes.json(),
          newslettersRes.json(),
          announcementsRes.json(),
          adminsRes.json(),
          auditRes.json(),
        ])

        // Calculate stats
        const totalSubscribers = Math.max(...newsletters.map((n: any) => n.subscribers), 0)
        const activeAnnouncements = announcements.filter((a: any) => a.status === "active").length

        setStats({
          totalNews: news.length,
          totalNewsletters: newsletters.filter((n: any) => n.status === "published").length,
          totalSubscribers,
          activeAnnouncements,
          totalAdmins: admins.filter((a: any) => a.status === "active").length,
          recentActivity: auditLog.length,
        })

        // Set recent activities (last 5)
        setRecentActivities(auditLog.slice(-5).reverse())
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />

      <main className='flex-1 overflow-auto'>
        <div className='p-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='font-heading text-3xl font-bold'>Dashboard</h1>
            <p className='text-muted-foreground'>
              Welcome to the FFWPU Philippines Admin Portal
            </p>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {[
              {
                title: 'Total News',
                value: stats.totalNews,
                subtitle: 'Published articles',
                Icon: FileText,
                c: {
                  bar: 'bg-indigo-500',
                  from: 'from-indigo-50',
                  darkFrom: 'dark:from-indigo-950/30',
                  iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
                  iconText: 'text-indigo-600 dark:text-indigo-300',
                  valueText: 'text-indigo-700 dark:text-indigo-100',
                },
              },
              {
                title: 'Admin Staffs',
                value: stats.totalAdmins,
                subtitle: 'Active admins',
                Icon: Mail,
                c: {
                  bar: 'bg-emerald-500',
                  from: 'from-emerald-50',
                  darkFrom: 'dark:from-emerald-950/30',
                  iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
                  iconText: 'text-emerald-600 dark:text-emerald-300',
                  valueText: 'text-emerald-700 dark:text-emerald-100',
                },
              },
              {
                title: 'Subscribers',
                value: stats.totalSubscribers.toLocaleString(),
                subtitle: 'Newsletter subscribers',
                Icon: Users,
                c: {
                  bar: 'bg-sky-500',
                  from: 'from-sky-50',
                  darkFrom: 'dark:from-sky-950/30',
                  iconBg: 'bg-sky-100 dark:bg-sky-900/40',
                  iconText: 'text-sky-600 dark:text-sky-300',
                  valueText: 'text-sky-700 dark:text-sky-100',
                },
              },
              {
                title: 'Active Announcements',
                value: stats.activeAnnouncements,
                subtitle: 'Currently showing',
                Icon: Megaphone,
                c: {
                  bar: 'bg-rose-500',
                  from: 'from-rose-50',
                  darkFrom: 'dark:from-rose-950/30',
                  iconBg: 'bg-rose-100 dark:bg-rose-900/40',
                  iconText: 'text-rose-600 dark:text-rose-300',
                  valueText: 'text-rose-700 dark:text-rose-100',
                },
              },
            ].map(({ title, value, subtitle, Icon, c }) => (
              <Card
                key={title}
                className={`overflow-hidden border-0 shadow-sm bg-gradient-to-br ${c.from} to-white dark:${c.darkFrom} dark:to-background`}
              >
                {/* thin colored top bar */}
                <div className={`h-1 w-full ${c.bar}`} />

                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>{title}</CardTitle>
                  <div className={`p-2 rounded-full ${c.iconBg}`}>
                    <Icon className={`h-4 w-4 ${c.iconText}`} />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className={`text-2xl font-bold ${c.valueText}`}>
                    {value}
                  </div>
                  <p className='text-xs text-muted-foreground'>{subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest admin actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className='flex items-start space-x-3'
                      >
                        <div className='h-2 w-2 rounded-full bg-primary mt-2'></div>
                        <div className='flex-1 space-y-1'>
                          <p className='text-sm font-medium'>
                            {activity.action}
                          </p>
                          {activity.details && (
                            <p className='text-xs text-muted-foreground'>
                              {activity.details}
                            </p>
                          )}
                          <p className='text-xs text-muted-foreground'>
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <FileText className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>Create News Article</span>
                    </div>
                    <Badge variant='outline'>News</Badge>
                  </div>

                  <div className='flex items-center justify-between p-3 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>Draft Newsletter</span>
                    </div>
                    <Badge variant='outline'>Newsletter</Badge>
                  </div>

                  <div className='flex items-center justify-between p-3 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <Megaphone className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>Add Announcement</span>
                    </div>
                    <Badge variant='outline'>Announcement</Badge>
                  </div>

                  <div className='flex items-center justify-between p-3 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <Globe className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm'>Update Global News</span>
                    </div>
                    <Badge variant='outline'>Global</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
