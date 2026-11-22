import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  ArrowUpRight,
  Bell,
  ChatCenteredText,
  ClipboardText,
  Cube,
  List,
  Storefront,
} from '@phosphor-icons/react'
import { AdminSidebar } from '../components/layout/AdminSidebar'
import { useAdminStore } from '../store/adminStore'
import { useProductStore } from '../store/productStore'
import { useSupplierStore } from '../store/supplierStore'

export function AdminLayout() {
  const location = useLocation()
  const { operatorUser } = useAdminStore()
  const { products, reviews, orders } = useProductStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const alertsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cleanupAdmin = useProductStore.getState().initAdminRealtimeListeners()
    const existingSupplierCleanup = useSupplierStore.getState().initSupplierListener()
    existingSupplierCleanup()
    const cleanupSuppliers = useSupplierStore.getState().initSupplierListener()

    return () => {
      cleanupAdmin()
      cleanupSuppliers()
    }
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setAlertsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const lowStockCount = products.filter((p) => p.stockQty < 10).length
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length
  const openOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.status === 'processing'
  ).length
  const totalAlerts = lowStockCount + pendingReviewsCount

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentTab = pathSegments[1] ? pathSegments[1].toUpperCase() : 'DASHBOARD'

  return (
    <div className="flex min-h-screen bg-[#F6F7F9] font-sans text-[#0B1220]">
      <AdminSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 md:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Navigation Menu"
              className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#0B1220] transition-colors hover:bg-[#F6F7F9] md:hidden"
            >
              <List size={18} weight="regular" />
            </button>

            <div className="flex items-center gap-2 md:hidden">
              <img
                src="/icon.png"
                alt="Noma"
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/fav.png'
                }}
              />
              <span className="text-xs font-bold tracking-tight text-[#0B1220]">NOMA</span>
            </div>

            <span className="hidden items-center gap-1.5 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-semibold text-[#15803D] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
              <span>System Active</span>
            </span>

            <span className="hidden font-mono text-[11px] font-medium tracking-wider text-[#5E6675] sm:inline-block">
              / ADMIN / {currentTab}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden font-mono text-xs text-[#5E6675] lg:inline-block">
              {today}
            </span>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9] md:px-3"
            >
              <Storefront size={15} weight="regular" className="text-[#1049EB]" />
              <span className="hidden sm:inline">Storefront</span>
              <ArrowUpRight size={13} weight="regular" className="hidden text-[#5E6675] sm:inline" />
            </Link>

            {/* Operational Alerts Dropdown */}
            <div className="relative" ref={alertsRef}>
              <button
                type="button"
                onClick={() => setAlertsOpen((open) => !open)}
                aria-label="Operator Alerts"
                className="relative flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#374151] transition-colors hover:bg-[#F6F7F9] hover:text-[#0B1220]"
              >
                <Bell size={17} weight="regular" />
                {totalAlerts > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-[4px] bg-[#1049EB] px-1 font-mono text-[10px] font-bold text-white">
                    {totalAlerts}
                  </span>
                ) : null}
              </button>

              {alertsOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F6F7F9] px-3.5 py-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                      Operator Queue
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#0B1220]">
                      {totalAlerts} alerts
                    </span>
                  </div>
                  <div className="divide-y divide-[#E5E7EB]">
                    <Link
                      to="/admin/inventory"
                      onClick={() => setAlertsOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-[#F6F7F9]"
                    >
                      <span className="flex items-center gap-2 font-medium text-[#374151]">
                        <Cube size={15} weight="regular" className="text-[#B45309]" />
                        Low or out-of-stock SKUs
                      </span>
                      <span className="rounded-[4px] border border-[#FDE68A] bg-[#FFFBEB] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#B45309]">
                        {lowStockCount}
                      </span>
                    </Link>
                    <Link
                      to="/admin/reviews"
                      onClick={() => setAlertsOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-[#F6F7F9]"
                    >
                      <span className="flex items-center gap-2 font-medium text-[#374151]">
                        <ChatCenteredText size={15} weight="regular" className="text-[#1049EB]" />
                        Pending reviews
                      </span>
                      <span className="rounded-[4px] bg-[#EEF3FE] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#1049EB]">
                        {pendingReviewsCount}
                      </span>
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={() => setAlertsOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors hover:bg-[#F6F7F9]"
                    >
                      <span className="flex items-center gap-2 font-medium text-[#374151]">
                        <ClipboardText size={15} weight="regular" className="text-[#0B1220]" />
                        Active orders to fulfill
                      </span>
                      <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#0B1220]">
                        {openOrdersCount}
                      </span>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="hidden items-center gap-2.5 border-l border-[#E5E7EB] pl-3 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#0B1220] font-mono text-xs font-bold text-white">
                {operatorUser?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="max-w-[120px] truncate text-xs font-semibold text-[#0B1220]">
                  {operatorUser?.name || 'Operator'}
                </span>
                <span className="text-[10px] font-medium text-[#5E6675]">
                  {operatorUser?.role || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
