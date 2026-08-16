// MyOrdersPage.tsx - Track Orders with Guest Order Lookup & Signed-In History
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiChevronRight,
  HiFunnel,
  HiMagnifyingGlass,
  HiXMark,
  HiCube,
  HiTruck,
  HiCheckCircle,
  HiClock,
  HiSparkles,
  HiUserPlus,
  HiExclamationTriangle,
  HiClipboardDocumentList,
} from 'react-icons/hi2'
import { formatNaira } from '../../utils/pricing'
import { useUserStore } from '../../store/userStore'
import { useProductStore } from '../../store/productStore'

export function MyOrdersPage() {
  const { profile } = useUserStore()
  const { orders: storeOrders } = useProductStore()

  // State for Signed-In Order Dashboard
  const [activeTab, setActiveTab] = useState<'All Orders' | 'Placed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled'>('All Orders')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  // State for Guest Order Lookup Tool (Defaults to empty state as requested!)
  const [guestOrderInput, setGuestOrderInput] = useState('')
  const [searchedGuestOrder, setSearchedGuestOrder] = useState<any | null>(null)
  const [guestLookupError, setGuestLookupError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleGuestLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const cleanId = guestOrderInput.trim().toUpperCase()
    if (!cleanId) return

    setHasSearched(true)
    const found = storeOrders.find(
      (o) => o.id.toUpperCase() === cleanId || o.paymentRef?.toUpperCase() === cleanId
    )

    if (found) {
      setSearchedGuestOrder(found)
      setGuestLookupError(false)
    } else {
      setSearchedGuestOrder(null)
      setGuestLookupError(true)
    }
  }

  const filteredOrders = storeOrders.filter((o) => {
    if (activeTab !== 'All Orders' && o.status.toLowerCase() !== activeTab.toLowerCase()) return false
    if (
      searchQuery &&
      !o.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !o.customer.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  // Helper for tracking steps mapping
  const getStepProgress = (status: string) => {
    const s = status.toLowerCase()
    switch (s) {
      case 'processing':
        return 2
      case 'dispatched':
      case 'shipped':
        return 3
      case 'delivered':
        return 4
      case 'cancelled':
        return 0
      default:
        return 1
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-['Outfit',sans-serif] text-[#12203D] selection:bg-[#2F5FE3] selection:text-white pb-24 pt-3 md:pt-5">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-[#2F5FE3] transition-colors">
            Home
          </Link>
          <HiChevronRight size={12} className="text-gray-400" />
          <span className="font-bold text-[#12203D]">Track Orders</span>
        </nav>

        {/* GUEST USER MODE: LOOKUP TOOL & SIGN UP CALLOUT BANNER */}
        {profile.isGuest ? (
          <div className="space-y-8">
            {/* Header Title */}
            <div className="border-b border-gray-200/60 pb-5">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl">
                Track Order
              </h1>
              <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
                Enter your order ID or Paystack payment reference number to get real-time delivery status updates.
              </p>
            </div>

            {/* Guest Order Lookup Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <form onSubmit={handleGuestLookup} className="space-y-4">
                <label className="block text-sm font-extrabold text-[#12203D]">
                  Enter Order Tracking ID or Payment Reference
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={guestOrderInput}
                      onChange={(e) => setGuestOrderInput(e.target.value)}
                      placeholder="E.g. NMA-78901234 or PSK-98124"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 pl-11 pr-4 py-3.5 text-sm font-extrabold text-[#12203D] outline-none focus:border-[#2F5FE3] focus:bg-white transition-all uppercase tracking-wider"
                    />
                    <HiCube size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#2F5FE3] px-8 py-3.5 text-sm font-extrabold text-white shadow-xs hover:bg-[#254ec4] active:scale-[0.99] transition-all shrink-0"
                  >
                    <HiMagnifyingGlass size={16} />
                    <span>Track Package</span>
                  </button>
                </div>
              </form>

              {/* SEARCHED ORDER RESULT CARD */}
              {searchedGuestOrder && (
                <div className="rounded-2xl border border-gray-200 bg-[#F8F9FB] p-6 space-y-6 animate-in fade-in">
                  {/* Result Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
                    <div>
                      <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
                        Live Status
                      </span>
                      <h3 className="text-xl font-black text-[#12203D] mt-1">
                        Order #{searchedGuestOrder.id}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">Placed for {searchedGuestOrder.customer}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Total Amount</span>
                      <span className="text-xl font-black text-[#2F5FE3]">
                        {formatNaira(searchedGuestOrder.total)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Tracker Timeline Progress Bar */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-extrabold text-[#12203D] uppercase tracking-wider">Delivery Progress</h4>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { label: 'Order Placed', step: 1, icon: HiClock },
                        { label: 'Processing', step: 2, icon: HiCube },
                        { label: 'Dispatched', step: 3, icon: HiTruck },
                        { label: 'Delivered', step: 4, icon: HiCheckCircle },
                      ].map((item) => {
                        const currentStep = getStepProgress(searchedGuestOrder.status)
                        const isDone = item.step <= currentStep
                        const IconComponent = item.icon

                        return (
                          <div key={item.step} className="flex flex-col items-center space-y-2">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-all ${
                                isDone
                                  ? 'border-[#2F5FE3] bg-[#2F5FE3] text-white shadow-xs'
                                  : 'border-gray-200 bg-white text-gray-300'
                              }`}
                            >
                              <IconComponent size={18} />
                            </div>
                            <span
                              className={`text-[11px] font-extrabold ${
                                isDone ? 'text-[#12203D]' : 'text-gray-400'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-xl p-3 text-center mt-2">
                      STATUS: ORDER IS {searchedGuestOrder.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR STATE: ORDER NOT FOUND */}
              {guestLookupError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center space-y-3 animate-in fade-in">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <HiExclamationTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-red-900">Order ID Not Found</h4>
                    <p className="text-xs text-red-700 mt-1 font-medium">
                      No order was found matching "{guestOrderInput}". Please check the tracking number on your receipt or checkout email.
                    </p>
                  </div>
                </div>
              )}

              {/* INITIAL CLEAN EMPTY STATE PROMPT */}
              {!hasSearched && !searchedGuestOrder && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center flex flex-col items-center justify-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-xs border">
                    <HiCube size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-[#12203D]">Ready to Track Your Order</h4>
                  <p className="text-xs text-gray-400 max-w-sm">
                    Type your Order Reference above and click "Track Package" to view live shipping updates.
                  </p>
                </div>
              )}
            </div>

            {/* PROMINENT "SIGN UP FOR ORDER HISTORY" CALLOUT BANNER */}
            <div className="rounded-3xl bg-gradient-to-r from-[#12203D] via-[#1A2C54] to-[#2F5FE3] p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-200">
                  <HiSparkles size={14} /> Never Lose an Order
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  Sign up to get 1-click access to your full Order History
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
                  Currently browsing as guest. Create a free account or sign in so all your future & past purchases automatically save in your order history dashboard!
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  to="/account"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-xs font-black text-[#12203D] shadow-md hover:bg-gray-100 transition-all"
                >
                  <HiUserPlus size={16} className="text-[#2F5FE3]" />
                  <span>Sign In / Create Account</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* SIGNED-IN USER MODE: FULL ORDER HISTORY DASHBOARD */
          <main className="space-y-6">
            {/* Header with Search & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-5">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#12203D] sm:text-4xl">My Orders</h1>
                <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">
                  Welcome back, {profile.name}! Viewing your full order history dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs font-semibold text-[#12203D] outline-none focus:border-[#2F5FE3]"
                  />
                  <HiMagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-[#12203D]">
                  <HiFunnel size={14} />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3 overflow-x-auto scrollbar-none text-xs font-bold">
              {(['All Orders', 'Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'] as const).map(
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

            {/* Orders Cards List or Empty State */}
            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-1">
                  <HiClipboardDocumentList size={28} />
                </div>
                <h3 className="font-bold text-base text-[#12203D]">No Orders Found</h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  You haven't placed any orders yet. Purchases placed from this account will automatically save in your history.
                </p>
                <Link
                  to="/catalog"
                  className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-[#2F5FE3] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#254ec4]"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
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
                        <span className="text-gray-400 ml-3">{order.paymentRef || 'PSK-ONLINE'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'processing'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Summary Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500 shrink-0">
                          Customer: {order.customer}
                        </span>
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
            )}
          </main>
        )}
      </div>

      {/* Order Details Modal / Drawer for Signed-In Users */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <HiXMark size={20} />
            </button>

            <div className="border-b border-gray-100 pb-4">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold text-[#2F5FE3]">
                Order Details
              </span>
              <h3 className="text-xl font-extrabold text-[#12203D] mt-2">
                Order #{selectedOrder.id}
              </h3>
              <p className="text-xs text-gray-500">Customer: {selectedOrder.customer} • Area: {selectedOrder.deliveryArea}</p>
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
