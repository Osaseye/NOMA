import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AdminSidebar } from '../components/layout/AdminSidebar'
import { HiBuildingStorefront, HiBell, HiShieldCheck, HiBars3 } from 'react-icons/hi2'
import { useAdminStore } from '../store/adminStore'

export function AdminLayout() {
  const location = useLocation()
  const { operatorUser } = useAdminStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Format current date nicely
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Format simple page breadcrumb from path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentTab = pathSegments[1] ? pathSegments[1].toUpperCase() : 'DASHBOARD'

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AdminSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Admin Topbar Header */}
        <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-3.5 md:px-8 backdrop-blur-md">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Navigation Menu"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
            >
              <HiBars3 size={20} />
            </button>

            <div className="flex md:hidden items-center gap-2">
              <img
                src="/icon.png"
                alt="Noma"
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/fav.png'
                }}
              />
              <span className="font-['Outfit'] font-black text-xs text-slate-900 tracking-tight">NOMA</span>
            </div>

            <span className="hidden xs:inline-flex rounded-md bg-emerald-100 px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-[11px] font-black uppercase tracking-wider text-emerald-800 items-center gap-1">
              <HiShieldCheck size={13} className="text-emerald-600" /> System Active
            </span>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-300">/</span>
            <span className="hidden sm:inline-block text-xs font-extrabold text-slate-600 tracking-wider">
              {currentTab}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden lg:inline-block text-[12px] font-medium text-slate-500">
              {today}
            </span>

            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-1.5 md:px-3 text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all"
            >
              <HiBuildingStorefront size={15} className="text-emerald-600" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <button
              aria-label="System Notifications"
              className="relative rounded-xl border border-slate-200 p-1.5 md:p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <HiBell size={18} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
                3
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                {operatorUser?.name?.[0] || 'A'}
              </div>
              <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                {operatorUser?.name || 'Operator'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
