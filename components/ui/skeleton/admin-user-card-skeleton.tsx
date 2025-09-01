import { Skeleton } from '@/components/ui/skeleton'

export default function AdminUserCardSkeleton() {
  return (
    <div className='rounded-2xl border bg-blue-200 p-4'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='flex-1'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-24 mt-2' />
        </div>
      </div>

      <div className='mt-4 grid grid-cols-3 gap-2'>
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
        <Skeleton className='h-8 w-full rounded-lg' />
      </div>
    </div>
  )
}
