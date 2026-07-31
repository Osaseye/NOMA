import { BarChart3, ClipboardList, LayoutDashboard, Package, Settings, Tags, Users, WalletCards } from 'lucide-react'
import { NavLink } from 'react-router-dom'

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
    <aside className="admin-nav">
      <img src="/icon.PNG" alt="Noma" />
      {links.map(([label, href, Icon]) => (
        <NavLink key={href} to={href} end={href === '/admin'}><Icon size={18} /> {label}</NavLink>
      ))}
    </aside>
  )
}
