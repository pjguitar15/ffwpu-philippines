"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiCheckCircle, FiDownload } from 'react-icons/fi'
import { ReceiptImage } from '@/components/receipt-image'
import { toPng } from 'html-to-image'

interface OrderSuccessData {
  id: string
  items: { id: string; name: string; price: number; quantity: number }[]
  total: number
  method: string
  ref: string
  timestamp: string
}

export default function SuccessPage() {
  const [order, setOrder] = useState<OrderSuccessData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('orderSuccess')
    if (raw) setOrder(JSON.parse(raw))
  }, [])

  async function downloadReceipt() {
    if (!order) return
    // Ensure hidden receipt DOM exists
    const node = document.getElementById('receipt-image-canvas')
    if (!node) return
    // Wait for logo image if not yet loaded
    const logoImg = node.querySelector('img[src]') as HTMLImageElement | null
    if (logoImg && !logoImg.complete) {
      await new Promise<void>((resolve) => {
        logoImg.addEventListener('load', () => resolve(), { once: true })
        logoImg.addEventListener('error', () => resolve(), { once: true })
        setTimeout(resolve, 1500) // fallback timeout
      })
    }
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `receipt-${order.id}.png`
      a.click()
    } catch (err) {
      console.error('Receipt image generation failed', err)
      alert('Failed to generate receipt image. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-green-700">Success <FiCheckCircle className="h-6 w-6" /></h1>
      {!order ? (
        <div className="border p-8 bg-white text-center">
          <p className="text-sm mb-4">No recent order found.</p>
          <Link href="/shop" className="text-xs px-4 py-2 border bg-pink-50 hover:bg-pink-100 inline-block">Go to Shop</Link>
        </div>
      ) : (
  <div className="space-y-6 relative">
          <div className="border bg-white p-6">
            <p className="text-sm mb-2">Thank you. Your payment has been recorded.</p>
            <p className="text-xs text-slate-600 leading-relaxed">You may claim your items at the Philippine Headquarters. Please bring the original payment proof and reference number.</p>
          </div>
          <div className="border bg-white divide-y">
            {order.items.map(i => (
              <div key={i.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-slate-500">Qty {i.quantity}</p>
                </div>
                <p className="text-xs font-mono">₱{(i.price * i.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="p-4 flex justify-between bg-slate-50">
              <span className="text-sm font-semibold">Total Paid</span>
              <span className="text-sm font-semibold">₱{order.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="border bg-white p-6 space-y-3">
            <p className="text-xs">Order ID: <span className="font-mono">{order.id}</span></p>
            <p className="text-xs">Reference #: <span className="font-mono">{order.ref}</span></p>
            <p className="text-xs">Method: {order.method}</p>
            <p className="text-xs">Date: {new Date(order.timestamp).toLocaleString()}</p>
          </div>
          <div className="flex justify-end gap-3">
            <Link href="/shop" className="text-xs px-4 py-2 border bg-gray-50 hover:bg-gray-100">Back to Shop</Link>
            <button onClick={downloadReceipt} className="text-xs px-4 py-2 border bg-green-50 hover:bg-green-100 flex items-center gap-1">
              Download Receipt <FiDownload className="h-3 w-3" />
            </button>
          </div>
          {/* Off-screen receipt image for capture */}
          <div className="absolute -left-[9999px] top-0">
            <ReceiptImage order={order} logoSrc="/ffwpu-ph-logo.webp" />
          </div>
        </div>
      )}
    </div>
  )
}
