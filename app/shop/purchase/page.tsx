"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface PurchaseSubmission {
  id: string
  name: string
  church: string
  receiptFileName: string
  timestamp: string
}

function PurchaseFormInner() {
  const params = useSearchParams() // must be within Suspense
  const itemId = params.get('item') || ''
  const [name, setName] = useState('')
  const [church, setChurch] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSubmitted(false)
  }, [itemId])

  function validate() {
    const errs: string[] = []
    if (!name.trim()) errs.push('Name is required.')
    if (!church.trim()) errs.push('Church is required.')
    if (!receipt) {
      errs.push('Receipt image is required.')
    } else {
      const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      if (!allowed.includes(receipt.type))
        errs.push('Receipt must be an image (png/jpeg/webp).')
      if (receipt.size > 4 * 1024 * 1024)
        errs.push('Receipt image must be less than 4MB.')
    }
    setErrors(errs)
    return errs.length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const submission: PurchaseSubmission = {
      id: crypto.randomUUID(),
      name: name.trim(),
      church: church.trim(),
      receiptFileName: receipt!.name,
      timestamp: new Date().toISOString(),
    }
    // Local persistence stub (could be replaced with API call)
    const existing = JSON.parse(
      localStorage.getItem('purchaseSubmissions') || '[]',
    ) as PurchaseSubmission[]
    existing.push(submission)
    localStorage.setItem('purchaseSubmissions', JSON.stringify(existing))
    setSubmitted(true)
    setName('')
    setChurch('')
    setReceipt(null)
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold mb-2'>Submit Purchase Receipt</h1>
        <p className='text-sm text-slate-600 leading-relaxed'>
          We currently do not offer delivery. After submitting your purchase
          receipt below, please claim your item at the Philippine Headquarters.{' '}
          <br />
          <span className='font-medium'>
            Remember to bring the original payment receipt when claiming.
          </span>
        </p>
      </div>
      {itemId && (
        <div className='border p-4 mb-6 bg-slate-50'>
          <p className='text-xs text-slate-500'>Item ID</p>
          <p className='text-sm font-mono'>{itemId}</p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className='border p-6 bg-white flex flex-col gap-5'
      >
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold tracking-wide uppercase'>
            Name *
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border px-3 py-2 text-sm bg-slate-50 focus:bg-white outline-none'
            placeholder='Your full name'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold tracking-wide uppercase'>
            Church *
          </label>
          <input
            type='text'
            value={church}
            onChange={(e) => setChurch(e.target.value)}
            className='border px-3 py-2 text-sm bg-slate-50 focus:bg-white outline-none'
            placeholder='Local church / community'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold tracking-wide uppercase'>
            Receipt Image *
          </label>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            className='border px-3 py-2 text-sm bg-slate-50 focus:bg-white outline-none'
          />
          {receipt && (
            <p className='text-[11px] text-slate-500'>
              Selected: {receipt.name} ({Math.round(receipt.size / 1024)} KB)
            </p>
          )}
        </div>
        {errors.length > 0 && (
          <ul className='text-xs text-red-700 border border-red-200 bg-red-50 p-3 leading-relaxed list-disc pl-5'>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {submitted && (
          <div className='text-xs text-green-700 border border-green-200 bg-green-50 p-3'>
            Receipt submission stored locally. You can submit another or go back
            to the shop.
          </div>
        )}
        <div className='flex justify-end gap-3 pt-2'>
          <a
            href='/shop'
            className='text-xs font-medium px-4 py-2 border bg-gray-50 hover:bg-gray-100'
          >
            Back to Shop
          </a>
          <button
            type='submit'
            className='text-xs font-semibold px-4 py-2 border bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 hover:shadow'
          >
            Submit Receipt
          </button>
        </div>
      </form>
    </div>
  )
}

export default function PurchasePage() {
  return (
    <Suspense
      fallback={
        <div className='max-w-2xl mx-auto p-6 text-sm text-slate-600'>
          Loading purchase form...
        </div>
      }
    >
      <PurchaseFormInner />
    </Suspense>
  )
}
