// MyOrdersPage.tsx - Replicating Section 3 of ChatGPT Image Aug 14, 2026, 09_34_22 PM.png
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  LayoutDashboard,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Filter,
  Search,
  X,
} from 'lucide-react'
import { formatNaira } from '../../utils/pricing'

export interface OrderRecord {
  id: string
  date: string
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled' | 'To Pay'
  subtext: string
  total: number
  items: {
    name: string
    image: string
    qty: number
    price: number
  }[]
}

const sampleOrders: OrderRecord[] = [
  {
    id: 'NMA-78901234',
    date: 'May 11, 2024',
    status: 'Delivered',
    subtext: 'Delivered on May 18, 2024',
    total: 373500,
    items: [
      {
        name: 'Samsung 55" 4K UHD Smart TV',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 185000,
      },
      {
        name: 'Samsung Soundbar HW-T400',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 65000,
      },
      {
        name: 'LG XBOOM RN5 Party Speaker',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 120000,
      },
    ],
  },
  {
    id: 'NMA-78900112',
    date: 'Apr 25, 2024',
    status: 'Shipped',
    subtext: 'Out for delivery',
    total: 78000,
    items: [
      {
        name: 'Electric Stainless Steel Kettle',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 33000,
      },
      {
        name: 'Binatone Glass Blender',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 45000,
      },
    ],
  },
  {
    id: 'NMA-78985421',
    date: 'Apr 12, 2024',
    status: 'Processing',
    subtext: 'Preparing your order',
    total: 9500,
    items: [
      {
        name: 'Oraimo Power Strip 4 Outlets',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 9500,
      },
    ],
  },
  {
    id: 'NMA-7890105',
    date: 'Mar 30, 2024',
    status: 'Cancelled',
    subtext: 'This order was cancelled',
    total: 83000,
    items: [
      {
        name: 'Sony WH-CH520 Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 65000,
      },
      {
        name: 'Microfiber Bed Sheet Set',
        image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 18000,
      },
    ],
  },
]

export function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<'All Orders' | 'To Pay' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All Orders')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null)

  const filteredOrders = sampleOrders.filter((o) => {
    if (activeTab !== 'All Orders' && o.status !== activeTab) return false
    if (
      searchQuery &&
      !o.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Main Grid: Left Account Sidebar + Right Orders Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Account Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-2xs space-y-6">
              {/* User Profile Info */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F5FE3] text-lg font-black text-white shadow-2xs">
                  SD
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#12203D]">Segun Daniel</h3>
                  <Link to="/account" className="text-xs font-bold text-[#2F5FE3] hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1 text-xs font-bold text-gray-600">
                <Link
                  to="/account"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 rounded-xl bg-blue-50/80 px-3.5 py-2.5 text-[#2F5FE3] transition-colors"
                >
                  <Package size={16} />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Heart size={16} />
                  <span>Wishlist</span>
                </Link>
                <Link
                  to="/account"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <MapPin size={16} />
                  <span>Addresses</span>
                </Link>
                <Link
                  to="/account"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <CreditCard size={16} />
                  <span>Payment Methods</span>
                </Link>
                <Link
                  to="/account"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </Link>

                <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-red-500 hover:bg-red-50 transition-colors pt-4 border-t border-gray-100">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Right Orders Main Section */}
          <main className="lg:col-span-9 space-y-6">
            {/* Header with Search & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D]">My Orders</h1>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs font-semibold text-[#12203D] outline-none focus:border-[#2F5FE3]"
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-[#12203D]">
                  <Filter size={14} />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3 overflow-x-auto scrollbar-none text-xs font-bold">
              {(['All Orders', 'To Pay', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-2 transition-all shrink-0 ${
                      activeTab === tab
                        ? 'bg-[#2F5FE3] text-white shadow-2xs'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            {/* Orders Cards List matching ChatGPT Image Section 3 */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-gray-100 bg-white p-5 shadow-2xs space-y-4 hover:border-gray-200 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
                    <div>
                      <span className="font-extrabold text-[#12203D]">Order #{order.id}</span>
                      <span className="text-gray-400 ml-3">{order.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-0.5 text-[10px] font-extrabold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500">{order.subtext}</span>
                    </div>
                  </div>

                  {/* Order Items Summary Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500 shrink-0">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {order.items.map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 block">Total</span>
                        <span className="text-base font-extrabold text-[#12203D]">
                          {formatNaira(order.total)}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs font-bold text-[#2F5FE3] hover:bg-[#2F5FE3] hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Order Details Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="border-b border-gray-100 pb-4">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold text-[#2F5FE3]">
                Order Details
              </span>
              <h3 className="text-xl font-extrabold text-[#12203D] mt-2">
                Order #{selectedOrder.id}
              </h3>
              <p className="text-xs text-gray-500">Placed on {selectedOrder.date}</p>
            </div>

            <div className="space-y-3 divide-y divide-gray-100">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pt-3 first:pt-0">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-14 w-14 object-contain rounded-xl bg-gray-50 p-1" />
                    <div>
                      <h4 className="text-xs font-bold text-[#12203D]">{item.name}</h4>
                      <span className="text-[11px] text-gray-400">Qty: {item.qty}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#12203D]">
                    {formatNaira(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Grand Total</span>
              <span className="text-xl font-extrabold text-[#2F5FE3]">
                {formatNaira(selectedOrder.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
