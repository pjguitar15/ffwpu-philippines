import Link from 'next/link'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { mainNavItems, type DropdownNavItem, type MainNavItem } from './header'

type NavItem = {
  href: string
  label: string
  [key: string]: any
}

function dedupe(items: NavItem[] | undefined | null): NavItem[] {
  if (!Array.isArray(items)) return []
  const seen = new Set<string>()
  return items.filter((i: NavItem) =>
    seen.has(i.href) ? false : (seen.add(i.href), true),
  )
}

function flattenNavItems(items: MainNavItem[]): NavItem[] {
  const flattened: NavItem[] = []

  items.forEach((item) => {
    // Add the main item
    flattened.push({
      href: item.href,
      label: item.label,
    })

    // Add dropdown items if they exist
    if (item.dropdown && item.dropdown.length > 0) {
      item.dropdown.forEach((dropdownItem: DropdownNavItem) => {
        flattened.push({
          href: dropdownItem.href,
          label: dropdownItem.label,
        })

        // Handle nested dropdown items (like Messages > Regional Director)
        if (dropdownItem.dropdown && dropdownItem.dropdown.length > 0) {
          dropdownItem.dropdown.forEach((nestedItem: DropdownNavItem) => {
            flattened.push({
              href: nestedItem.href,
              label: nestedItem.label,
            })
          })
        }
      })
    }
  })

  return flattened
}

export function Footer() {
  const allNavLinks: NavItem[] = dedupe(flattenNavItems(mainNavItems))

  // Split navigation links into two columns
  const midPoint = Math.ceil(allNavLinks.length / 2)
  const exploreLinks = allNavLinks.slice(0, midPoint)
  const moreLinks = allNavLinks.slice(midPoint)
  return (
    <footer className='border-t bg-muted/30'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12'>
        <div className='grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand / Mission */}
          <div className='space-y-4 max-w-md'>
            <Link href='/' className='inline-flex items-center space-x-3'>
              <Image
                src='/ffwpu-ph-logo.webp'
                alt='FFWPU Philippines Logo'
                width={130}
                height={130}
                className='h-auto w-[110px] sm:w-[120px] lg:w-[130px]'
                priority={false}
              />
            </Link>
            <p className='text-sm text-muted-foreground'>
              Building a world of peace, love, and unity through the teachings
              of True Parents.
            </p>
            {/* Socials */}
            <div className='pt-1'>
              <div
                className='flex items-center gap-3'
                aria-label='Social links'
              >
                <a
                  href='#'
                  aria-label='Facebook'
                  className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-background ring-1 ring-black/10 text-foreground/80 hover:text-foreground hover:ring-black/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400'
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
                  aria-label='YouTube'
                  className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-background ring-1 ring-black/10 text-foreground/80 hover:text-foreground hover:ring-black/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Navigation Column 1 */}
          <div>
            <nav className='space-y-4' aria-label='Navigate'>
              <h4 className='font-heading font-semibold'>Navigate</h4>
              <ul className='space-y-2 text-sm'>
                {exploreLinks.map((link: NavItem) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* Navigation Column 2 */}
          <div>
            <nav className='space-y-4' aria-label='More Links'>
              <h4 className='font-heading font-semibold'>More</h4>
              <ul className='space-y-2 text-sm'>
                {moreLinks.map((link: NavItem) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* Contact */}
          <div>
            <address className='not-italic space-y-4'>
              <h4 className='font-heading font-semibold'>Contact</h4>
              <div className='space-y-2 text-sm text-muted-foreground'>
                <p>Quezon City, Philippines</p>
                <p>
                  <a
                    href='mailto:familyfedphils@ffwpuph.com'
                    className='hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded'
                  >
                    familyfedphils@ffwpuph.com
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>
        <Separator className='my-8' />
        {/* bottom bar */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-3 px-1'>
          <p className='text-sm text-muted-foreground text-center md:text-left'>
            © {new Date().getFullYear()} Family Federation for World Peace and
            Unification Philippines. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
