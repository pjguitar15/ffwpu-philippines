import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generatePageMetadata, pageMetadataConfigs } from '@/lib/metadata'

export const metadata = generatePageMetadata(pageMetadataConfigs.privacy)

export default function PrivacyPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        <div className='container py-12'>
          <div className='max-w-4xl mx-auto space-y-8'>
            <div className='text-center space-y-4'>
              <h1 className='font-heading text-4xl font-bold'>
                Privacy Policy
              </h1>
              <p className='text-muted-foreground'>
                Last updated: August 24, 2025
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className='font-heading'>
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>
                  We collect information you provide directly to us, such as
                  when you:
                </p>
                <ul className='list-disc list-inside space-y-2 text-muted-foreground ml-4'>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us through our contact form</li>
                  <li>Participate in community events</li>
                  <li>Comment on articles or news posts</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='font-heading'>
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>
                  We use the information we collect to:
                </p>
                <ul className='list-disc list-inside space-y-2 text-muted-foreground ml-4'>
                  <li>Send you newsletters and community updates</li>
                  <li>
                    Respond to your inquiries and provide customer support
                  </li>
                  <li>Improve our website and services</li>
                  <li>Communicate about events and programs</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='font-heading'>
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy. We may share information with
                  trusted service providers who assist us in operating our
                  website and conducting our mission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='font-heading'>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction. However, no method of transmission
                  over the internet is 100% secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='font-heading'>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>You have the right to:</p>
                <ul className='list-disc list-inside space-y-2 text-muted-foreground ml-4'>
                  <li>Access and update your personal information</li>
                  <li>Unsubscribe from our newsletter at any time</li>
                  <li>Request deletion of your personal data</li>
                  <li>Contact us with any privacy concerns</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='font-heading'>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <div className='mt-4 space-y-2 text-muted-foreground'>
                  <p>Email: privacy@ffwpu.ph</p>
                  <p>Phone: +63 2 8123 4567</p>
                  <p>Address: 123 Peace Avenue, Quezon City, Philippines</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
