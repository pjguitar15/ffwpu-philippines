'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  Calendar,
} from 'lucide-react'
import Image from 'next/image'

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
  const [ts, setTs] = useState<number>(() => Date.now())

  // Reset timestamp on mount (helps avoid stale form)
  useEffect(() => {
    setTs(Date.now())
  }, [])

  const serviceImg =
    'https://familyfedihq.org/wp-content/uploads/2024/03/ph-ss-1024x558.jpg'

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = { ...formData, ts, company: '', website: '' }
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success !== true) {
        throw new Error(json?.error || 'Failed to send message')
      }
      toast({
        title: 'Message Sent! 📧',
        description:
          "Thank you for reaching out. We'll get back to you within 24 hours.",
      })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTs(Date.now())
    } catch (err: any) {
      toast({
        title: 'Unable to send message',
        description: err?.message || 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const address = '32 Samar Avenue, Diliman, Quezon City'
  const mapsQuery = encodeURIComponent(address)
  const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed`
  const mapsLink = `https://www.google.com/maps?q=${mapsQuery}`

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>
        {/* HERO — side by side */}
        <SectionShell dark className='py-16 md:py-20 overflow-hidden'>
          <div className='mx-auto container px-4 sm:px-6'>
            <div className='grid items-start gap-10 lg:grid-cols-2'>
              {/* Left: title + copy */}
              <div className='space-y-6 relative'>
                <div
                  aria-hidden
                  className='pointer-events-none absolute -inset-24 -z-10'
                  style={{
                    background:
                      'radial-gradient(60rem 30rem at 70% 10%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(50rem 30rem at 0% 100%, rgba(99,102,241,0.22), transparent 60%)',
                  }}
                />
                <Eyebrow className='text-white/70'>
                  Contact • FFWPU Philippines
                </Eyebrow>
                <HighlightTitle
                  as='h1'
                  text='We’d love to hear from you'
                  highlightedText='hear from you'
                  className='text-4xl md:text-6xl text-white'
                  uppercase
                  gradientClassName='bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent'
                />
                <p className='text-white/80 max-w-xl'>
                  Have a question about FFWPU Philippines or our programs? Reach
                  out and we’ll respond shortly.
                </p>
              </div>

              {/* Right: the form card */}
              <Card className='relative overflow-hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-xl ring-1 ring-black/5'>
                <CardHeader className='relative'>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    We’ll reply as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className='relative'>
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Honeypot fields (visually hidden) */}
                    <div className='hidden' aria-hidden>
                      <label htmlFor='company'>Company</label>
                      <input
                        id='company'
                        name='company'
                        autoComplete='organization'
                        tabIndex={-1}
                      />
                      <label htmlFor='website'>Website</label>
                      <input
                        id='website'
                        name='website'
                        autoComplete='url'
                        tabIndex={-1}
                      />
                      <input type='hidden' name='ts' value={ts} readOnly />
                    </div>

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
                          className='bg-white'
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
                          className='bg-white'
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
                          className='bg-white'
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
                          className='bg-white'
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
                        className='bg-white'
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
        </SectionShell>

        {/* BELOW THE FOLD — rest of components */}

        <div className='container mx-auto px-4 sm:px-6 py-12'>
          {/* Contact Information & Sunday Service */}
          {/* Get in Touch — single line header + 2x2 info grid */}
          <CardContent className='relative pt-4'>
            {/* 1 col (mobile) → 2 cols (md) → 4 cols (lg) */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {/* Email */}
              <div className='space-y-2'>
                <div className='flex items-start gap-3'>
                  <Mail className='h-5 w-5 text-primary mt-0.5' />
                  <div>
                    <p className='font-medium'>Email</p>
                    <p className='text-sm text-muted-foreground'>
                      executivesec@ffwpuph.com
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      familyfedphils@ffwpuph.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className='space-y-2'>
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
              </div>

              {/* Address */}
              <div className='space-y-2'>
                <div className='flex items-start gap-3'>
                  <MapPin className='h-5 w-5 text-primary mt-0.5' />
                  <div>
                    <p className='font-medium'>Address</p>
                    <p className='text-sm text-muted-foreground'>
                      32 Samar Avenue, Diliman, Quezon City, Philippines
                    </p>
                    <div className='mt-2'>
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
              </div>

              {/* Office Hours */}
              <div className='space-y-2'>
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
              </div>
            </div>

            {/* socials */}
            <div className='mt-6 flex items-center gap-3 text-sm'>
              <span className='text-muted-foreground'>Follow us:</span>
              <Link
                href='https://facebook.com/ffwpuphils'
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

          {/* Sunday Service — encouraging CTA */}
          <Card className='mt-10 overflow-hidden p-0 ring-1 ring-slate-200/60'>
            <div className='grid md:grid-cols-2'>
              {/* Left: light blue gradient panel */}
              <div className='relative p-8 md:p-10 bg-gradient-to-br from-sky-50 via-blue-50 to-white'>
                <h3 className='text-2xl font-semibold tracking-tight text-slate-900'>
                  Sunday Service
                </h3>

                <div className='mt-3 flex flex-wrap gap-2 text-sm'>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-slate-800 ring-1 ring-sky-200'>
                    <Calendar className='h-4 w-4 text-slate-600' />
                    Every Sunday
                  </span>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-slate-800 ring-1 ring-sky-200'>
                    <Clock className='h-4 w-4 text-slate-600' />
                    10:00 AM – 12:00 PM
                  </span>
                </div>

                <p className='mt-4 text-slate-700'>
                  Quezon City Headquarters
                  <br />
                  32 Samar Avenue, Diliman, Quezon City
                </p>

                <p className='mt-2 text-slate-600 max-w-xl'>
                  Come as you are—experience uplifting worship, a warm welcome,
                  and fellowship with our community family.
                </p>

                <div className='mt-6 flex w-full md:w-auto gap-3'>
                  <Link
                    href={mapsLink}
                    target='_blank'
                    className='w-full md:w-auto'
                  >
                    <Button className='w-full md:w-auto rounded-xl bg-slate-900 text-white hover:bg-slate-800'>
                      Open in Google Maps
                    </Button>
                  </Link>
                  <Link
                    href={`${mapsLink}&dirflg=d`}
                    target='_blank'
                    className='w-full md:w-auto'
                  >
                    <Button className='w-full md:w-auto rounded-xl bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 hover:from-indigo-600 hover:to-sky-500'>
                      Get Directions
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: bright photo (no dark overlay) */}
              <div className='relative h-64 md:h-auto min-h-[280px] md:border-l md:border-slate-200/60'>
                <Image
                  src={serviceImg}
                  alt='FFWPU Philippines Sunday Service at Metro Manila Family Church'
                  fill
                  className='object-cover'
                  sizes='(min-width: 768px) 50vw, 100vw'
                  priority
                />
              </div>
            </div>
          </Card>

          {/* Map (kept as-is, below the Sunday Service card) */}

          {/* Map */}
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
                  <Link href={`${mapsLink}&dirflg=d`} target='_blank'>
                    <Button className='rounded-xl bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 hover:from-indigo-600 hover:to-sky-500 cursor-pointer'>
                      Get Directions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
