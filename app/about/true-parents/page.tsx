import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Crown, Globe2, BookOpen } from "lucide-react"
import Image from "next/image"

export default function TrueParentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-12 mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="font-heading text-4xl font-bold">True Parents</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Rev. Sun Myung Moon and Hak Ja Han Moon, the True Parents of humanity, dedicated their lives to
              establishing God's ideal of true love and world peace.
            </p>
          </div>

          {/* True Parents Image */}
          <div className="text-center mb-16">
            <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/true-parents-portrait.jpg"
                alt="True Parents - Rev. Sun Myung Moon and Hak Ja Han Moon"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Core Teachings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-4" />
                <CardTitle className="font-heading">True Love</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  True Love is love that gives, forgets that it has given, and continues to give. It is the love that
                  seeks to benefit others before oneself, the foundation of God's ideal for humanity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Crown className="h-8 w-8 text-primary mb-4" />
                <CardTitle className="font-heading">True Family</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The ideal family centered on God, where parents and children live in harmony, practicing true love and
                  creating the foundation for a peaceful world.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe2 className="h-8 w-8 text-primary mb-4" />
                <CardTitle className="font-heading">One Family Under God</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The vision of all humanity living as one family under God, transcending barriers of race, religion,
                  and nationality to create lasting world peace.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-4" />
                <CardTitle className="font-heading">Divine Principle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The revelation of God's purpose for creation and the path to restore humanity to its original
                  relationship with God through true love.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Legacy Section */}
          <div className="bg-muted/30 rounded-lg p-8 mb-16">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="font-heading text-3xl font-bold">Their Legacy</h2>
              <p className="text-lg text-muted-foreground">
                "We have come as the True Parents to teach you about true love. We want you to become true people who
                can form true families and build a true nation and world."
              </p>
              <p className="text-muted-foreground">
                Through their teachings and example, True Parents have guided millions of people worldwide toward the
                path of true love, true family, and world peace. Their legacy continues through the blessed families and
                communities they have established around the globe.
              </p>
            </div>
          </div>

          {/* Mission Accomplishments */}
          <div className="text-center space-y-8">
            <h2 className="font-heading text-3xl font-bold">Mission Accomplishments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">400,000+</div>
                <p className="text-muted-foreground">Blessing Ceremonies</p>
                <p className="text-sm text-muted-foreground">Couples blessed in marriage</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">194</div>
                <p className="text-muted-foreground">Nations</p>
                <p className="text-sm text-muted-foreground">Countries with FFWPU presence</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">50+</div>
                <p className="text-muted-foreground">Years</p>
                <p className="text-sm text-muted-foreground">Of global peace mission</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
