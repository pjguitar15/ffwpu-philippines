"use client"
import React from 'react'
import { useCartUrlSync } from '@/hooks/use-cart-url-sync'

export function CartUrlSyncWrapper({ children }: { children: React.ReactNode }) {
  useCartUrlSync()
  return <>{children}</>
}
