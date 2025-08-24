"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Lock, Mail, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Mock authentication - in a real app, this would be proper authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email === "superadmin@ffwpu.ph" && password === "admin123") {
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: "u1",
          email: "superadmin@ffwpu.ph",
          role: "super_admin",
          name: "Super Admin",
        }),
      )
      toast({
        title: "Welcome back! 👋",
        description: "Successfully logged in as Super Admin.",
      })
      router.push("/admin/dashboard")
    } else if (email === "admin1@ffwpu.ph" && password === "admin123") {
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: "u2",
          email: "admin1@ffwpu.ph",
          role: "admin",
          name: "Rev. Ronnie Sodusta",
        }),
      )
      toast({
        title: "Welcome back! 👋",
        description: "Successfully logged in as Admin.",
      })
      router.push("/admin/dashboard")
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please check your credentials and try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">Admin Portal</h1>
              <p className="text-muted-foreground">FFWPU Philippines CMS</p>
            </div>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@ffwpu.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Demo Credentials:</h4>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>
                    <strong>Super Admin:</strong> superadmin@ffwpu.ph / admin123
                  </p>
                  <p>
                    <strong>Admin:</strong> admin1@ffwpu.ph / admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
