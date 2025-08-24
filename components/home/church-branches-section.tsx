"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ChurchBranchesSection() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-heading text-3xl font-bold text-slate-800">VISIT US ON SUNDAY</h2>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Metro Manila",
            venue: "FFWPU Manila Center",
            address: "123 Quezon Ave, Quezon City, Metro Manila",
          },
          { title: "Cebu", venue: "FFWPU Cebu Center", address: "456 Colon St, Cebu City, Cebu" },
          { title: "Davao", venue: "FFWPU Davao Center", address: "789 Rizal St, Davao City, Davao del Sur" },
        ].map((b) => (
          <Card key={b.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-slate-800">{b.title}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-slate-700">Day:</span> Every Sunday
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Time:</span> 10:00am-12:00pm
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Venue:</span> {b.venue}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Address:</span> {b.address}
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer" asChild>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                  GET DIRECTIONS
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
