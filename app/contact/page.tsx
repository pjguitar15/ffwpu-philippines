'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Eyebrow } from '@/components/ui/eyebrow'
import { HighlightTitle } from '@/components/ui/highlight-title'
import { SectionShell } from '@/components/ui/section-shell'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock send (EmailJS/your API can replace this)
    await new Promise((r) => setTimeout(r, 1200))

    toast({
      title: 'Message Sent! 📧',
      description:
        "Thank you for reaching out. We'll get back to you within 24 hours.",
    })

    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setIsLoading(false)
  }

  const address = '32 Samar Avenue, Diliman, Quezon City'
  const mapsQuery = encodeURIComponent(address)
  const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed`
  const mapsLink = `https://www.google.com/maps?q=${mapsQuery}`

  return (
    <div className='min-h-screen flex flex-col'>

      {/* HERO (dark) */}
      <SectionShell dark className='py-16 md:py-24 overflow-hidden'>
        <div className='max-w-5xl mx-auto text-center space-y-6 relative'>
          {/* soft gradient wash for hero */}
          <div
            aria-hidden
            className='pointer-events-none absolute -inset-24 -z-10'
            style={{
              background:
                'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.22), transparent 60%)',
            }}
          />
          <Eyebrow>Contact • FFWPU Philippines</Eyebrow>
          <HighlightTitle
            as='h1'
            text='We’d love to hear from you'
            highlightedText='hear from you'
            className='text-4xl md:text-6xl text-white'
            uppercase
            gradientClassName='bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent'
          />
          <p className='text-white/80 max-w-2xl mx-auto'>
            Questions about our community, events, or Cheon Shim Won? Send us a
            message and our team will get back to you.
          </p>
        </div>
      </SectionShell>

      {/* CONTENT (light) */}
      <main className='flex-1'>
        <div className='container py-12 mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Contact Information (with subtle color) */}
            <div className='space-y-6'>
              <Card className='relative overflow-hidden'>
                <div className='absolute -inset-6 blur-2xl' />
                <CardHeader className='relative'>
                  <CardTitle className='flex items-center gap-2'>
                    <MessageCircle className='h-5 w-5 text-primary' />
                    Get in Touch
                  </CardTitle>
                  <CardDescription>
                    Reach out to our community leaders and staff
                  </CardDescription>
                </CardHeader>
                <CardContent className='relative space-y-4'>
                  <div className='flex items-start gap-3'>
                    <Mail className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <p className='font-medium'>Email</p>
                      <p className='text-sm text-muted-foreground'>
                        info@ffwpu.ph
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        admin@ffwpu.ph
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Phone className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <p className='font-medium'>Phone</p>
                      <p className='text-sm text-muted-foreground'>
                        +63 2 8123 4567
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        +63 917 123 4567
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <MapPin className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <p className='font-medium'>Address</p>
                      <p className='text-sm text-muted-foreground'>
                        32 Samar Avenue, Diliman, Quezon City, Philippines
                      </p>
                      <div className='mt-2 flex gap-2'>
                        <Link
                          href={mapsLink}
                          target='_blank'
                          className='text-sm underline underline-offset-4'
                        >
                          Open in Google Maps
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Clock className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <p className='font-medium'>Office Hours</p>
                      <p className='text-sm text-muted-foreground'>
                        Mon–Fri: 9:00 AM – 6:00 PM
                        <br />
                        Sat: 9:00 AM – 4:00 PM
                        <br />
                        Sun: After Service (12:00 PM – 2:00 PM)
                      </p>
                    </div>
                  </div>

                  <div className='pt-2 flex items-center gap-3 text-sm'>
                    <span className='text-muted-foreground'>Follow us:</span>
                    <Link
                      href='https://facebook.com'
                      target='_blank'
                      className='inline-flex items-center gap-1 hover:underline'
                    >
                      <Facebook className='h-4 w-4' /> Facebook
                    </Link>
                    <span>•</span>
                    <Link
                      href='https://instagram.com'
                      target='_blank'
                      className='inline-flex items-center gap-1 hover:underline'
                    >
                      <Instagram className='h-4 w-4' /> Instagram
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Sunday Service Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Sunday Service</CardTitle>
                  <CardDescription>
                    Join us for weekly worship and fellowship
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p className='font-medium'>Every Sunday at 10:00 AM</p>
                    <p className='text-sm text-muted-foreground'>
                      Quezon City Headquarters
                      <br />
                      32 Samar Avenue, Diliman, Quezon City
                    </p>
                    <p className='text-sm text-muted-foreground mt-3'>
                      All are welcome! Come as you are and experience the love
                      of our community family.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className='lg:col-span-2'>
              <Card className='relative overflow-hidden'>
                <div className='absolute -inset-6  blur-2xl' />
                <CardHeader className='relative'>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    We’ll reply as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className='relative'>
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Full Name *</Label>
                        <Input
                          id='name'
                          name='name'
                          type='text'
                          placeholder='Your full name'
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='email'>Email Address *</Label>
                        <Input
                          id='email'
                          name='email'
                          type='email'
                          placeholder='your.email@example.com'
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='phone'>Phone Number</Label>
                        <Input
                          id='phone'
                          name='phone'
                          type='tel'
                          placeholder='+63 917 123 4567'
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='subject'>Subject *</Label>
                        <Input
                          id='subject'
                          name='subject'
                          type='text'
                          placeholder='What is this regarding?'
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='message'>Message *</Label>
                      <Textarea
                        id='message'
                        name='message'
                        placeholder='Please share your message, questions, or how we can help you...'
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <Button
                      type='submit'
                      className='w-full bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 hover:from-slate-800 hover:to-indigo-600'
                      size='lg'
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className='mr-2 h-4 w-4' />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className='text-xs text-muted-foreground'>
                      * Required fields. We respect your privacy and will never
                      share your information.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Interactive Map (works) */}
          <div className='mt-12'>
            <Card className='relative overflow-hidden'>
              <div className='absolute -inset-6 blur-2xl' />
              <CardHeader className='relative'>
                <CardTitle>Find Us</CardTitle>
                <CardDescription>
                  Visit our headquarters in Quezon City
                </CardDescription>
              </CardHeader>
              <CardContent className='relative'>
                <div className='aspect-video rounded-lg overflow-hidden ring-1 ring-black/10'>
                  <iframe
                    title='FFWPU Philippines Location'
                    src={mapsEmbed}
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    className='w-full h-full border-0'
                    allowFullScreen
                  />
                </div>
                <div className='mt-3 flex items-center gap-3'>
                  <Link href={mapsLink} target='_blank'>
                    <Button variant='outline' className='rounded-xl'>
                      Open in Google Maps
                    </Button>
                  </Link>
                  <Link href={`${mapsLink}&dirflg=d`} target='_blank'>
                    <Button className='rounded-xl bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 hover:from-indigo-600 hover:to-sky-500'>
                      Get Directions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info (slight color) */}
          <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card className='relative overflow-hidden'>
              <div className='absolute -inset-10 bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-cyan-500/10 blur-2xl' />
              <CardHeader className='relative'>
                <CardTitle>New to FFWPU?</CardTitle>
              </CardHeader>
              <CardContent className='relative'>
                <p className='text-muted-foreground mb-4'>
                  If you're new to our community, we'd love to welcome you! Our
                  doors are open to those seeking spiritual growth, meaningful
                  relationships, and a life of service to others.
                </p>
                <Button variant='outline' className='w-full bg-transparent'>
                  Learn About Our Community
                </Button>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden'>
              <div className='absolute -inset-10 bg-gradient-to-tr from-fuchsia-500/10 via-pink-500/10 to-rose-500/10 blur-2xl' />
              <CardHeader className='relative'>
                <CardTitle>Prayer Requests</CardTitle>
              </CardHeader>
              <CardContent className='relative'>
                <p className='text-muted-foreground mb-4'>
                  Our community believes in the power of prayer. If you have a
                  special intention or need spiritual support, please don't
                  hesitate to share your prayer request with us.
                </p>
                <Button variant='outline' className='w-full bg-transparent'>
                  Submit Prayer Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
