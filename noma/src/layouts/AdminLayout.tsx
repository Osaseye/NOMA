import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../components/layout/AdminSidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA] text-[#12203D]">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto max-w-[1600px] mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
