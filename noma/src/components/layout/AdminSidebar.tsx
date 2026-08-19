import { useState } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  HiSquares2X2,
  HiClipboardDocumentList,
  HiShoppingBag,
  HiCube,
  HiTag,
  HiUsers,
  HiChartBar,
  HiAdjustmentsHorizontal,
  HiBuildingStorefront,
  HiArrowRightOnRectangle,
  HiWrenchScrewdriver,
  HiSparkles,
  HiChevronDown,
  HiXMark,
  HiChatBubbleBottomCenterText,
} from 'react-icons/hi2'
import { useAdminStore } from '../../store/adminStore'

interface SubItem {
  label: string
  href: string
  icon: any
}

interface NavGroup {
  title: string
  icon: any
  items: SubItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    icon: HiSquares2X2,
    items: [
      { label: 'Dashboard', href: '/admin', icon: HiSquares2X2 },
      { label: 'Orders & Shipping', href: '/admin/orders', icon: HiClipboardDocumentList },
      { label: 'Site Settings & Banners', href: '/admin/settings', icon: HiWrenchScrewdriver },
    ],
  },
  {
    title: 'Catalog',
    icon: HiShoppingBag,
    items: [
      { label: 'Products', href: '/admin/products', icon: HiShoppingBag },
      { label: 'Inventory', href: '/admin/inventory', icon: HiCube },
      { label: 'Categories & Markups', href: '/admin/categories', icon: HiTag },
      { label: 'Product Reviews', href: '/admin/reviews', icon: HiChatBubbleBottomCenterText },
    ],
  },
  {
    title: 'Financials & Reports',
    icon: HiChartBar,
    items: [
      { label: 'Customers', href: '/admin/customers', icon: HiUsers },
      { label: 'Revenue', href: '/admin/revenue', icon: HiChartBar },
      { label: 'Profit & Margin', href: '/admin/profit', icon: HiSparkles },
      { label: 'Suppliers', href: '/admin/suppliers', icon: HiBuildingStorefront },
      { label: 'Reports', href: '/admin/reports', icon: HiAdjustmentsHorizontal },
    ],
  },
]

export function AdminSidebar({
  mobileOpen: controlledMobileOpen,
  setMobileOpen: controlledSetMobileOpen,
}: {
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
} = {}) {
  const { logout } = useAdminStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)

  const mobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen
  const setMobileOpen = controlledSetMobileOpen || setInternalMobileOpen

  // Track expanded groups (all open by default in compact mode)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Overview: true,
    Catalog: true,
    'Financials & Reports': true,
  })

  const toggleGroup = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-3.5 text-white overflow-hidden font-['Outfit',sans-serif]">
      <div className="flex flex-col gap-3 overflow-hidden">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="/icon.png"
                alt="Noma Logo"
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/fav.png'
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-['Outfit'] text-xs font-black tracking-tight text-white flex items-center gap-1">
                NOMA ADMIN <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[8px] font-bold text-emerald-400">PRO</span>
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400">Master Control</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <HiXMark size={20} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-2 overflow-y-auto pr-0.5" aria-label="Admin Sidebar">
          {navGroups.map((group) => {
            const GroupIcon = group.icon
            const isOpen = expanded[group.title]

            return (
              <div key={group.title} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon size={13} className="text-emerald-400" />
                    <span>{group.title}</span>
                  </div>
                  <HiChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-0.5 flex flex-col gap-0.5 pl-2 border-l border-white/10 ml-3">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive =
                        item.href === '/admin'
                          ? location.pathname === '/admin'
                          : location.pathname.startsWith(item.href)

                      return (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          end={item.href === '/admin'}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold tracking-wide transition-all ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-xs font-black'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Icon size={14} className="shrink-0 opacity-80" />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="flex flex-col gap-2 border-t border-white/10 pt-3 mt-2">

        <div className="grid grid-cols-2 gap-1.5">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[10px] font-bold text-slate-200 hover:bg-white/10 transition-colors"
          >
            <HiBuildingStorefront size={13} /> Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 py-1.5 text-[10px] font-bold text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            <HiArrowRightOnRectangle size={13} /> Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 h-screen w-56 shrink-0 bg-slate-900 shadow-xl hidden md:flex border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[85vw] bg-slate-900 h-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
