import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Bell,
  List,
  Package,
  ShoppingBag,
  SidebarSimple,
  Star,
} from '@phosphor-icons/react'
import { Link, Outlet } from 'react-router-dom'
import { AdminSidebar } from '../components/layout/AdminSidebar'
import { useAdminStore } from '../store/adminStore'
import { useProductStore } from '../store/productStore'
import { formatNaira } from '../utils/pricing'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const operatorUser = useAdminStore((state) => state.operatorUser)
  const { orders, products, reviews, initAdminRealtimeListeners } = useProductStore()

  useEffect(() => {
    const unsub = initAdminRealtimeListeners()
    return () => {
      unsub()
    }
  }, [initAdminRealtimeListeners])

  const pendingOrders = orders.filter((o) => o.status === 'placed' || o.status === 'processing')
  const outOfStockProducts = products.filter((p) => (p.stockQty ?? 0) === 0)
  const lowStockProducts = products.filter((p) => (p.stockQty ?? 0) > 0 && (p.stockQty ?? 0) <= 5)
  const pendingReviews = reviews.filter((r) => r.status === 'pending')

  const totalAlerts =
    pendingOrders.length +
    outOfStockProducts.length +
    lowStockProducts.length +
    pendingReviews.length

  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notificationsOpen])

  const displayName =
    operatorUser?.name && operatorUser.name !== 'Master Admin'
      ? operatorUser.name
      : 'Adebola Glory'

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Mobile Off-Canvas Sidebar Backdrop */}
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {/* Sidebar Wrapper — Retractable on Desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-[68px]' : 'w-60'}`}
      >
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-200 ${
          sidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-60'
        }`}
      >
        {/* Minimal Monochrome Top Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="-ml-1.5 rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-[#F4F4F5] hover:text-slate-950 lg:hidden"
            >
              <List size={20} weight="regular" />
            </button>

            {/* Desktop Retractable Sidebar Toggle */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="-ml-1.5 hidden rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-[#F4F4F5] hover:text-slate-950 lg:inline-flex"
            >
              <SidebarSimple size={18} weight="regular" />
            </button>

            <span className="text-xs font-medium text-slate-500">{today}</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Notification Bell Dropdown (Monochrome) */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                aria-label="Notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-[#F4F4F5] hover:text-slate-950"
              >
                <Bell size={17} weight="regular" />
                {totalAlerts > 0 ? (
                  <span className=" -right-0.5 -top-0.5 absolute flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold tabular-nums text-white">
                    {totalAlerts > 99 ? '99+' : totalAlerts}
                  </span>
                ) : null}
              </button>

              {notificationsOpen ? (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl sm:w-96">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <span className="text-xs font-bold text-slate-950">Activity</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {totalAlerts} {totalAlerts === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                    {totalAlerts === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-slate-400">
                        All clear. No pending notifications.
                      </div>
                    ) : null}

                    {pendingOrders.slice(0, 3).map((order) => (
                      <Link
                        key={order.id}
                        to={`/admin/orders/${order.id}`}
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#F4F4F5]"
                      >
                        <ShoppingBag size={16} className="mt-0.5 shrink-0 text-slate-700" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-950">
                              Order #{order.id}
                            </span>
                            <span className="text-xs font-bold tabular-nums text-slate-950">
                              {formatNaira(order.total)}
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-500">
                            {order.customer} &bull; {order.status}
                          </p>
                        </div>
                      </Link>
                    ))}

                    {outOfStockProducts.slice(0, 3).map((prod) => (
                      <Link
                        key={prod.id}
                        to="/admin/inventory"
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#F4F4F5]"
                      >
                        <Package size={16} className="mt-0.5 shrink-0 text-slate-700" />
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-950">
                            Out of stock: {prod.name}
                          </span>
                          <span className="text-[11px] text-slate-500">0 units remaining</span>
                        </div>
                      </Link>
                    ))}

                    {pendingReviews.slice(0, 2).map((rev) => (
                      <Link
                        key={rev.id}
                        to="/admin/reviews"
                        onClick={() => setNotificationsOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#F4F4F5]"
                      >
                        <Star size={16} className="mt-0.5 shrink-0 text-slate-700" />
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-950">
                            Review from {rev.author}
                          </span>
                          <p className="truncate text-xs text-slate-500">{rev.comment}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-xs">
                    <Link
                      to="/admin/orders"
                      onClick={() => setNotificationsOpen(false)}
                      className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:underline"
                    >
                      <span>Orders</span>
                      <ArrowRight size={11} />
                    </Link>
                    <Link
                      to="/admin/inventory"
                      onClick={() => setNotificationsOpen(false)}
                      className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-950"
                    >
                      <span>Inventory</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Admin Profile — Clean Typography, No Caged Box */}
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3 sm:pl-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-bold text-white">
                {displayName[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden leading-tight sm:block">
                <div className="text-xs font-bold text-slate-950">{displayName}</div>
                <div className="text-[10px] font-medium text-slate-500">Master Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Container */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
