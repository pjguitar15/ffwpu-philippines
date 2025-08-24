"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Sparkles } from "lucide-react"

interface EnhancedNewsletterSignupProps {
  variant?: "default" | "compact" | "hero"
  className?: string
}

export function EnhancedNewsletterSignup({ variant = "default", className }: EnhancedNewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const triggerConfetti = () => {
    // Simple confetti effect simulation
    // In a real app, you'd use a library like canvas-confetti
    const confettiColors = ["#0891b2", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

    // Create confetti elements
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div")
      confetti.style.position = "fixed"
      confetti.style.left = Math.random() * 100 + "vw"
      confetti.style.top = "-10px"
      confetti.style.width = "10px"
      confetti.style.height = "10px"
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      confetti.style.pointerEvents = "none"
      confetti.style.zIndex = "9999"
      confetti.style.borderRadius = "50%"

      document.body.appendChild(confetti)

      // Animate confetti falling
      const animation = confetti.animate(
        [
          { transform: "translateY(-10px) rotate(0deg)", opacity: 1 },
          { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 },
        ],
        {
          duration: 3000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
      )

      animation.onfinish = () => confetti.remove()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Trigger confetti celebration
    triggerConfetti()

    // Show success toast
    toast({
      title: "Welcome to our family! 🎉",
      description: `Thank you ${name || "friend"} for joining our newsletter. You'll receive weekly inspiration and updates.`,
    })

    setIsSubscribed(true)
    setEmail("")
    setName("")
    setIsLoading(false)

    // Reset subscription state after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000)
  }

  if (isSubscribed) {
    return (
      <Card className={`border-primary/20 bg-primary/5 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-primary">Successfully Subscribed!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Check your email for a welcome message and your first newsletter.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-col sm:flex-row gap-2 max-w-md ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button onClick={handleSubmit} disabled={isLoading} className="whitespace-nowrap">
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <Card className={`border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 ${className}`}>
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl">Join Our Community</CardTitle>
          <CardDescription className="text-base">
            Receive weekly inspiration, community updates, and spiritual guidance directly in your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe to Newsletter
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="font-heading">Stay Connected</CardTitle>
        <CardDescription>Receive weekly inspiration and updates from our community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
