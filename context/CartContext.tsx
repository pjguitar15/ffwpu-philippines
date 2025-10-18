"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { shopItems } from '@/data/shop-items'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  remove: (id: string) => void
  clear: () => void
  updateQty: (id: string, qty: number) => void
  total: number
  hydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function parseCartParam(param: string | null): CartItem[] {
  if (!param) return []
  // format: id:qty:id:qty (allow comma or semicolon or pipe) but we'll standardize to comma
  const parts = param.split(',').map(p => p.trim()).filter(Boolean)
  const out: CartItem[] = []
  for (const part of parts) {
    const [id, qtyStr] = part.split(':')
    if (!id) continue
    const qty = Math.max(1, parseInt(qtyStr || '1'))
    const meta = shopItems.find(s => s.id === id)
    if (meta) {
      out.push({ id: meta.id, name: meta.name, price: meta.price, quantity: qty })
    } else {
      out.push({ id, name: id, price: 0, quantity: qty })
    }
  }
  return out
}

function serializeCart(items: CartItem[]): string {
  return items.map(i => `${i.id}:${i.quantity}`).join(',')
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Hydration: prefer query param over localStorage
    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null
    const cartParam = url ? url.searchParams.get('cart') : null
    if (cartParam) {
      const parsed = parseCartParam(cartParam)
      const stored = localStorage.getItem('cart')
      let storedItems: CartItem[] = []
      if (stored) {
        try { storedItems = JSON.parse(stored) } catch {}
      }
      const merged: CartItem[] = parsed.map(pi => {
        const match = storedItems.find(s => s.id === pi.id)
        return match ? { ...match, quantity: pi.quantity } : pi
      })
      setItems(merged)
    } else {
      const stored = localStorage.getItem('cart')
      if (stored) setItems(JSON.parse(stored))
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items, hydrated])

  // Ensure cart param persists when navigating among /shop routes even if items unchanged
  // Removed implicit URL mutation on navigation; handled by hook

  function add(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p)
      }
      return [...prev, { ...item, quantity }]
    })
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }

  function clear() { setItems([]) }

  function updateQty(id: string, qty: number) {
    setItems((prev) => prev.map((p) => p.id === id ? { ...p, quantity: qty } : p))
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, clear, updateQty, total, hydrated }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
