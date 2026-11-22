import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardText, Eye, MapPin, Package, Phone } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Order, OrderStatus } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

const statusStyles: Record<OrderStatus, string> = {
  placed: 'border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]',
  processing: 'border-[#1049EB]/25 bg-[#EEF3FE] text-[#1049EB]',
  packed: 'border-[#1049EB]/25 bg-[#EEF3FE] text-[#1049EB]',
  dispatched: 'border-[#1049EB]/25 bg-[#EEF3FE] text-[#1049EB]',
  delivered: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]',
  cancelled: 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]',
}

const filterTabs: Array<{ value: 'all' | OrderStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'placed', label: 'Placed' },
  { value: 'processing', label: 'Processing' },
  { value: 'packed', label: 'Packed' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrdersTable({ orders }: { orders: Order[] }) {
  const { updateOrderStatus } = useProductStore()
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all')

  const filteredOrders = orders.filter(
    (o) => filterStatus === 'all' || o.status === filterStatus
  )

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus)
    toast.success(`Order ${orderId} updated to ${nextStatus}.`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
        {filterTabs.map((tab) => {
          const count =
            tab.value === 'all'
              ? orders.length
              : orders.filter((o) => o.status === tab.value).length
          const isActive = filterStatus === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilterStatus(tab.value)}
              className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#0B1220] text-white'
                  : 'border border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F6F7F9] hover:text-[#0B1220]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono tabular-nums text-[11px] ${
                  isActive ? 'text-white/80' : 'text-[#5E6675]'
                }`}
              >
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      {/* Orders 2-Column Cards Grid */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<ClipboardText size={24} weight="regular" />}
          title="No orders match this view"
          detail="Customer checkouts from the storefront will populate live orders here automatically."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredOrders.map((o) => {
            const itemCount = o.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
            const locationLabel = [o.city, o.state].filter(Boolean).join(', ') || o.deliveryArea
            return (
              <article
                key={o.id}
                className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#D1D5DB]"
              >
                <div className="flex flex-col gap-3.5">
                  {/* Header: ID, Ref, Status Dropdown */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#E5E7EB] pb-3">
                    <div className="min-w-0">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="font-mono text-sm font-bold text-[#0B1220] transition-colors hover:text-[#1049EB]"
                      >
                        {o.id}
                      </Link>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#5E6675]">
                        <span>Ref: {o.paymentRef || 'PSK-ONLINE'}</span>
                        {itemCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-1.5 py-0.5 text-[10px] font-medium text-[#374151]">
                            <Package size={11} weight="regular" />
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <select
                      aria-label={`Order status for ${o.id}`}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      className={`cursor-pointer rounded-[6px] border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase outline-none transition-colors focus:ring-2 focus:ring-[#1049EB]/15 ${
                        statusStyles[o.status] || 'border-[#E5E7EB] bg-[#F6F7F9] text-[#374151]'
                      }`}
                    >
                      <option value="placed">Placed</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Customer & Delivery Information */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Customer
                      </span>
                      <span className="mt-0.5 truncate font-semibold text-[#0B1220]">
                        {o.customer}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-[#5E6675]">
                        <Phone size={12} weight="regular" className="shrink-0" />
                        <span className="truncate">{o.phone}</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Delivery Location
                      </span>
                      <span className="mt-0.5 flex items-start gap-1 font-medium text-[#374151]">
                        <MapPin size={13} weight="regular" className="mt-0.5 shrink-0 text-[#5E6675]" />
                        <span className="line-clamp-2">{locationLabel}</span>
                      </span>
                    </div>
                  </div>

                  {/* Financial Details Row */}
                  <div className="grid grid-cols-3 gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-3">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.05em] text-[#5E6675]">
                        Total
                      </span>
                      <span className="mt-0.5 block font-mono tabular-nums text-xs font-bold text-[#0B1220] sm:text-sm">
                        {formatNaira(o.total)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.05em] text-[#5E6675]">
                        Cost Owed
                      </span>
                      <span className="mt-0.5 block font-mono tabular-nums text-xs font-semibold text-[#B91C1C] sm:text-sm">
                        {formatNaira(o.baseAmountOwed || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.05em] text-[#15803D]">
                        Markup
                      </span>
                      <span className="mt-0.5 block font-mono tabular-nums text-xs font-bold text-[#15803D] sm:text-sm">
                        +{formatNaira(o.markupEarned || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="mt-4 border-t border-[#E5E7EB] pt-3">
                  <Link
                    to={`/admin/orders/${o.id}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#0B1220] hover:bg-[#0B1220] hover:text-white"
                  >
                    <Eye size={14} weight="regular" />
                    <span>View Complete Order Details</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
