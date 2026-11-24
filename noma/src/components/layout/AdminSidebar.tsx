import {
  Buildings,
  ChartBar,
  ChartLineUp,
  ChatCenteredText,
  FileText,
  Gear,
  Package,
  ShoppingBag,
  SignOut,
  SquaresFour,
  Star,
  Tag,
  Users,
  Warehouse,
  X,
} from '@phosphor-icons/react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '../../services/firebase/authService'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { useAdminStore } from '../../store/adminStore'
import { useFeedbackStore } from '../../store/feedbackStore'
import { useProductStore } from '../../store/productStore'

type NavItem = {
  to: string
  label: string
  icon: PhosphorIcon
  end?: boolean
  badgeKey?: 'orders' | 'inventory' | 'reviews' | 'feedback'
}

const navGroups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: SquaresFour, end: true },
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, badgeKey: 'orders' as const },
      { to: '/admin/settings', label: 'Settings', icon: Gear },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/inventory', label: 'Inventory', icon: Warehouse, badgeKey: 'inventory' as const },
      { to: '/admin/categories', label: 'Categories', icon: Tag },
      { to: '/admin/reviews', label: 'Reviews', icon: Star, badgeKey: 'reviews' as const },
    ],
  },
  {
    title: 'Directory & Finance',
    items: [
      { to: '/admin/customers', label: 'Users', icon: Users },
      { to: '/admin/feedback', label: 'Feedback', icon: ChatCenteredText, badgeKey: 'feedback' as const },
      { to: '/admin/revenue', label: 'Revenue', icon: ChartLineUp },
      { to: '/admin/profit', label: 'Profit & Margin', icon: ChartBar },
      { to: '/admin/suppliers', label: 'Suppliers', icon: Buildings },
      { to: '/admin/reports', label: 'Reports', icon: FileText },
    ],
  },
]

export function AdminSidebar({
  collapsed = false,
  onClose,
}: {
  collapsed?: boolean
  onToggleCollapse?: () => void
  onClose?: () => void
}) {
  const logoutAdmin = useAdminStore((state) => state.logout)
  const { orders, products, reviews } = useProductStore()
  const feedbackItems = useFeedbackStore((state) => state.items)
  const navigate = useNavigate()

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.status === 'processing'
  ).length
  const lowOrOutStockCount = products.filter((p) => (p.stockQty ?? 0) <= 5).length
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length
  const openFeedbackCount = feedbackItems.filter((f) => f.status === 'new').length

  const getBadgeCount = (key?: 'orders' | 'inventory' | 'reviews' | 'feedback') => {
    if (key === 'orders') return pendingOrdersCount
    if (key === 'inventory') return lowOrOutStockCount
    if (key === 'reviews') return pendingReviewsCount
    if (key === 'feedback') return openFeedbackCount
    return 0
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (e) {
      console.error('Firebase logout error:', e)
    }
    logoutAdmin()
    toast.success('Signed out')
    if (onClose) onClose()
    navigate('/admin/login')
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white text-slate-900 select-none">
      {/* Brand Header — Prominent Icon without Container Box, "Noma Admin" only */}
      <div
        className={`flex h-14 items-center border-b border-slate-200 ${
          collapsed ? 'justify-center px-2' : 'justify-between px-5'
        }`}
      >
        <Link
          to="/admin"
          onClick={onClose}
          className="flex items-center gap-2.5"
          title="Noma Admin"
        >
          <img
            src="/icon.png"
            alt="Noma"
            className="h-8 w-8 shrink-0 object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = '/logo.PNG'
            }}
          />
          {!collapsed ? (
            <span className="text-base font-bold tracking-tight text-slate-950">
              Noma Admin
            </span>
          ) : null}
        </Link>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1 text-slate-500 transition-colors hover:text-slate-950 lg:hidden"
          >
            <X size={18} weight="regular" />
          </button>
        ) : null}
      </div>

      {/* Navigation Links — Zero Scrollbar, Zero Colored Containers */}
      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed ? (
              <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
            ) : null}
            <nav className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon: Icon, end, badgeKey }) => {
                const count = getBadgeCount(badgeKey)
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center ${
                        collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-2.5 py-2'
                      } text-[13px] transition-colors ${
                        isActive
                          ? 'font-bold text-slate-950 before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-[2.5px] before:rounded-full before:bg-slate-950'
                          : 'font-medium text-slate-500 hover:text-slate-950'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={18}
                            weight={isActive ? 'bold' : 'regular'}
                            className={
                              isActive
                                ? 'text-slate-950'
                                : 'text-slate-400 transition-colors group-hover:text-slate-950'
                            }
                          />
                          {!collapsed ? <span>{label}</span> : null}
                        </div>

                        {!collapsed && count > 0 ? (
                          <span className="text-[11px] font-bold tabular-nums text-slate-900">
                            {count}
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer — Sign Out Only (No Storefront Button, No Red Container) */}
      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={`flex w-full items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-950 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <SignOut size={18} weight="regular" />
          {!collapsed ? <span>Sign out</span> : null}
        </button>
      </div>
    </aside>
  )
}
