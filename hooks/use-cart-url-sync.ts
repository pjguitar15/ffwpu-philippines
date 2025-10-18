"use client"
import { useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'

function serialize(items: { id: string; quantity: number }[]) {
  return items.map(i => `${i.id}:${i.quantity}`).join(',')
}

export function useCartUrlSync() {
  const { items } = useCart()
  const prevRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const param = items.length ? serialize(items) : null
    const url = new URL(window.location.href)
    const current = url.searchParams.get('cart')
    // Avoid unnecessary writes
    if (param === null) {
      if (current !== null) {
        url.searchParams.delete('cart')
        window.history.replaceState({}, '', url.toString())
        prevRef.current = null
      }
      return
    }
    if (current !== param) {
      url.searchParams.set('cart', param)
      window.history.replaceState({}, '', url.toString())
      prevRef.current = param
    }
  }, [items])
}
