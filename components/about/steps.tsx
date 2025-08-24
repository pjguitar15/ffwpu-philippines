"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StepsProps {
  id?: string
}

const steps = [
  {
    title: "Explore the teams",
    body:
      "Learn about different volunteer teams and find one that aligns with your gifts — from guest welcome to media, teaching, outreach, and more.",
  },
  {
    title: "Register for orientation",
    body:
      "Sign up for an e101-style orientation to discover roles and next steps. We’ll help you get connected quickly.",
  },
  {
    title: "Begin to serve",
    body:
      "Start serving and see God work through you as you help build a loving community for families across the Philippines.",
  },
]

export function Steps({ id }: StepsProps) {
  return (
  <section id={id} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Impact others and build the church</h2>
          <p className="mt-3 text-muted-foreground">
            Follow these simple steps to discover volunteer opportunities that fit your skills and schedule.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="p-6 border rounded-lg bg-white shadow-sm">
              <div className="text-primary text-sm font-semibold">Step {i + 1}</div>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" className="cursor-pointer">
            <Link href="/contact">Register for Orientation</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
