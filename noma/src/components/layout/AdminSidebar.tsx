import { useState, type ComponentType } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  CaretDown,
  ChartBar,
  ChatCenteredText,
  ClipboardText,
  Cube,
  FileText,
  ShoppingBag,
  SignOut,
  SlidersHorizontal,
  SquaresFour,
  Storefront,
  Tag,
  TrendUp,
  Users,
  X,
  type IconProps,
} from '@phosphor-icons/react'
import { authService } from '../../services/firebase/authService'
import { useAdminStore } from '../../store/adminStore'

interface SubItem {
  label: string
  href: string
  icon: ComponentType<IconProps>
}

interface NavGroup {
  title: string
  items: SubItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: SquaresFour },
      { label: 'Orders & Shipping', href: '/admin/orders', icon: ClipboardText },
      { label: 'Site Settings & Banners', href: '/admin/settings', icon: SlidersHorizontal },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', href: '/admin/products', icon: ShoppingBag },
      { label: 'Inventory', href: '/admin/inventory', icon: Cube },
      { label: 'Categories & Markups', href: '/admin/categories', icon: Tag },
      { label: 'Product Reviews', href: '/admin/reviews', icon: ChatCenteredText },
    ],
  },
  {
    title: 'Financials & Reports',
    items: [
      { label: 'Customers', href: '/admin/customers', icon: Users },
      { label: 'Revenue', href: '/admin/revenue', icon: ChartBar },
      { label: 'Profit & Margin', href: '/admin/profit', icon: TrendUp },
      { label: 'Suppliers', href: '/admin/suppliers', icon: Storefront },
      { label: 'Reports', href: '/admin/reports', icon: FileText },
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

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Overview: true,
    Catalog: true,
    'Financials & Reports': true,
  })

  const toggleGroup = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleLogout = async () => {
    await authService.logout().catch(() => undefined)
    logout()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <div className="flex h-full w-full flex-col justify-between bg-white p-3.5 font-sans text-[#0B1220]">
      <div className="flex min-h-0 flex-col gap-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-1">
              <img
                src="/icon.png"
                alt="Noma"
                className="h-5 w-5 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/fav.png'
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-[#0B1220]">NOMA</span>
                <span className="rounded-[4px] bg-[#EEF3FE] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#1049EB]">
                  OPS
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#5E6675]">Operator Studio</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] hover:bg-[#F6F7F9] hover:text-[#0B1220] md:hidden"
          >
            <X size={16} weight="regular" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-1 flex-col gap-3 overflow-y-auto pr-0.5" aria-label="Admin Navigation">
          {navGroups.map((group) => {
            const isOpen = expanded[group.title]

            return (
              <div key={group.title} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between rounded-[6px] px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675] transition-colors hover:bg-[#F6F7F9] hover:text-[#0B1220]"
                >
                  <span>{group.title}</span>
                  <CaretDown
                    size={12}
                    weight="regular"
                    className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen ? (
                  <div className="ml-2.5 mt-1 flex flex-col gap-0.5 border-l border-[#E5E7EB] pl-2.5">
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
                          className={`flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-xs transition-colors ${
                            isActive
                              ? 'bg-[#EEF3FE] font-semibold text-[#1049EB]'
                              : 'font-medium text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
                          }`}
                        >
                          <Icon
                            size={16}
                            weight="regular"
                            className={`shrink-0 ${isActive ? 'text-[#1049EB]' : 'text-[#5E6675]'}`}
                          />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="mt-3 border-t border-[#E5E7EB] pt-3">
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
          >
            <Storefront size={14} weight="regular" className="text-[#5E6675]" />
            <span>Storefront</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] py-2 text-xs font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2]"
          >
            <SignOut size={14} weight="regular" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-[#E5E7EB] bg-white md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#0B1220]/45 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full w-64 max-w-[85vw] overflow-hidden rounded-r-[10px] border-r border-[#E5E7EB] bg-white">
            {sidebarContent}
          </div>
        </div>
      ) : null}
    </>
  )
}
