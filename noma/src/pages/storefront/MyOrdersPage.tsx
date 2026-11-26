import {
  CaretRight,
  CheckCircle,
  CircleNotch,
  ClipboardText,
  Clock,
  MagnifyingGlass,
  Package,
  Truck,
  UserPlus,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../../design-system/components/EmptyState'
import { orderService } from '../../services/firebase/orderService'
import { useProductStore } from '../../store/productStore'
import { useUserStore } from '../../store/userStore'
import type { Order } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

type OrderFilterTab =
  | 'All Orders'
  | 'Placed'
  | 'Processing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled'

const ORDER_TABS: OrderFilterTab[] = [
  'All Orders',
  'Placed',
  'Processing',
  'Dispatched',
  'Delivered',
  'Cancelled',
]

function getStepProgress(status: string): number {
  const s = status.toLowerCase()
  switch (s) {
    case 'processing':
    case 'packed':
      return 2
    case 'dispatched':
      return 3
    case 'delivered':
      return 4
    case 'cancelled':
      return 0
    default:
      return 1
  }
}

export function MyOrdersPage() {
  const [searchParams] = useSearchParams()
  const initialQueryId = searchParams.get('id')?.trim() || ''

  const { profile } = useUserStore()
  const { orders: storeOrders } = useProductStore()

  const [activeTab, setActiveTab] = useState<OrderFilterTab>('All Orders')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [guestOrderInput, setGuestOrderInput] = useState(initialQueryId)
  const [searchedGuestOrder, setSearchedGuestOrder] = useState<Order | null>(null)
  const [recentDeviceOrders, setRecentDeviceOrders] = useState<Order[]>([])
  const [guestLookupError, setGuestLookupError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)

  // Hydrate recent orders placed from this browser directly from Firestore (so guest tracking always works)
  useEffect(() => {
    let active = true
    try {
      const raw = localStorage.getItem('noma_recent_order_ids')
      const ids: string[] = raw ? JSON.parse(raw) : []
      if (ids.length === 0) return
      Promise.all(ids.slice(0, 10).map((id) => orderService.getOrderById(id).catch(() => null)))
        .then((results) => {
          if (!active) return
          const valid = results.filter((o): o is Order => o !== null)
          setRecentDeviceOrders(valid)
          if (!initialQueryId && valid.length > 0) {
            setSearchedGuestOrder((prev) => prev || valid[0])
          }
        })
        .catch(() => {})
    } catch {
      // Ignore storage errors
    }
    return () => {
      active = false
    }
  }, [initialQueryId])

  const lookupOrderByRef = useCallback(
    async (rawRef: string): Promise<Order | null> => {
      const cleanId = rawRef.trim().toUpperCase()
      if (!cleanId) return null

      const localMatch = storeOrders.find(
        (o) =>
          o.id.toUpperCase() === cleanId ||
          (o.paymentRef && o.paymentRef.toUpperCase() === cleanId),
      )
      if (localMatch) return localMatch

      return await orderService.findOrderByRef(cleanId)
    },
    [storeOrders],
  )

  useEffect(() => {
    if (!initialQueryId || !profile.isGuest) return
    let active = true

    lookupOrderByRef(initialQueryId)
      .then((found) => {
        if (!active) return
        setHasSearched(true)
        if (found) {
          setSearchedGuestOrder(found)
          setGuestLookupError(false)
        } else {
          setSearchedGuestOrder(null)
          setGuestLookupError(true)
        }
      })
      .catch(() => {
        if (!active) return
        setHasSearched(true)
        setSearchedGuestOrder(null)
        setGuestLookupError(true)
      })

    return () => {
      active = false
    }
  }, [initialQueryId, profile.isGuest, lookupOrderByRef])

  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanId = guestOrderInput.trim().toUpperCase()
    if (!cleanId || isLookingUp) return

    setIsLookingUp(true)
    setHasSearched(true)
    try {
      const found = await lookupOrderByRef(cleanId)
      if (found) {
        setSearchedGuestOrder(found)
        setGuestLookupError(false)
      } else {
        setSearchedGuestOrder(null)
        setGuestLookupError(true)
      }
    } catch {
      setSearchedGuestOrder(null)
      setGuestLookupError(true)
    } finally {
      setIsLookingUp(false)
    }
  }

  const mergedOrders = (() => {
    const map = new Map<string, Order>()
    for (const o of storeOrders) map.set(o.id, o)
    for (const o of recentDeviceOrders) {
      if (!map.has(o.id)) map.set(o.id, o)
    }
    return Array.from(map.values())
  })()

  const filteredOrders = mergedOrders.filter((o) => {
    if (activeTab !== 'All Orders' && o.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false
    }
    if (
      searchQuery &&
      !o.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !o.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(o.paymentRef && o.paymentRef.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-white pb-24 pt-5 text-slate-900">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        {/* Single Clean Header Bar */}
        <div className="mb-8 border-b border-slate-200 pb-4">
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <CaretRight size={11} />
            <span className="font-medium text-slate-800">
              {profile.isGuest ? 'Track Order' : 'My Orders'}
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {profile.isGuest ? 'Track Your Order' : 'My Orders'}
          </h1>
        </div>

        {profile.isGuest ? (
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-8">
              <form onSubmit={handleGuestLookup} className="space-y-3">
                <label htmlFor="guest-order-ref" className="block text-xs font-semibold text-slate-700">
                  Enter Order ID or Payment Reference
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Package
                      size={17}
                      weight="regular"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="guest-order-ref"
                      type="text"
                      value={guestOrderInput}
                      onChange={(e) => setGuestOrderInput(e.target.value)}
                      placeholder="e.g. NMA-123456 or TRF-123456"
                      className="h-11 w-full rounded-full border border-slate-200 bg-[#F4F4F5] pl-11 pr-4 text-sm font-semibold uppercase text-slate-900 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLookingUp}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1049EB] px-6 text-xs font-semibold text-white transition-colors hover:bg-[#0D3EC7] disabled:opacity-60 sm:text-sm"
                  >
                    {isLookingUp ? (
                      <>
                        <CircleNotch size={16} className="animate-spin" />
                        <span>Looking up...</span>
                      </>
                    ) : (
                      <>
                        <MagnifyingGlass size={16} weight="bold" />
                        <span>Track Order</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {searchedGuestOrder ? (
                <div className="space-y-6 rounded-2xl bg-[#F4F4F5] p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1049EB] px-3 py-0.5 text-[11px] font-semibold capitalize text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FEB719]" />
                        <span>{searchedGuestOrder.status}</span>
                      </span>
                      <h2 className="mt-2 text-lg font-bold text-slate-900">
                        Order {searchedGuestOrder.id}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Recipient: {searchedGuestOrder.customer} •{' '}
                        {searchedGuestOrder.deliveryArea || 'Nigeria'}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="block text-xs text-slate-500">Order Total</span>
                      <strong className="text-lg font-bold tabular-nums text-slate-900">
                        {formatNaira(searchedGuestOrder.total)}
                      </strong>
                    </div>
                  </div>

                  {searchedGuestOrder.status === 'cancelled' ? (
                    <div className="rounded-xl bg-white p-4 text-center text-xs font-semibold text-slate-700">
                      This order has been cancelled. Contact Noma support for assistance.
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Placed', step: 1, icon: Clock },
                        { label: 'Processing', step: 2, icon: Package },
                        { label: 'Dispatched', step: 3, icon: Truck },
                        { label: 'Delivered', step: 4, icon: CheckCircle },
                      ].map((item) => {
                        const currentStep = getStepProgress(searchedGuestOrder.status)
                        const isDone = item.step <= currentStep
                        const IconComponent = item.icon

                        return (
                          <div key={item.step} className="flex flex-col items-center gap-2">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                                isDone
                                  ? 'bg-[#1049EB] text-white'
                                  : 'border border-slate-200 bg-white text-slate-400'
                              }`}
                            >
                              <IconComponent size={18} weight={isDone ? 'fill' : 'regular'} />
                            </div>
                            <span
                              className={`text-xs font-semibold ${
                                isDone ? 'text-slate-900' : 'text-slate-400'
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {Array.isArray(searchedGuestOrder.items) &&
                  searchedGuestOrder.items.length > 0 ? (
                    <div className="space-y-2 border-t border-slate-200 pt-4">
                      <span className="block text-xs font-semibold text-slate-600">
                        Items in Package
                      </span>
                      <div className="divide-y divide-slate-100 rounded-xl bg-white">
                        {searchedGuestOrder.items.map((item, idx) => (
                          <div
                            key={`${item.productId}-${idx}`}
                            className="flex items-center justify-between gap-3 px-4 py-3 text-xs"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-10 w-10 shrink-0 rounded-lg bg-[#F4F4F5] object-contain p-1"
                                />
                              ) : null}
                              <div className="min-w-0">
                                <span className="block truncate font-semibold text-slate-900">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Qty {item.quantity}
                                  {item.size ? ` • Size ${item.size}` : ''}
                                </span>
                              </div>
                            </div>
                            <strong className="shrink-0 font-bold tabular-nums text-slate-900">
                              {formatNaira(item.unitPrice * item.quantity)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {guestLookupError ? (
                <div className="space-y-2 rounded-2xl bg-[#F4F4F5] p-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-2xs">
                    <WarningCircle size={20} weight="regular" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Order Not Found</h3>
                  <p className="text-xs text-slate-500">
                    No order was found matching &ldquo;{guestOrderInput}&rdquo;. Double-check your receipt or sign in to view your account history.
                  </p>
                </div>
              ) : null}

              {!hasSearched && !searchedGuestOrder ? (
                <EmptyState
                  icon={<Package size={24} weight="regular" />}
                  title="Track your package"
                  detail="Enter your order ID above to check real-time delivery status."
                />
              ) : null}
            </div>

            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#F4F4F5] p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Have a Noma account?
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Sign in to view all your orders and saved delivery addresses automatically.
                </p>
              </div>

              <Link
                to="/account"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <UserPlus size={15} weight="regular" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                {ORDER_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      activeTab === tab
                        ? 'bg-[#1049EB] text-white'
                        : 'bg-[#F4F4F5] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <MagnifyingGlass
                  size={14}
                  weight="regular"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID..."
                  className="h-9 w-full rounded-full border border-slate-200 bg-[#F4F4F5] pl-9 pr-3 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState
                icon={<ClipboardText size={24} weight="regular" />}
                title="No orders found"
                detail="Orders placed while signed into your account will appear here."
                action={
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Start Shopping
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 text-xs sm:flex-row sm:items-center">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-slate-900">Order {order.id}</span>
                        <span className="text-slate-400">{order.paymentRef || 'ONLINE'}</span>
                      </div>

                      <span className="inline-block self-start rounded-full bg-[#F4F4F5] px-3 py-0.5 text-[11px] font-semibold capitalize text-slate-800 sm:self-auto">
                        {order.status}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="space-y-0.5 text-xs text-slate-500">
                        <div>
                          Recipient: <strong className="text-slate-900">{order.customer}</strong>
                        </div>
                        <div>
                          Destination: <span>{order.deliveryArea || 'Nigeria'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div>
                          <span className="block text-[11px] text-slate-400">Total</span>
                          <strong className="text-base font-bold tabular-nums text-slate-900">
                            {formatNaira(order.total)}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Order ${selectedOrder.id} details`}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close order details"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-950"
            >
              <X size={16} weight="bold" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="inline-block rounded-full bg-[#F4F4F5] px-3 py-0.5 text-[11px] font-semibold capitalize text-slate-800">
                {selectedOrder.status}
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">Order {selectedOrder.id}</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Ref: {selectedOrder.paymentRef || 'N/A'}
                {selectedOrder.paymentMethod ? ` • ${selectedOrder.paymentMethod.toUpperCase()}` : ''}
              </p>
            </div>

            <div className="rounded-xl bg-[#F4F4F5] p-4 text-xs">
              <span className="mb-1 block font-bold text-slate-900">Delivery Address</span>
              <p className="font-medium text-slate-800">{selectedOrder.customer}</p>
              <p className="text-slate-500">{selectedOrder.phone}</p>
              <p className="mt-1 text-slate-600">
                {[selectedOrder.address, selectedOrder.deliveryArea].filter(Boolean).join(', ')}
              </p>
            </div>

            {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-900">Items</span>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      className="flex items-center justify-between gap-3 p-3 text-xs"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-lg bg-[#F4F4F5] object-contain p-1"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <span className="block truncate font-semibold text-slate-900">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Qty {item.quantity}
                            {item.size ? ` • Size ${item.size}` : ''}
                          </span>
                        </div>
                      </div>
                      <strong className="shrink-0 font-bold tabular-nums text-slate-900">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {formatNaira(selectedOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total</span>
                <strong className="text-lg font-bold tabular-nums text-slate-900">
                  {formatNaira(selectedOrder.total)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
