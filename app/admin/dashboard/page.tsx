"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
  Activity,
  Globe,
  Mail,
  Megaphone,
} from 'lucide-react'
import OwlCta from '@/components/admin/owl-cta'

interface DashboardStats {
  totalNews: number
  totalEvents: number
  totalSubscribers: number
  totalAdmins: number
  recentActivity: number
  wotdShort: string
  wotdAuthor?: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalEvents: 0,
    totalSubscribers: 0,
    totalAdmins: 0,
    recentActivity: 0,
    wotdShort: '-',
    wotdAuthor: '',
  })

  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [admins, setAdmins] = useState<
    Array<{ id: string; name: string; email: string; role: string }>
  >([])
  const [loadingRecent, setLoadingRecent] = useState<boolean>(false)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoadingRecent(true)
        // Try live APIs first; graceful fallback to static JSON files
        const results = await Promise.allSettled([
          fetch('/api/news', { cache: 'no-store' }),
          fetch('/api/events', { cache: 'no-store' }),
          fetch('/api/newsletter?page=1&pageSize=1', { cache: 'no-store' }),
          fetch('/api/wotd/current', { cache: 'no-store' }),
          fetch('/api/admins', { cache: 'no-store' }),
          fetch('/api/audit-log?page=1&pageSize=5', { cache: 'no-store' }),
        ])

        const [newsRes, eventsRes, subsRes, wotdRes, adminsRes, auditRes] =
          results

        // News count - only published articles
        let totalNews = 0
        if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
          const data = await newsRes.value.json()
          if (Array.isArray(data)) {
            // Count only published articles (handle both new and legacy status values)
            totalNews = data.filter(
              (item) => item.status === 'published' || item.status === 'active',
            ).length
          }
        } else {
          const alt = await(await fetch('/data/news.json')).json()
          if (Array.isArray(alt)) {
            // Count only published articles from fallback data
            totalNews = alt.filter(
              (item) => item.status === 'published' || item.status === 'active',
            ).length
          }
        }

        // Events count
        let totalEvents = 0
        if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
          const data = await eventsRes.value.json()
          totalEvents = Array.isArray(data) ? data.length : 0
        }

        // Subscribers total
        let totalSubscribers = 0
        if (subsRes.status === 'fulfilled' && subsRes.value.ok) {
          const data = await subsRes.value.json()
          totalSubscribers = Number(data?.total || 0)
        } else {
          const alt = await(await fetch('/data/newsletters.json')).json()
          totalSubscribers = Math.max(
            ...alt.map((n: any) => n.subscribers ?? 0),
            0,
          )
        }

        // Word of the Day (full text preferred; no ellipsis)
        let wotdShort = '-'
        let wotdAuthor = ''
        if (wotdRes.status === 'fulfilled' && wotdRes.value.ok) {
          const data = await wotdRes.value.json()
          const txt: string = data?.text || ''
          wotdShort = txt || data?.title || 'Word of the Day'
          wotdAuthor = data?.attribution || ''
        }

        // Admins count (may require super_admin; fallback to static)
        let totalAdmins = 0
        if (adminsRes.status === 'fulfilled' && adminsRes.value.ok) {
          const arr = await adminsRes.value.json()
          totalAdmins = Array.isArray(arr) ? arr.length : 0
          if (Array.isArray(arr)) setAdmins(arr)
        } else {
          try {
            const alt = await(await fetch('/data/admins.json')).json()
            totalAdmins = alt.filter((a: any) => a.status === 'active').length
            setAdmins(alt)
          } catch {}
        }

        // Audit log
        let recentActivity = 0
        let recent = [] as any[]
        if (auditRes.status === 'fulfilled' && auditRes.value.ok) {
          const logPayload = await auditRes.value.json()
          const items = Array.isArray(logPayload?.items) ? logPayload.items : []
          recentActivity = Number(logPayload?.total || items.length || 0)
          recent = items
        }

        setStats((s) => ({
          ...s,
          totalNews,
          totalEvents,
          totalSubscribers,
          totalAdmins,
          recentActivity,
          wotdShort,
          wotdAuthor,
        }))

        setRecentActivities(recent)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoadingRecent(false)
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
            {[
              {
                title: 'Total News',
                value: stats.totalNews,
                subtitle: 'Published articles',
                Icon: FileText,
                c: {
                  bar: 'bg-white/40',
                  customCardClass:
                    'bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 text-white',
                  iconBg: 'bg-white/20',
                  iconText: 'text-white',
                  valueText: 'text-white text-4xl md:text-5xl',
                  subtitleText: 'text-white/85',
                },
              },
              {
                title: 'Total Events',
                value: stats.totalEvents,
                subtitle: 'In the calendar',
                Icon: Calendar,
                c: {
                  bar: 'bg-white/40',
                  customCardClass:
                    'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 text-white',
                  iconBg: 'bg-white/20',
                  iconText: 'text-white',
                  valueText: 'text-white text-4xl md:text-5xl',
                  subtitleText: 'text-white/85',
                },
              },
              {
                title: 'Subscribed Emails',
                value: stats.totalSubscribers.toLocaleString(),
                subtitle: 'Newsletter subscribers',
                Icon: Users,
                c: {
                  bar: 'bg-white/40',
                  customCardClass:
                    'bg-gradient-to-br from-sky-600 via-cyan-500 to-teal-500 text-white',
                  iconBg: 'bg-white/20',
                  iconText: 'text-white',
                  valueText: 'text-white text-4xl md:text-5xl',
                  subtitleText: 'text-white/85',
                },
              },
              {
                title: 'Total Admins',
                value: stats.totalAdmins,
                subtitle: 'Administrators',
                Icon: ShieldCheck,
                c: {
                  bar: 'bg-white/40',
                  customCardClass:
                    'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-500 text-white',
                  iconBg: 'bg-white/20',
                  iconText: 'text-white',
                  valueText: 'text-white text-4xl md:text-5xl',
                  subtitleText: 'text-white/85',
                },
              },
            ].map(({ title, value, subtitle, Icon, c }) => (
              <Card
                key={title}
                className={`overflow-hidden border-0 shadow-sm transition-all duration-300 ${c.customCardClass} hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5 hover:ring-1 hover:ring-white/30`}
              >
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-0.5 pt-2.5 px-5'>
                  <div className='flex-1'>
                    <CardTitle className='text-sm font-medium'>
                      {title}
                    </CardTitle>
                    <div className='mt-1 h-px w-10 bg-white/40 rounded-full' />
                  </div>
                  <div className={`p-2.5 rounded-full ${c.iconBg}`}>
                    <Icon className={`h-6 w-6 ${c.iconText}`} />
                  </div>
                </CardHeader>

                <CardContent className='pt-0.5 pb-2.5 px-5'>
                  <div className={`font-bold ${c.valueText} truncate`}>
                    {value}
                  </div>
                  <p
                    className={
                      c.subtitleText ?? 'text-xs text-muted-foreground'
                    }
                  >
                    {subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA + Word of the Day side-by-side */}
          <div className='mb-8 flex flex-col lg:flex-row gap-6'>
            <OwlCta
              title='Need to post a quick update?'
              subtitle='Create a news article or announcement to share with the community.'
              buttonLabel='Create News'
              href='/admin/news'
              className='flex-1'
            />

            <div className='flex-1 relative overflow-hidden rounded-2xl border shadow-sm bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 dark:from-sky-900/20 dark:via-indigo-900/20 dark:to-emerald-900/20 px-5 md:px-6 py-5 md:py-6'>
              <div className='flex items-start gap-4'>
                <div className='p-2.5 rounded-full bg-white/60 dark:bg-white/10 ring-1 ring-black/5 dark:ring-white/10'>
                  <Sparkles className='h-5 w-5 text-indigo-600 dark:text-indigo-300' />
                </div>
                <div className='flex-1'>
                  <div className='text-slate-900 dark:text-slate-100 font-semibold'>
                    Word of the Day
                  </div>
                  <div className='mt-1 text-xs md:text-sm text-slate-600 dark:text-slate-300'>
                    <span className=''>{stats.wotdShort}</span>
                    {stats.wotdAuthor && (
                      <span className='ml-2 text-slate-500 dark:text-slate-400'>
                        — {stats.wotdAuthor}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
                {loadingRecent ? (
                  <div className='space-y-4'>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className='flex items-start gap-3'>
                        <div className='h-2 w-2 rounded-full bg-muted mt-2'></div>
                        <div className='flex-1'>
                          <div className='h-4 w-24 bg-muted rounded mb-2' />
                          <div className='h-3 w-40 bg-muted rounded mb-2' />
                          <div className='h-3 w-64 bg-muted rounded' />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='max-h-80 overflow-y-auto rounded-md border border-border/60'>
                    <div className='divide-y divide-border'>
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className='p-4 flex items-start gap-3'
                          >
                            <div className='h-2 w-2 rounded-full bg-primary mt-2'></div>
                            <div className='flex-1 space-y-1'>
                              <p className='text-sm font-medium'>
                                {activity.action}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {(() => {
                                  const a = admins.find(
                                    (x) => x.id === activity.adminId,
                                  )
                                  return `by ${
                                    a?.name ||
                                    a?.email ||
                                    activity.adminEmail ||
                                    'Unknown'
                                  }`
                                })()}
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
                        <div className='p-4 text-sm text-muted-foreground'>
                          No recent activity
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
