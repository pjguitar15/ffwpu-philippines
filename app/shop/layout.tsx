import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spiritual Shop',
  description: 'Informational listing of holy items, scriptures, and devotional materials.',
}
import { CartProvider } from '@/context/CartContext'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider><div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-slate-50 to-blue-50/30">{children}</div></CartProvider>
}
