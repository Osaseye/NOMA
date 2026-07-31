import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../components/layout/AdminSidebar'

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
