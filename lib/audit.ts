import { cookies } from 'next/headers'
import { dbConnect } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { AdminUser } from '@/models/AdminUser'
import { AuditLog } from '@/models/AuditLog'

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null
    const payload = await verifyToken(token)
    await dbConnect()
    const user = await AdminUser.findById(payload.sub).lean()
    if (!user) return null
    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch {
    return null
  }
}

type LogParams = {
  action: string
  resourceType: string
  resourceId?: string
  details?: string
}

export async function recordAudit({ action, resourceType, resourceId = '', details = '' }: LogParams) {
  try {
    await dbConnect()
    const admin = await getCurrentAdmin()
    await AuditLog.create({
      adminId: admin ? (admin.id as any) : null,
      adminEmail: admin?.email || '',
      action,
      resourceType,
      resourceId,
      details,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[Audit] Failed to write audit log:', (err as any)?.message || err)
  }
}
