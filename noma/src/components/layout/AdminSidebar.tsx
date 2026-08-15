import { BarChart3, ClipboardList, LayoutDashboard, Package, Settings, Tags, Users, WalletCards, LogOut, Store } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Orders', '/admin/orders', ClipboardList],
  ['Products', '/admin/products', Package],
  ['Inventory', '/admin/inventory', Package],
  ['Categories', '/admin/categories', Tags],
  ['Customers', '/admin/customers', Users],
  ['Revenue', '/admin/revenue', BarChart3],
  ['Profit', '/admin/profit', WalletCards],
  ['Suppliers', '/admin/suppliers', WalletCards],
  ['Reports', '/admin/reports', BarChart3],
  ['Settings', '/admin/settings', Settings],
] as const

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 bg-[#12203D] text-white flex flex-col justify-between p-6 shadow-xl hidden md:flex">
      <div className="flex flex-col gap-8 overflow-y-auto pr-1">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <img src="/icon.PNG" alt="Noma Icon" className="h-10 w-10 object-contain rounded-xl bg-white p-1" />
          <div className="flex flex-col">
            <span className="font-['Outfit'] text-lg font-extrabold tracking-tight text-white">NOMA ADMIN</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F5FE3]">Operator Portal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Admin Sidebar">
          {links.map(([label, href, Icon]) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 text-[13px] font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2F5FE3] text-white shadow-md shadow-[#2F5FE3]/30 translate-x-1'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} strokeWidth={2.2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-2 border-t border-white/10 pt-4 mt-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[12px] font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Store size={16} /> View Storefront
        </Link>
        <Link
          to="/admin/login"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[12px] font-bold text-[#F44336] hover:bg-[#F44336]/10 transition-colors"
        >
          <LogOut size={16} /> Sign out
        </Link>
      </div>
    </aside>
  )
}
