"use client"
import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { FiTrash2, FiArrowRight, FiShoppingCart } from 'react-icons/fi'
import { shopItems } from '@/data/shop-items'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

const itemMeta: Record<string, { image?: string; price: number; name: string }> = shopItems.reduce((acc, cur) => {
  acc[cur.id] = { image: cur.image, price: cur.price, name: cur.name }
  return acc
}, {} as Record<string, { image?: string; price: number; name: string }>)

export default function CartPage() {
  const { items, remove, updateQty, clear, total } = useCart()
  const [pendingRemove, setPendingRemove] = useState<string | null>(null)
  const targetItem = items.find(i => i.id === pendingRemove) || null
  const renderItems = items
  const cartParam = renderItems.length > 0 ? renderItems.map(i => `${i.id}:${i.quantity}`).join(',') : ''
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="max-w-3xl mx-auto p-6">
  <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">Cart <span className="text-sm font-normal text-slate-500">({renderItems.length} items)</span></h1>
  {renderItems.length === 0 ? (
        <div className="border p-8 text-center bg-white">
          <p className="text-sm text-slate-600 mb-4">Your cart is empty.</p>
          <Link href={cartParam ? `/shop?cart=${encodeURIComponent(cartParam)}` : '/shop'} className="text-xs px-4 py-2 border bg-pink-50 hover:bg-pink-100 inline-block">Return to Shop</Link>
        </div>
      ) : (
        <>
        <div className="space-y-6">
          <div className="border divide-y bg-white">
            {renderItems.map((i) => {
              const meta = itemMeta[i.id] || {}
              return (
                <div key={i.id} className="flex items-center gap-4 p-4">
                  {meta.image && (
                    <div className="w-20 h-20 flex items-center justify-center bg-white border overflow-hidden">
                      <Image src={meta.image} alt={i.name} width={80} height={80} className="object-contain" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{i.name}</p>
                    <p className="text-xs text-slate-500">₱{i.price.toLocaleString()}</p>
                  </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(i.id, Math.max(1, i.quantity - 1))}
                    className="h-8 w-8 flex items-center justify-center border bg-gray-50 hover:bg-gray-100 text-xs"
                    aria-label={`Decrease quantity of ${i.name}`}
                  >-
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={i.quantity}
                    onChange={(e) => updateQty(i.id, Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 border px-2 py-1 text-sm bg-white text-center"
                    aria-label={`Quantity of ${i.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => updateQty(i.id, i.quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center border bg-gray-50 hover:bg-gray-100 text-xs"
                    aria-label={`Increase quantity of ${i.name}`}
                  >+
                  </button>
                  <button
                    onClick={() => setPendingRemove(i.id)}
                    className="p-2 border bg-gray-50 hover:bg-red-50 text-red-600 cursor-pointer"
                    aria-label={`Remove ${i.name}`}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (items.length === 0) return
                clear()
                toast({
                  title: 'Cart cleared',
                  description: 'All items removed from cart.',
                  icon: <FiShoppingCart className="h-4 w-4" />,
                })
              }}
              className="text-xs px-3 py-2 border bg-gray-50 hover:bg-gray-100"
            >Clear Cart</button>
            <div className="text-right">
              <p className="text-sm font-semibold">Subtotal: ₱{subtotal.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-2 justify-end">
                <Link href="/shop/checkout" className="inline-flex items-center gap-1 text-xs px-4 py-2 border bg-pink-50 hover:bg-pink-100">
                  Checkout <FiArrowRight className="h-3 w-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const url = new URL(window.location.href)
                    if (cartParam) {
                      url.searchParams.set('cart', cartParam)
                    } else {
                      url.searchParams.delete('cart')
                    }
                    const shareLink = url.toString()
                    navigator.clipboard.writeText(shareLink).then(() => {
                      toast({
                        title: 'Cart link copied',
                        description: 'You can share your cart using the copied link.',
                        icon: <FiShoppingCart className="h-4 w-4" />,
                      })
                    }).catch(() => {
                      toast({
                        title: 'Copy failed',
                        description: 'Unable to copy cart link. Please try again.',
                        icon: <FiShoppingCart className="h-4 w-4" />,
                      })
                    })
                  }}
                  className="inline-flex items-center gap-1 text-[11px] px-3 py-2 border bg-gray-50 hover:bg-gray-100"
                >Copy Cart Link</button>
              </div>
              <div className="mt-3">
                <Link href={cartParam ? `/shop?cart=${encodeURIComponent(cartParam)}` : '/shop'} className="text-[11px] underline text-slate-600 hover:text-slate-800">Continue shopping</Link>
              </div>
            </div>
          </div>
        </div>
        {pendingRemove && targetItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPendingRemove(null)} />
            <div className="relative w-full max-w-sm bg-white border shadow-lg p-6 rounded-md">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">Confirm Removal</h2>
              <p className="text-xs text-slate-600 mb-4">Remove <span className="font-medium">{targetItem.name}</span> from cart?</p>
              <div className="flex items-center gap-3 mb-4">
                {itemMeta[targetItem.id]?.image && (
                  <div className="w-16 h-16 flex items-center justify-center bg-white border overflow-hidden">
                    <Image src={itemMeta[targetItem.id]!.image!} alt={targetItem.name} width={64} height={64} className="object-contain" />
                  </div>
                )}
                <div className="text-[11px] text-slate-500 leading-snug">
                  <p>Quantity: {targetItem.quantity}</p>
                  <p>Line Total: ₱{(targetItem.quantity * targetItem.price).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPendingRemove(null)}
                  className="text-[11px] px-3 py-2 border bg-gray-50 hover:bg-gray-100 cursor-pointer"
                >Cancel</button>
                <button
                  onClick={() => {
                    remove(targetItem.id)
                    setPendingRemove(null)
                    toast({
                      title: 'Removed from cart',
                      description: `${targetItem.name} removed.`,
                      icon: <FiTrash2 className="h-4 w-4" />,
                      image: itemMeta[targetItem.id]?.image || undefined,
                    })
                  }}
                  className="text-[11px] px-3 py-2 border bg-red-50 hover:bg-red-100 text-red-700 font-semibold cursor-pointer"
                >Remove</button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  )
}
