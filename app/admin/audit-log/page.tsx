"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, User, Clock } from "lucide-react"

interface AuditLogEntry {
  id: string
  adminId: string
  action: string
  details: string
  timestamp: string
}

interface Admin {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminAuditLogPage() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [auditRes, adminsRes] = await Promise.all([fetch("/data/auditLog.json"), fetch("/data/admins.json")])

        const [auditData, adminsData] = await Promise.all([auditRes.json(), adminsRes.json()])

        setAuditLog(auditData.reverse()) // Show newest first
        setAdmins(adminsData)
      } catch (error) {
        console.error("Failed to load audit log:", error)
      }
    }

    loadData()
  }, [])

  const getAdminName = (adminId: string) => {
    const admin = admins.find((a) => a.id === adminId)
    return admin ? admin.name : "Unknown Admin"
  }

  const getAdminRole = (adminId: string) => {
    const admin = admins.find((a) => a.id === adminId)
    return admin ? admin.role : "unknown"
  }

  const getActionColor = (action: string) => {
    if (action.includes("Created")) return "default"
    if (action.includes("Updated")) return "secondary"
    if (action.includes("Deleted")) return "destructive"
    if (action.includes("Published")) return "default"
    return "outline"
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold">Audit Log</h1>
            <p className="text-muted-foreground">Track all administrative actions and changes</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Total Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLog.length}</div>
                <p className="text-xs text-muted-foreground">All recorded actions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Active Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{admins.filter((a) => a.role === "admin").length}</div>
                <p className="text-xs text-muted-foreground">Regular administrators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    auditLog.filter((entry) => {
                      const entryDate = new Date(entry.timestamp)
                      const today = new Date()
                      const diffTime = Math.abs(today.getTime() - entryDate.getTime())
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return diffDays <= 7
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Actions this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log Table */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Complete history of administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{getAdminName(entry.adminId)}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {getAdminRole(entry.adminId).replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionColor(entry.action) as any}>{entry.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{entry.details}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{new Date(entry.timestamp).toLocaleString()}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {auditLog.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No audit log entries found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
