// app/news/loading.tsx
import { NewsIndexSkeleton } from '@/components/news/news-index-skeleton'

export default function Loading() {
  // This is streamed immediately by Next and replaced when the page resolves
  return <NewsIndexSkeleton cards={9} />
}
