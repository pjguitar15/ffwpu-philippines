import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="font-heading text-4xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: August 24, 2025</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using the FFWPU Philippines website, you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Use License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Permission is granted to temporarily download one copy of the materials on FFWPU Philippines' website
                  for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
                  of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">User Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  When you post comments or other content on our website, you grant us a non-exclusive, royalty-free
                  license to use, reproduce, and display such content. You are responsible for ensuring that your
                  content does not violate any laws or infringe on the rights of others.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  To maintain a respectful and peaceful community, we ask that all users:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Treat others with respect and kindness</li>
                  <li>Avoid offensive, inappropriate, or harmful content</li>
                  <li>Respect different viewpoints and beliefs</li>
                  <li>Use appropriate language in all communications</li>
                  <li>Report any violations of these guidelines</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The materials on FFWPU Philippines' website are provided on an 'as is' basis. FFWPU Philippines makes
                  no warranties, expressed or implied, and hereby disclaims and negates all other warranties including
                  without limitation, implied warranties or conditions of merchantability, fitness for a particular
                  purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In no event shall FFWPU Philippines or its suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                  use or inability to use the materials on FFWPU Philippines' website, even if FFWPU Philippines or its
                  authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 space-y-2 text-muted-foreground">
                  <p>Email: legal@ffwpu.ph</p>
                  <p>Phone: +63 2 8123 4567</p>
                  <p>Address: 123 Peace Avenue, Quezon City, Philippines</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
