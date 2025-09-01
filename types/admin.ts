export type AdminRole = 'super_admin' | 'content_manager' | 'news_editor'

export type AdminUser = {
  id: string
  email: string
  name: string
  role: AdminRole
  lastLoginAt?: string | null
  createdAt?: string
}
