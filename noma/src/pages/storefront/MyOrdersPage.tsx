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

function getStatusBadgeClasses(status: string): string {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
    case 'dispatched':
      return 'border-[#1049EB]/25 bg-[#EEF3FE] text-[#1049EB]'
    case 'processing':
    case 'packed':
      return 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]'
    case 'cancelled':
      return 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
    default:
      return 'border-[#E5E7EB] bg-[#F6F7F9] text-[#0B1220]'
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
  const [guestLookupError, setGuestLookupError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)

  const lookupOrderByRef = useCallback(
    async (rawRef: string): Promise<Order | null> => {
      const cleanId = rawRef.trim().toUpperCase()
      if (!cleanId) return null

      const localMatch = storeOrders.find(
        (o) =>
          o.id.toUpperCase() === cleanId ||
          (o.paymentRef && o.paymentRef.toUpperCase() === cleanId)
      )
      if (localMatch) return localMatch

      return await orderService.findOrderByRef(cleanId)
    },
    [storeOrders]
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

  const filteredOrders = storeOrders.filter((o) => {
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
    <div className="min-h-screen bg-[#F6F7F9] pb-24 pt-4 text-[#0B1220]">
      <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-[#5E6675]">
          <Link to="/" className="transition-colors hover:text-[#1049EB]">
            Home
          </Link>
          <CaretRight size={12} weight="regular" />
          <span className="font-semibold text-[#0B1220]">
            {profile.isGuest ? 'Track Order' : 'My Orders'}
          </span>
        </nav>

        {profile.isGuest ? (
          <div className="space-y-8">
            <div className="border-b border-[#E5E7EB] pb-5">
              <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
                Track Order
              </h1>
              <p className="mt-1 text-xs text-[#5E6675] sm:text-sm">
                Enter your Noma Order ID or payment reference to view live dispatch status.
              </p>
            </div>

            {/* Guest Lookup Card */}
            <div className="space-y-6 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
              <form onSubmit={handleGuestLookup} className="space-y-3">
                <label
                  htmlFor="guest-order-ref"
                  className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]"
                >
                  Order ID or Payment Reference
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Package
                      size={17}
                      weight="regular"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E6675]"
                    />
                    <input
                      id="guest-order-ref"
                      type="text"
                      value={guestOrderInput}
                      onChange={(e) => setGuestOrderInput(e.target.value)}
                      placeholder="NMA-123456 or PSK-123456"
                      className="h-11 w-full rounded-[6px] border border-[#D1D5DB] bg-white pl-10 pr-4 font-mono text-sm font-semibold uppercase tracking-wider text-[#0B1220] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-[#5E6675]/70 focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLookingUp}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-[#0B1220] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB] disabled:opacity-60"
                  >
                    {isLookingUp ? (
                      <>
                        <CircleNotch size={16} className="animate-spin" />
                        <span>Looking up...</span>
                      </>
                    ) : (
                      <>
                        <MagnifyingGlass size={16} weight="regular" />
                        <span>Track Package</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Result Card */}
              {searchedGuestOrder ? (
                <div className="space-y-6 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center">
                    <div>
                      <span
                        className={`inline-block rounded-[4px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusBadgeClasses(
                          searchedGuestOrder.status
                        )}`}
                      >
                        {searchedGuestOrder.status}
                      </span>
                      <h2 className="mt-1.5 font-mono text-lg font-bold text-[#0B1220]">
                        Order {searchedGuestOrder.id}
                      </h2>
                      <p className="text-xs text-[#5E6675]">
                        Recipient: {searchedGuestOrder.customer} -{' '}
                        {searchedGuestOrder.deliveryArea || 'Nigeria'}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                        Order Total
                      </span>
                      <strong className="font-mono text-lg font-bold text-[#0B1220]">
                        {formatNaira(searchedGuestOrder.total)}
                      </strong>
                    </div>
                  </div>

                  {/* 4-Stage Horizontal Stepper */}
                  {searchedGuestOrder.status === 'cancelled' ? (
                    <div className="rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-center text-xs font-semibold text-[#B91C1C]">
                      This order has been cancelled. Contact Noma support for assistance.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Delivery Progress
                      </span>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: 'Order Placed', step: 1, icon: Clock },
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
                                className={`flex h-10 w-10 items-center justify-center rounded-[8px] border transition-colors ${
                                  isDone
                                    ? 'border-[#1049EB] bg-[#1049EB] text-white'
                                    : 'border-[#E5E7EB] bg-white text-[#5E6675]'
                                }`}
                              >
                                <IconComponent size={18} weight={isDone ? 'fill' : 'regular'} />
                              </div>
                              <span
                                className={`text-[11px] font-semibold ${
                                  isDone ? 'text-[#0B1220]' : 'text-[#5E6675]'
                                }`}
                              >
                                {item.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {Array.isArray(searchedGuestOrder.items) &&
                  searchedGuestOrder.items.length > 0 ? (
                    <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Items in Package
                      </span>
                      <div className="divide-y divide-[#E5E7EB] rounded-[6px] border border-[#E5E7EB] bg-white">
                        {searchedGuestOrder.items.map((item, idx) => (
                          <div
                            key={`${item.productId}-${idx}`}
                            className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-9 w-9 shrink-0 rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-0.5"
                                />
                              ) : null}
                              <div className="min-w-0">
                                <span className="block truncate font-semibold text-[#0B1220]">
                                  {item.name}
                                </span>
                                <span className="font-mono text-[11px] text-[#5E6675]">
                                  Qty {item.quantity}
                                  {item.size ? ` - Size ${item.size}` : ''}
                                </span>
                              </div>
                            </div>
                            <strong className="shrink-0 font-mono font-semibold text-[#0B1220]">
                              {formatNaira(item.unitPrice * item.quantity)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Error State */}
              {guestLookupError ? (
                <div className="space-y-2 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#FECACA] bg-white text-[#B91C1C]">
                    <WarningCircle size={20} weight="regular" />
                  </div>
                  <h3 className="text-sm font-bold text-[#B91C1C]">Order ID Not Found</h3>
                  <p className="text-xs text-[#B91C1C]/90">
                    No order was found matching &quot;{guestOrderInput}&quot;. Check your confirmation receipt or sign in if you checked out with an account.
                  </p>
                </div>
              ) : null}

              {/* Empty Prompt */}
              {!hasSearched && !searchedGuestOrder ? (
                <EmptyState
                  icon={<Package size={24} weight="regular" />}
                  title="Ready to track your order"
                  detail="Enter your NMA order reference above to inspect delivery milestones."
                />
              ) : null}
            </div>

            {/* Flat #0B1220 Account Callout */}
            <div className="flex flex-col items-start justify-between gap-6 rounded-[10px] border border-[#0B1220] bg-[#0B1220] p-6 text-white sm:p-8 md:flex-row md:items-center">
              <div className="max-w-xl space-y-2">
                <span className="inline-block rounded-[4px] border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Account Sync
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Sign in for automatic order history
                </h2>
                <p className="text-xs leading-relaxed text-white/75 sm:text-sm">
                  Create a Noma account or sign in so future orders, saved Nigerian addresses, and wishlist items sync across devices.
                </p>
              </div>

              <Link
                to="/account"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-[6px] bg-white px-5 py-3 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9] md:w-auto"
              >
                <UserPlus size={16} weight="regular" className="text-[#1049EB]" />
                <span>Sign In / Create Account</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Signed-in Mode: Full Order History */
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1220] sm:text-3xl">
                  My Orders
                </h1>
                <p className="mt-1 text-xs text-[#5E6675] sm:text-sm">
                  Signed in as <strong className="text-[#0B1220]">{profile.name || profile.email}</strong>
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <MagnifyingGlass
                  size={14}
                  weight="regular"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6675]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID or ref"
                  className="h-9 w-full rounded-[6px] border border-[#D1D5DB] bg-white pl-8 pr-3 text-xs font-medium text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ORDER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 rounded-[6px] border px-3.5 py-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#0B1220] bg-[#0B1220] text-white'
                      : 'border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#EEF0F4]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState
                icon={<ClipboardText size={24} weight="regular" />}
                title="No Orders Found"
                detail="Orders placed while signed into this account will appear here automatically."
                action={
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1049EB]"
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
                    className="space-y-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#0B1220]/30"
                  >
                    <div className="flex flex-col justify-between gap-2 border-b border-[#E5E7EB] pb-3 text-xs sm:flex-row sm:items-center">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-bold text-[#0B1220]">
                          Order {order.id}
                        </span>
                        <span className="font-mono text-[#5E6675]">
                          {order.paymentRef || 'PSK-ONLINE'}
                        </span>
                      </div>

                      <span
                        className={`inline-block self-start rounded-[4px] border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:self-auto ${getStatusBadgeClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="space-y-0.5 text-xs text-[#5E6675]">
                        <div>
                          Recipient: <strong className="text-[#0B1220]">{order.customer}</strong>
                        </div>
                        <div>
                          Destination: <span>{order.deliveryArea || 'Nigeria'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                            Total
                          </span>
                          <strong className="font-mono text-base font-bold text-[#0B1220]">
                            {formatNaira(order.total)}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-4 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE] hover:text-[#1049EB]"
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

      {/* Signed-In Order Details Modal */}
      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-xl space-y-5 overflow-y-auto rounded-[10px] border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close order details"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#5E6675] hover:text-[#0B1220]"
            >
              <X size={16} weight="regular" />
            </button>

            <div className="border-b border-[#E5E7EB] pb-4">
              <span
                className={`inline-block rounded-[4px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusBadgeClasses(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
              <h3 className="mt-2 font-mono text-lg font-bold text-[#0B1220]">
                Order {selectedOrder.id}
              </h3>
              <p className="mt-0.5 text-xs text-[#5E6675]">
                Ref:{' '}
                <span className="font-mono">{selectedOrder.paymentRef || 'N/A'}</span>
                {selectedOrder.paymentMethod ? ` - ${selectedOrder.paymentMethod.toUpperCase()}` : ''}
              </p>
            </div>

            {/* Shipping Details */}
            <div className="rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] p-4 text-xs">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                Delivery Details
              </span>
              <p className="font-semibold text-[#0B1220]">{selectedOrder.customer}</p>
              <p className="font-mono text-[#5E6675]">{selectedOrder.phone}</p>
              <p className="mt-1 text-[#374151]">
                {[selectedOrder.address, selectedOrder.deliveryArea].filter(Boolean).join(', ')}
              </p>
            </div>

            {/* Line Items */}
            {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
              <div className="space-y-2">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Items
                </span>
                <div className="divide-y divide-[#E5E7EB] rounded-[8px] border border-[#E5E7EB]">
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
                            className="h-10 w-10 shrink-0 rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-0.5"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <span className="block truncate font-semibold text-[#0B1220]">
                            {item.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#5E6675]">
                            Qty {item.quantity}
                            {item.size ? ` - Size ${item.size}` : ''}
                          </span>
                        </div>
                      </div>
                      <strong className="shrink-0 font-mono font-semibold text-[#0B1220]">
                        {formatNaira(item.unitPrice * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Summary */}
            <div className="space-y-2 border-t border-[#E5E7EB] pt-4 text-xs">
              <div className="flex items-center justify-between text-[#5E6675]">
                <span>Delivery Fee</span>
                <span className="font-mono font-semibold text-[#0B1220]">
                  {formatNaira(selectedOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-[#0B1220]">Grand Total</span>
                <strong className="font-mono text-lg font-bold text-[#0B1220]">
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
