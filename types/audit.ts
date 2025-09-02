export type AuditLogItem = {
  id: string
  adminId: string
  adminEmail?: string
  action: string
  resourceType: string
  resourceId?: string
  details?: string
  timestamp: string | Date
}
