'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import EventModal from '@/components/events/event-modal'

import type { EventItem } from '@/types/event'
import { useToast } from '@/hooks/use-toast'
import EventToolbar from '@/components/admin/events/EventToolbar'
import EventListTable from '@/components/admin/events/EventListTable'
import DeleteEventDialog from '@/components/admin/events/DeleteEventDialog'
import EventForm from '@/components/admin/events/EventForm'

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([])
  const [filtered, setFiltered] = useState<EventItem[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const [openForm, setOpenForm] = useState(false)
  const [editItem, setEditItem] = useState<EventItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<EventItem | null>(null)
  const [viewItem, setViewItem] = useState<EventItem | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 5
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/events')
        const data = await res.json()
        setItems(data)
        setFiltered(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    const s = q.toLowerCase()
    const next = items.filter(
      (e) =>
        e.title.toLowerCase().includes(s) ||
        e.location.toLowerCase().includes(s) ||
        e.region.toLowerCase().includes(s) ||
        (e.area as any).toLowerCase().includes(s),
    )
    setFiltered(next)
    setPage(1)
  }, [q, items])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  async function remove(id?: string) {
    if (!id) return
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    setItems((it) => it.filter((e) => e._id !== id))
    setFiltered((it) => it.filter((e) => e._id !== id))
    toast({ title: 'Event deleted' })
  }

  return (
    <div className='flex h-screen bg-background'>
      <AdminSidebar />
      <main className='flex-1 overflow-auto'>
        <div className='p-8'>
          <EventToolbar
            q={q}
            setQ={setQ}
            onCreate={() => {
              setEditItem(null)
              setOpenForm(true)
            }}
          />

          <EventListTable
            loading={loading}
            items={filtered}
            pageItems={pageItems}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onGoto={(p) => setPage(p)}
            onEdit={(e) => {
              setEditItem(e)
              setOpenForm(true)
            }}
            onDelete={(e) => setDeleteItem(e)}
            onView={(e) => setViewItem(e)}
          />

          {/* Delete dialog */}
          <DeleteEventDialog
            open={Boolean(deleteItem)}
            title={deleteItem?.title}
            subtitle={deleteItem?.location}
            onCancel={() => setDeleteItem(null)}
            onConfirm={async () => {
              if (!deleteItem?._id) return
              await remove(deleteItem._id)
              setDeleteItem(null)
            }}
          />

          {/* Create/Edit modal */}
          <EventForm
            open={openForm}
            onOpenChange={(v) => {
              setOpenForm(v)
              if (!v) setEditItem(null)
            }}
            initial={editItem || undefined}
            onSaved={(evt) => {
              setItems((prev) => {
                const idx = prev.findIndex((x) => x._id === (evt as any)._id)
                if (idx >= 0) {
                  const copy = prev.slice()
                  copy[idx] = evt
                  return copy
                }
                return [evt, ...prev]
              })
              setFiltered((prev) => {
                const idx = prev.findIndex((x) => x._id === (evt as any)._id)
                if (idx >= 0) {
                  const copy = prev.slice()
                  copy[idx] = evt
                  return copy
                }
                const s = q.toLowerCase()
                const matches =
                  evt.title.toLowerCase().includes(s) ||
                  evt.location.toLowerCase().includes(s) ||
                  evt.region.toLowerCase().includes(s) ||
                  (evt.area as any).toLowerCase().includes(s)
                return matches ? [evt, ...prev] : prev
              })
            }}
          />
        </div>
      </main>

      {/* View Modal (kept from your app) */}
      {viewItem && (
        <EventModal
          event={{ ...viewItem, id: viewItem._id || '' }}
          isOpen={!!viewItem}
          onClose={() => setViewItem(null)}
        />
      )}
    </div>
  )
}
