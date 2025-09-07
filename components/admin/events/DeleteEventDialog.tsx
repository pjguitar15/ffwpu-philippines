'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteEventDialog({
  open,
  title,
  subtitle,
  onCancel,
  onConfirm,
}: {
  open: boolean
  title?: string
  subtitle?: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className='max-w-sm p-0 overflow-hidden'>
        <div className='h-1 w-full bg-rose-500' />
        <div className='px-6 pt-5 pb-3 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-950/20 dark:to-rose-900/10 border-b'>
          <DialogHeader>
            <DialogTitle>Delete this event?</DialogTitle>
          </DialogHeader>
        </div>
        <div className='px-6 py-4'>
          <p className='text-sm text-muted-foreground'>
            This action cannot be undone.
          </p>
          <div className='mt-2 p-3 rounded border bg-muted/40'>
            <div className='font-medium'>{title}</div>
            {subtitle && (
              <div className='text-xs text-muted-foreground'>{subtitle}</div>
            )}
          </div>
        </div>
        <div className='px-6 pb-4 flex justify-end gap-2'>
          <Button
            variant='secondary'
            onClick={onCancel}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            className='cursor-pointer'
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
