import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: { default: 'Admin', template: '%s — FactBrief Admin' } }

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar email={session.email} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
