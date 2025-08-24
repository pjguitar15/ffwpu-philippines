import Link from 'next/link'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

// Keep footer links in sync with Header:
const mainNavItems = [
  { href: '/holy-mother-han', label: 'Holy Mother Han' },
  { href: '/about', label: 'About' },
  { href: '/news', label: 'News' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/contact', label: 'Contact' },
]

const extraNavItems = [
  { href: '/global-news', label: 'Global News' },
  { href: '/contact', label: 'Contact' }, // duplicate; we’ll dedupe
  { href: '/about/history', label: 'Our History' },
  { href: '/about/true-parents', label: 'True Parents' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

// Optional: keep your existing non-header link(s)
const otherItems = [{ href: '/articles', label: 'Articles' }]

function dedupe(items: { href: string; label: string }[]) {
  const seen = new Set<string>()
  return items.filter((i) =>
    seen.has(i.href) ? false : (seen.add(i.href), true),
  )
}

export function Footer() {
  const explore = dedupe(mainNavItems)
  const more = dedupe(extraNavItems)
  const showOther = otherItems // keep if you still want Articles in the footer

  return (
    <footer className='border-t bg-muted/30'>
      <div className='container py-12 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo + blurb */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='flex flex-col'>
                <Image
                  src='/ffwpu-ph-logo.png'
                  alt='FFWPU Philippines Logo'
                  width={130}
                  height={130}
                />
              </div>
            </div>
            <p className='text-sm text-muted-foreground max-w-xs'>
              Building a world of peace, love, and unity through the teachings
              of True Parents.
            </p>
          </div>

          {/* Explore (main header links) */}
          <div className='space-y-4'>
            <h4 className='font-heading font-semibold'>Explore</h4>
            <ul className='space-y-2 text-sm'>
              {explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Keep Articles if you want it here */}
              {showOther.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More (drawer-only header links) */}
          <div className='space-y-4'>
            <h4 className='font-heading font-semibold'>More</h4>
            <ul className='space-y-2 text-sm'>
              {more
                .filter((l) => !explore.some((e) => e.href === l.href)) // avoid duplicates (e.g., /contact)
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact */}
          <div className='space-y-4'>
            <h4 className='font-heading font-semibold'>Contact</h4>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <p>Quezon City, Philippines</p>
              <p>info@ffwpu.ph</p>
              <div className='flex space-x-4 pt-2'>
                <a
                  href='#'
                  className='hover:text-foreground transition-colors'
                  aria-label='Facebook'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='hover:text-foreground transition-colors'
                  aria-label='YouTube'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                  </svg>
                </a>
                <a
                  href='#'
                  className='hover:text-foreground transition-colors'
                  aria-label='Instagram'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447c0-1.297.49-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.807.875 1.297 2.026 1.297 3.323 0 1.297-.49 2.448-1.297 3.323-.875.807-2.026 1.297-3.323 1.297z' />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className='my-8' />

        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <p className='text-sm text-muted-foreground'>
            © 2025 Family Federation for World Peace and Unification
            Philippines. All rights reserved.
          </p>
          <div className='flex space-x-4 text-sm'>
            <Link
              href='/privacy'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
