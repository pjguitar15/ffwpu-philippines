"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiCheck, FiPlus, FiMinus, FiX, FiTrash2 } from 'react-icons/fi'
import { shopItems, ShopItem } from '@/data/shop-items'

// Feature flag: toggle full catalog visibility
export const SHOW_SHOP_CATALOG = false
const items = shopItems

const categories: { key: ShopItem['category']; desc: string }[] = [
  { key: 'Holy Items', desc: 'Consecrated items used in sanctification and protection.' },
  { key: 'Scriptures & Texts', desc: 'Core teachings and collections.' },
  { key: 'Devotional Materials', desc: 'Aids for daily prayer and spiritual focus.' },
  { key: 'Blessing Keepsakes', desc: 'Memorial items tied to family Blessing traditions.' }
]

import { useCart } from '@/context/CartContext'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

function ProductCard({ item, onOpen }: { item: ShopItem; onOpen: (item: ShopItem) => void }) {
  const { add, remove, items: cartItems } = useCart()
  const [adding, setAdding] = useState(false)
  const statusStyles = item.status === 'Available'
    ? 'bg-green-100 text-green-700 border border-green-200'
    : 'bg-red-100 text-red-700 border border-red-200'
  const inCart = cartItems.some(ci => ci.id === item.id)
  return (
    <div
      className={cn(
        'group relative text-left w-[320px] lg:w-full flex-shrink-0 border bg-white/95 backdrop-blur p-6 rounded-md',
        'transition-colors hover:bg-white focus-within:ring-2 focus-within:ring-pink-300'
      )}
    >
      <div className="flex items-start gap-4">
        {item.image && (
          <div className="flex items-center justify-center bg-white border w-40 h-40 overflow-hidden">
            <Image
              src={item.image}
              alt={item.name + ' image'}
              width={160}
              height={160}
              className="object-contain scale-110"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 leading-snug">{item.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{item.description}</p>
          {item.note && (
            <p className="mt-2 text-[10px] uppercase tracking-wide text-amber-700 font-medium line-clamp-1">{item.note}</p>
          )}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className={cn('text-xs font-semibold px-2.5 py-1', statusStyles)}>{item.status}</span>
        <span className="text-sm font-medium text-slate-800">₱{item.price.toLocaleString()}</span>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="cursor-pointer text-[11px] px-3 py-2 border bg-gray-50 hover:bg-gray-100 flex items-center gap-1"
        >
          <FiCheck className="h-3 w-3" /> Details
        </button>
        {inCart ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-3 py-2 border bg-green-50 text-green-700 font-semibold flex items-center gap-1">
              <FiCheck className="h-3 w-3" /> Added to cart
            </span>
            <button
              type="button"
              onClick={() => {
                remove(item.id)
                toast({
                  title: 'Removed from cart',
                  description: `${item.name} removed.`,
                  icon: <FiTrash2 className="h-4 w-4" />,
                  image: item.image || undefined,
                })
              }}
              className="cursor-pointer text-[11px] px-3 py-2 border bg-red-50 hover:bg-red-100 text-red-700 font-semibold flex items-center gap-1"
              aria-label={`Remove ${item.name} from cart`}
            >
              <FiTrash2 className="h-3 w-3" /> Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={item.status !== 'Available' || adding}
            onClick={() => {
              if (item.status !== 'Available') return
              setAdding(true)
              add({ id: item.id, name: item.name, price: item.price })
              toast({
                title: 'Added to cart',
                description: `${item.name} added.`,
                icon: <FiShoppingCart className="h-4 w-4" />,
                image: item.image || undefined,
              })
              setTimeout(() => setAdding(false), 600)
            }}
            className={cn(
              'cursor-pointer text-[11px] px-3 py-2 border flex items-center gap-1 relative overflow-hidden',
              item.status === 'Available' ? 'bg-pink-50 hover:bg-pink-100' : 'bg-gray-100 text-gray-500 cursor-not-allowed',
              adding && 'animate-pulse'
            )}
          >
            {adding ? <FiCheck className="h-3 w-3 text-green-600" /> : <FiShoppingCart className="h-3 w-3" />} {adding ? 'Added' : 'Add'}
          </button>
        )}
      </div>
    </div>
  )
}

// Product card conditional add button

function ItemModal({ item, onClose }: { item: ShopItem | null; onClose: () => void }) {
  const { add, remove, items: cartItems, updateQty } = useCart()
  const [adding, setAdding] = useState(false)
  const existing = item ? cartItems.find(ci => ci.id === item.id) : null
  if (!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
  <div className="relative w-full max-w-3xl bg-white shadow-xl p-8 border cursor-default rounded-md" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-gray-100 hover:bg-gray-200 border rounded-sm cursor-pointer"
          aria-label="Close"
        >
          <FiX className="h-4 w-4" />
        </button>
        <div className="flex gap-5">
          {item.image && (
            <div className="flex items-center justify-center bg-white border w-56 h-56 overflow-hidden">
              <Image src={item.image} alt={item.name + ' image'} width={224} height={224} className="object-contain" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold mb-3">{item.name}</h2>
            <p className="text-base text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
            {item.note && <p className="text-xs text-amber-700 uppercase tracking-wide mb-4">{item.note}</p>}
            <div className="flex items-center gap-3 mt-2">
              <span
                className={cn(
                  'text-[11px] font-semibold px-2 py-1',
                  item.status === 'Available'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                )}
              >
                {item.status}
              </span>
              <span className="text-lg font-semibold">₱{item.price.toLocaleString()}</span>
            </div>
            {existing && (
              <div className="mt-4 border bg-slate-50 p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <FiShoppingCart className="h-4 w-4 text-pink-600" />
                  <span>In Cart</span>
                  <span className="text-[11px] font-normal text-slate-500">Adjust quantity below</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(existing.id, Math.max(1, existing.quantity - 1))}
                    className="cursor-pointer h-9 w-9 flex items-center justify-center border bg-white hover:bg-pink-50 text-sm font-medium"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={existing.quantity}
                    onChange={(e) => updateQty(existing.id, Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-9 w-16 border px-2 text-center text-sm bg-white"
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => updateQty(existing.id, existing.quantity + 1)}
                    className="cursor-pointer h-9 w-9 flex items-center justify-center border bg-white hover:bg-pink-50 text-sm font-medium"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-slate-600 ml-2">Total: ₱{(existing.quantity * item.price).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Note: We don't provide delivery at this time. Please claim your item directly at the Philippine Headquarters.
            Bring your payment receipt when claiming.
          </p>
          <div className="flex justify-between gap-3">
            <button
              onClick={onClose}
              className="text-xs font-medium px-4 py-2 border bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              Close
            </button>
            <div className="flex gap-3">
              {existing && (
                <button
                  type="button"
                  onClick={() => {
                    remove(existing.id)
                    toast({
                      title: 'Removed from cart',
                      description: `${item.name} removed.`,
                      icon: <FiTrash2 className="h-4 w-4" />,
                      image: item.image || undefined,
                    })
                  }}
                  className="cursor-pointer text-xs font-semibold px-4 py-2 border bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1"
                  aria-label="Remove from cart"
                >
                  <FiTrash2 className="h-4 w-4" /> Remove
                </button>
              )}
              <button
                onClick={() => {
                  if (existing) {
                    window.location.href = '/shop/cart'
                    return
                  }
                  if (item.status !== 'Available' || adding) return
                  setAdding(true)
                  add({ id: item.id, name: item.name, price: item.price })
                  toast({
                    title: 'Added to cart',
                    description: `${item.name} added.`,
                    icon: <FiShoppingCart className="h-4 w-4" />,
                    image: item.image || undefined,
                  })
                  setTimeout(() => setAdding(false), 600)
                }}
                disabled={!existing && (item.status !== 'Available' || adding)}
                className={cn(
                  'cursor-pointer text-xs font-semibold px-4 py-2 border flex items-center gap-1',
                  existing
                    ? 'bg-green-50 hover:bg-green-100 text-green-700'
                    : item.status === 'Available'
                      ? 'bg-pink-50 hover:bg-pink-100 text-pink-800'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed',
                  adding && !existing && 'animate-pulse'
                )}
              >
                {existing ? (
                  <>
                    <FiShoppingCart className="h-4 w-4" /> View Cart
                  </>
                ) : adding ? (
                  <>
                    <FiCheck className="h-4 w-4 text-green-600" /> Added
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  const { items: cartItems } = useCart()
  const cartParam = cartItems.length > 0 ? cartItems.map(i => `${i.id}:${i.quantity}`).join(',') : ''
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const [peekOpen, setPeekOpen] = React.useState(false)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  // Scroll lock & focus management & Escape close
  useEffect(() => {
    if (peekOpen) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // Focus the close button for accessibility (after paint)
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus()
      })
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setPeekOpen(false)
        }
      }
      window.addEventListener('keydown', onKey)
      return () => {
        window.removeEventListener('keydown', onKey)
        document.body.style.overflow = previousOverflow
      }
    }
  }, [peekOpen])
  const sampleItems = [
    { id: 'dp-textbook', name: 'Exposition of the Divine Principle', price: 850, note: 'Core Scripture', image: '/ffwpu-ph-logo.webp' },
    { id: 'holy-salt', name: 'Holy Salt (Vial)', price: 120, note: 'Sanctification', image: '/ffwpu-ph-logo.webp' },
    { id: 'cheon-seong-gyeong', name: 'Cheon Seong Gyeong', price: 1100, note: 'Holy Text', image: '/ffwpu-ph-logo.webp' },
  ]
  return (
    <main className="min-h-[60vh] pb-20 flex flex-col">
      {!SHOW_SHOP_CATALOG && (
        <div className="relative mx-auto mt-12 mb-10 max-w-3xl w-full text-center px-6">
          <div
            className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-white text-sm font-semibold shadow-[0_0_0_3px_rgba(255,255,255,0.4)] mb-7 overflow-hidden"
            aria-label="Shop status: coming soon"
          >
            <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                <span className="h-2 w-2 rounded-full bg-white/70" />
              </span>
              <span className="uppercase tracking-wider drop-shadow-sm">Coming Soon</span>
              <span className="ml-2 text-[10px] font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">Preview Mode</span>
            </span>
            <div className="absolute -inset-1 rounded-full ring-2 ring-pink-400/40 animate-[pulse_3s_ease_in_out_infinite]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-pink-700 to-rose-600">
            FFWPU PH Store
          </h1>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A forthcoming collection of Divine Principle texts, True Parents publications, and sacred items (holy salt, candles & more). All items will be available directly from the Philippine Headquarters (pickup only). Cart functionality is limited during this preview and does not represent a final ordering experience.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/" className="text-xs px-4 py-2 border bg-gray-50 hover:bg-gray-100 inline-flex items-center gap-1 rounded-sm">
              Return Home
            </Link>
            <button
              type="button"
              onClick={() => setPeekOpen(true)}
              className="group relative overflow-hidden text-xs font-semibold px-5 py-2 rounded-sm border border-pink-600 bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1">
                👀 Take a Peek
              </span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          {peekOpen && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="Preview: Sample Items">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPeekOpen(false)} />
              <div className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-white border shadow-xl rounded-none sm:rounded-md flex flex-col">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
                  <h2 className="text-base sm:text-xl font-semibold">Preview: Sample Items</h2>
                  <button
                    ref={closeBtnRef}
                    onClick={() => setPeekOpen(false)}
                    className="h-9 w-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 border rounded-sm text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-300"
                    aria-label="Close preview"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-4 sm:px-6 pt-4 pb-2 text-[11px] text-slate-600">This is a static preview of how items may appear. Pricing and availability subject to confirmation at launch.</div>
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {sampleItems.map(si => (
                      <div key={si.id} className="border bg-white rounded-md p-2 sm:p-3 flex flex-col gap-2">
                        <div className="w-full aspect-square flex items-center justify-center bg-white border overflow-hidden">
                          <Image src={si.image} alt={si.name} width={120} height={120} className="object-contain sm:scale-105" />
                        </div>
                        <p className="text-[11px] sm:text-xs font-semibold line-clamp-2">{si.name}</p>
                        {si.note && <p className="text-[9px] sm:text-[10px] uppercase tracking-wide text-pink-700 font-medium">{si.note}</p>}
                        <p className="text-[10px] sm:text-[11px] text-slate-600">₱{si.price.toLocaleString()}</p>
                        <div className="mt-auto">
                          <span className="inline-block text-[9px] sm:text-[10px] px-2 py-1 rounded bg-gradient-to-r from-pink-500 to-rose-600 text-white">Coming Soon</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-4 sm:px-6 pb-4 border-t flex justify-end">
                  <button
                    onClick={() => setPeekOpen(false)}
                    className="text-[11px] px-4 py-2 border bg-gray-50 hover:bg-gray-100"
                  >Close Preview</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {SHOW_SHOP_CATALOG && (
        <div className="mx-auto max-w-6xl w-full px-6 mt-12">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Family Federation Store</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <ProductCard key={item.id} item={item} onOpen={() => { /* modal open handled below */ }} />
            ))}
          </div>
          {/* Reintroduce modal trigger state when catalog enabled */}
        </div>
      )}
      {itemCount > 0 && (
        <Link
          href={cartParam ? `/shop/cart?cart=${encodeURIComponent(cartParam)}` : '/shop/cart'}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 border bg-pink-600 text-white px-4 py-3 shadow-lg hover:bg-pink-500 transition-colors rounded-full"
          aria-label="View cart"
        >
          <FiShoppingCart className="h-5 w-5" />
          <span className="text-sm font-semibold">Cart</span>
          <span className="ml-1 bg-white text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {itemCount}
          </span>
        </Link>
      )}
    </main>
  )
}
