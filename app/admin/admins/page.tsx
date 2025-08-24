"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { loadJsonData } from "@/lib/data-loader"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Mail, Shield, Users, Edit, Trash2, CheckCircle } from "lucide-react"

interface Admin {
  id: string
  name: string
  email: string
  role: "super_admin" | "admin"
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin" as "super_admin" | "admin",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await loadJsonData<Admin>("/data/admins.json")
        setAdmins(data)
      } catch (error) {
        console.error("[v0] Failed to load admins:", error)
        toast({
          title: "Error",
          description: "Failed to load admin users",
          variant: "destructive",
        })
      }
    }

    loadAdmins()
  }, [toast])

  const handleCreate = () => {
    const newAdmin: Admin = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: "inactive",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setAdmins([...admins, newAdmin])
    setFormData({ name: "", email: "", role: "admin" })
    setIsCreating(false)

    toast({
      title: "Admin Created",
      description: `Verification email sent to ${formData.email}`,
    })
  }

  const handleStatusToggle = (id: string) => {
    setAdmins(
      admins.map((admin) => {
        if (admin.id === id) {
          const newStatus = admin.status === "active" ? "inactive" : "active"
          toast({
            title: "Status Updated",
            description: `Admin ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
          })
          return { ...admin, status: newStatus }
        }
        return admin
      }),
    )
  }

  const handleDelete = (id: string) => {
    setAdmins(admins.filter((admin) => admin.id !== id))
    toast({
      title: "Admin Deleted",
      description: "Admin user has been removed from the system",
      variant: "destructive",
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
              <h1 className="font-heading text-3xl font-bold">Admin Management</h1>
              <p className="text-muted-foreground">Manage admin users and permissions</p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>

          {/* Create Form */}
          {isCreating && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-heading">Add New Admin</CardTitle>
                <CardDescription>Create a new admin user account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "super_admin" | "admin") => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate} className="cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setFormData({ name: "", email: "", role: "admin" })
                    }}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admins List */}
          <div className="space-y-4">
            {admins.map((admin) => (
              <Card key={admin.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading font-semibold">{admin.name}</h3>
                          <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                            <Shield className="h-3 w-3 mr-1" />
                            {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                          </Badge>
                          <Badge variant={admin.status === "active" ? "default" : "outline"}>{admin.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{admin.email}</span>
                          <span>Last login: {admin.lastLogin}</span>
                          <span>Created: {new Date(admin.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusToggle(admin.id)}
                        className="cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="cursor-pointer">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(admin.id)}
                        className="cursor-pointer text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-heading text-xl font-semibold mb-2">No Admin Users</h3>
              <p className="text-muted-foreground mb-6">Add your first admin user to get started.</p>
              <Button onClick={() => setIsCreating(true)} className="cursor-pointer">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
