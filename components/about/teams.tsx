"use client"

interface TeamsProps {
  id?: string
}

const TEAMS = [
  {
    name: "Guest Experience",
    image: "/church-choir-singing.png",
    headline: "Honor our guests with the Guest Experience team",
    copy:
      "Be the first to welcome guests and make them feel at home — from the parking lot to greeting and helping families find seats.",
  },
  {
    name: "Production",
    image: "/church-community-gathering.png",
    headline: "Set the stage with our Production team",
    copy:
      "Help create meaningful worship experiences by serving with cameras, lyrics, lighting, and audio. No experience needed.",
  },
  {
    name: "Children & Youth",
    image: "/children-sunday-school.png",
    headline: "Shape the next generation",
    copy:
      "Serve children and youth through engaging lessons, worship, and activities that help them grow in faith and character.",
  },
  {
    name: "Central / Admin",
    image: "/placeholder.jpg",
    headline: "Support our mission behind the scenes",
    copy:
      "Assist with weekday operations and preparations that empower our ministry to impact communities nationwide.",
  },
  {
    name: "Online",
    image: "/peaceful-family-prayer.png",
    headline: "Serve our online community",
    copy:
      "Host in chat, pray for requests, and help our extended family feel seen and supported wherever they join from.",
  },
  {
    name: "Outreach",
    image: "/community-service-volunteers.png",
    headline: "Change lives through love in action",
    copy:
      "Partner with local organizations — from school support to relief efforts — and see the impact God makes through you.",
  },
]

export function Teams({ id }: TeamsProps) {
  return (
  <section id={id} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Find your Team</h2>
          <p className="mt-3 text-muted-foreground">
            Discover where your calling intersects with the needs of our community.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAMS.map((t) => (
            <article key={t.name} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt={t.name} className="w-full h-56 object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.headline}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
