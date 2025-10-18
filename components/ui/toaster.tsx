"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        icon,
        image,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className='flex items-start gap-3'>
              {image && (
                <div className='w-12 h-12 border bg-white flex items-center justify-center overflow-hidden rounded-sm'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt='toast image'
                    className='object-contain w-full h-full'
                  />
                </div>
              )}
              <div className='grid gap-1 flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                  {icon && (
                    <span className='inline-flex items-center justify-center text-pink-600'>
                      {icon}
                    </span>
                  )}
                  {title && <ToastTitle>{title}</ToastTitle>}
                </div>
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
