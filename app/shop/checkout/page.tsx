"use client"
import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [name, setName] = useState('')
  const [church, setChurch] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  function validate() {
    const e: string[] = []
    if (!name.trim()) e.push('Name required')
    if (!church.trim()) e.push('Church required')
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) e.push('Valid email required')
    setErrors(e)
    return e.length === 0
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    sessionStorage.setItem('checkoutUser', JSON.stringify({ name, church, email }))
    window.location.href = '/shop/payment'
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">Checkout <FiShoppingCart className="h-5 w-5" /></h1>
      {items.length === 0 ? (
        <div className="border p-8 text-center bg-white">
          <p className="text-sm mb-4">Cart is empty.</p>
          <Link href="/shop" className="text-xs px-4 py-2 border bg-pink-50 hover:bg-pink-100 inline-block">Return to Shop</Link>
        </div>
      ) : (
        <form onSubmit={handleNext} className="space-y-6">
          <div className="border bg-white divide-y">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-slate-500">Qty {i.quantity} · ₱{(i.price * i.quantity).toLocaleString()}</p>
                </div>
                <p className="text-xs font-mono">₱{i.price.toLocaleString()}</p>
              </div>
            ))}
            <div className="p-4 flex justify-between bg-slate-50">
              <span className="text-sm font-semibold">Subtotal</span>
              <span className="text-sm font-semibold">₱{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="border p-6 bg-white space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide">Name *</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="border px-3 py-2 text-sm bg-slate-50 focus:bg-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide">Church *</label>
              <input value={church} onChange={(e)=>setChurch(e.target.value)} className="border px-3 py-2 text-sm bg-slate-50 focus:bg-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide">Email *</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border px-3 py-2 text-sm bg-slate-50 focus:bg-white" />
            </div>
            {errors.length > 0 && (
              <ul className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 list-disc pl-5">
                {errors.map(er => <li key={er}>{er}</li>)}
              </ul>
            )}
            <div className="flex justify-end gap-3">
              <Link href="/shop/cart" className="text-xs px-4 py-2 border bg-gray-50 hover:bg-gray-100">Back to Cart</Link>
              <button type="submit" className="text-xs px-4 py-2 border bg-pink-50 hover:bg-pink-100 flex items-center gap-1">Next <FiArrowRight className="h-3 w-3" /></button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
