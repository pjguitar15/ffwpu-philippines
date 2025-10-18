"use client"
import React from 'react'

interface ReceiptImageProps {
  order: {
    id: string
    items: { id: string; name: string; price: number; quantity: number }[]
    total: number
    method: string
    ref: string
    timestamp: string
  }
  logoSrc?: string
}

// Pure visual component rendered off-screen for PNG export
export const ReceiptImage: React.FC<ReceiptImageProps> = ({ order, logoSrc = '/ffwpu-ph-logo.webp' }) => {
  return (
    <div
      id="receipt-image-canvas"
      style={{ width: 720 }}
      className="bg-white text-slate-800 border shadow-sm p-8 font-sans"
    >
      <div className="flex items-start justify-between mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Logo"
            className="object-contain h-20 w-[180px]"
            style={{ maxWidth: 220 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; const parent = e.currentTarget.parentElement; if (parent) parent.innerHTML = '<span style="color:#0f172a;font-size:12px;font-weight:600">LOGO</span>' }}
            onLoad={(e) => { e.currentTarget.setAttribute('data-loaded', 'true') }}
          />
        <div className="text-right text-[11px] text-slate-500 leading-snug">
          <p>Order ID: <span className="font-mono">{order.id}</span></p>
          <p>Date: {new Date(order.timestamp).toLocaleString()}</p>
          <p>Reference #: <span className="font-mono">{order.ref}</span></p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs leading-relaxed text-slate-600">Thank you for your payment. Please present this receipt with your original payment proof when claiming items at the Philippine Headquarters.</p>
      </div>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr className="bg-slate-100 text-xs">
            <th className="border px-2 py-1 text-left font-semibold">Item</th>
            <th className="border px-2 py-1 text-right font-semibold">Qty</th>
            <th className="border px-2 py-1 text-right font-semibold">Unit Price</th>
            <th className="border px-2 py-1 text-right font-semibold">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(i => (
            <tr key={i.id} className="odd:bg-white even:bg-slate-50">
              <td className="border px-2 py-1">{i.name}</td>
              <td className="border px-2 py-1 text-right">{i.quantity}</td>
              <td className="border px-2 py-1 text-right">₱{i.price.toLocaleString()}</td>
              <td className="border px-2 py-1 text-right">₱{(i.price * i.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border px-2 py-2 text-right font-semibold">Total</td>
            <td className="border px-2 py-2 text-right font-semibold">₱{order.total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-600">
        <div className="space-y-1">
          <p className="font-semibold text-slate-700">Payment Details</p>
          <p>Method: {order.method}</p>
          <p>Reference: {order.ref}</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-700">Claiming Instructions</p>
          <p>Bring this receipt & payment proof.</p>
          <p>Unclaimed items after 30 days may be reallocated.</p>
        </div>
      </div>
      <div className="mt-8 text-[10px] text-slate-500 flex justify-between">
        <p>Generated: {new Date().toLocaleString()}</p>
        <p>FFWPU Philippines &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
