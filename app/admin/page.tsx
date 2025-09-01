import { redirect } from 'next/navigation'

export default function AdminIndexPage() {
  // Authless users are redirected to /admin/login by middleware.
  // Authenticated users landing on /admin should go to the dashboard.
  redirect('/admin/dashboard')
}
