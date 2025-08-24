import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Award } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-12 mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="font-heading text-4xl font-bold">Our History</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The journey of FFWPU Philippines began with the vision of True Parents to establish God's kingdom on
              earth, starting with the Philippines as a key nation in Asia.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-8 mb-16">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>

              <div className="space-y-12">
                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="font-heading">1975 - Foundation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        FFWPU Philippines was established as part of True Parents' global mission to spread the Divine
                        Principle teachings throughout Asia. The first missionaries arrived to begin building the
                        foundation.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="font-heading">1980s - Growth & Expansion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        The movement expanded throughout the Philippines with centers established in major cities. Local
                        Filipino leaders emerged to guide the growing community of blessed families.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="font-heading">1990s - Community Building</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Focus shifted to building strong local communities and families. Educational programs, youth
                        initiatives, and interfaith dialogue became central to our mission.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="font-heading">2000s - Present</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Today, FFWPU Philippines continues to grow with thousands of blessed families across the nation.
                        We focus on peace-building, family values, and contributing to Philippine society.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Current Impact */}
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h2 className="font-heading text-3xl font-bold mb-6">Our Impact Today</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Local Centers</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Blessed Families</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">45+</div>
                <p className="text-muted-foreground">Years of Service</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
