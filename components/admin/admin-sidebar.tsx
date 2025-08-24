"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, FileText, Mail, Megaphone, Globe, Users, Activity, LogOut, Shield, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  id: string
  email: string
  role: string
  name: string
}

export function AdminSidebar() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (user) {
      setAdminUser(JSON.parse(user))
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/admin/login")
  }

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/news", label: "News Management", icon: FileText },
    { href: "/admin/newsletters", label: "Newsletters", icon: Mail },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/global-news", label: "Global News", icon: Globe },
  ]

  const superAdminItems = [
    { href: "/admin/admins", label: "Admin Users", icon: Users },
    { href: "/admin/audit-log", label: "Audit Log", icon: Activity },
  ]

  if (!adminUser) return null

  return (
    <div className="w-64 bg-card border-r h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <div>
            <h2 className="font-heading font-bold">Admin Portal</h2>
            <p className="text-xs text-muted-foreground">FFWPU Philippines</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {adminUser.role === "super_admin" ? (
              <Shield className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{adminUser.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{adminUser.role.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}

        {adminUser.role === "super_admin" && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Super Admin</p>
              {superAdminItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.href} href={item.href}>
                    <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
