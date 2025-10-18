"use client"
import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { FiCreditCard, FiArrowLeft, FiCheck, FiDownload } from 'react-icons/fi'

export default function PaymentPage() {
  const { total, items, clear, hydrated } = useCart()
  const [method, setMethod] = useState('bank')
  const [ref, setRef] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [finalizing, setFinalizing] = useState(false)

  function validate() {
    const e: string[] = []
    if (!ref.trim()) e.push('Reference number required')
    if (!receipt) e.push('Payment proof image required')
    setErrors(e)
    return e.length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setShowConfirm(true)
  }

  function finalize() {
    // store order summary for success page
    setFinalizing(true)
    const order = {
      id: crypto.randomUUID(),
      items,
      total,
      method,
      ref,
      timestamp: new Date().toISOString()
    }
    sessionStorage.setItem('orderSuccess', JSON.stringify(order))
    setTimeout(() => {
      clear()
      window.location.href = '/shop/success'
    }, 700)
  }

  // Avoid SSR/client mismatch until cart hydration completes
  if (!hydrated) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-sm text-slate-500">Loading cart…</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="mb-4 text-sm">Your cart is empty. Add items before payment.</p>
        <Link href="/shop" className="text-xs px-4 py-2 border bg-pink-50 hover:bg-pink-100 inline-block">Return to Shop</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">Payment <FiCreditCard className="h-5 w-5" /></h1>
      <div className="border p-6 bg-white space-y-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide">Payment Method</label>
          <select value={method} onChange={(e)=>setMethod(e.target.value)} className="border px-3 py-2 text-sm bg-slate-50 focus:bg-white">
            <option value="bank">Bank Transfer</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide">Payment Reference # *</label>
          <input value={ref} onChange={(e)=>setRef(e.target.value)} className="border px-3 py-2 text-sm bg-slate-50 focus:bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide">Upload Payment Proof *</label>
          <input type="file" accept="image/*" onChange={(e)=>setReceipt(e.target.files?.[0] || null)} className="border px-3 py-2 text-sm bg-slate-50 focus:bg-white" />
          {receipt && <p className="text-[11px] text-slate-500">{receipt.name}</p>}
        </div>
        {errors.length > 0 && (
          <ul className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 list-disc pl-5">
            {errors.map(er => <li key={er}>{er}</li>)}
          </ul>
        )}
        <div className="flex justify-between items-center pt-2">
          <Link href="/shop/checkout" className="text-xs px-4 py-2 border bg-gray-50 hover:bg-gray-100 flex items-center gap-1"><FiArrowLeft className="h-3 w-3" /> Back</Link>
          <button type="button" onClick={handleSubmit} className="text-xs px-4 py-2 border bg-pink-50 hover:bg-pink-100 flex items-center gap-1">Confirm Payment <FiCheck className="h-3 w-3" /></button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setShowConfirm(false)} />
          <div className="relative bg-white border p-6 max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold">Finalize Payment?</h2>
            <p className="text-xs text-slate-600">Total amount: ₱{total.toLocaleString()}</p>
            <div className="flex justify-end gap-2">
              <button onClick={()=>setShowConfirm(false)} className="text-xs px-3 py-2 border bg-gray-50 hover:bg-gray-100">Cancel</button>
              <button onClick={!finalizing ? finalize : undefined} disabled={finalizing} className="text-xs px-3 py-2 border bg-green-50 hover:bg-green-100 flex items-center gap-1 disabled:opacity-60">
                {finalizing ? 'Processing…' : 'Finalize'} <FiDownload className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
