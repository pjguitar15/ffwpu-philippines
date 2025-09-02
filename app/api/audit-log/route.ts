import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { AuditLog } from '@/models/AuditLog'
import { getCurrentAdmin } from '@/lib/audit'

// GET /api/audit-log?page=1&pageSize=50
// Optional filters: resourceType, adminEmail
export async function GET(req: Request) {
  await dbConnect()
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)))
  const filter: any = {}
  const resourceType = searchParams.get('resourceType')
  const adminEmail = searchParams.get('adminEmail')
  if (resourceType) filter.resourceType = resourceType
  if (adminEmail) filter.adminEmail = adminEmail

  const skip = (page - 1) * pageSize
  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    AuditLog.countDocuments(filter),
  ])

  const mapped = items.map((i: any) => ({
    id: String(i._id),
    adminId: i.adminId ? String(i.adminId) : '',
    adminEmail: i.adminEmail || '',
    action: i.action,
    details: i.details || '',
    resourceType: i.resourceType,
    resourceId: i.resourceId || '',
    timestamp: i.createdAt,
  }))

  return NextResponse.json({ items: mapped, total, page, pageSize })
}

// POST /api/audit-log
export async function POST(req: Request) {
  await dbConnect()
  const admin = await getCurrentAdmin()
  const body = await req.json()
  if (!body?.action || !body?.resourceType) {
    return NextResponse.json({ error: 'Missing action or resourceType' }, { status: 400 })
  }
  const doc = await AuditLog.create({
    adminId: admin ? (admin.id as any) : null,
    adminEmail: admin?.email || '',
    action: body.action,
    resourceType: body.resourceType,
    resourceId: body.resourceId || '',
    details: body.details || '',
  })
  return NextResponse.json({ id: String((doc as any)?._id) }, { status: 201 })
}
