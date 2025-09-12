'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function DeleteEventDialog({
  open,
  title,
  subtitle,
  onCancel,
  onConfirm,
  loading = false,
}: {
  open: boolean
  title?: string
  subtitle?: string
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !loading) onCancel() }}>
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            className='cursor-pointer inline-flex items-center'
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Deleting…
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
