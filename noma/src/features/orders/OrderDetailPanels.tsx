import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Envelope,
  MapPin,
  Phone,
  Printer,
  ShoppingBag,
  TrendUp,
  Truck,
  User,
  XCircle,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useProductStore } from '../../store/productStore'
import type { Order, OrderStatus } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

export function OrderDetailPanels({ order }: { order: Order }) {
  const { updateOrderStatus } = useProductStore()

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Customer order recorded and payment initialized' },
    { key: 'processing', label: 'Processing & Packing', desc: 'Fulfillment team preparing items' },
    { key: 'dispatched', label: 'Dispatched', desc: 'Handed to logistics courier' },
    { key: 'delivered', label: 'Delivered', desc: 'Customer confirmed receipt' },
  ]

  const getCurrentStepIndex = () => {
    switch (order.status) {
      case 'placed':
        return 0
      case 'processing':
      case 'packed':
        return 1
      case 'dispatched':
        return 2
      case 'delivered':
        return 3
      default:
        return -1
    }
  }

  const currentIdx = getCurrentStepIndex()
  const lineItems = Array.isArray(order.items) ? order.items : []
  const itemsSubtotal = Math.max(0, (order.total || 0) - (order.deliveryFee || 0))
  const fullShippingAddress = [
    order.address,
    order.neighborhood,
    order.city,
    order.state,
  ]
    .filter(Boolean)
    .join(', ')

  const handleStatusChange = (nextStatus: OrderStatus) => {
    updateOrderStatus(order.id, nextStatus)
    toast.success(`Order ${order.id} marked as ${nextStatus}.`)
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E6675] transition-colors hover:text-[#0B1220]"
        >
          <ArrowLeft size={15} weight="regular" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
          >
            <Printer size={15} weight="regular" />
            <span>Print Receipt</span>
          </button>

          <select
            aria-label="Update order fulfillment status"
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="cursor-pointer rounded-[6px] bg-[#0B1220] px-3.5 py-2 text-xs font-semibold text-white outline-none transition-colors hover:bg-[#1E293B] focus:ring-2 focus:ring-[#1049EB]/25"
          >
            <option value="placed">Status: Placed</option>
            <option value="processing">Status: Processing</option>
            <option value="packed">Status: Packed</option>
            <option value="dispatched">Status: Dispatched</option>
            <option value="delivered">Status: Delivered</option>
            <option value="cancelled">Status: Cancelled</option>
          </select>
        </div>
      </div>

      {/* Progress Step Timeline */}
      <section className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
            Fulfillment Stage Tracker
          </h3>
          {order.createdAt ? (
            <span className="font-mono text-[11px] text-[#5E6675]">
              Created: {new Date(order.createdAt).toLocaleString()}
            </span>
          ) : null}
        </div>

        {order.status === 'cancelled' ? (
          <div className="flex items-center gap-2.5 rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-xs font-semibold text-[#B91C1C]">
            <XCircle size={18} weight="regular" />
            <span>This order has been marked as cancelled.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step, idx) => {
              const isDone = idx < currentIdx || (idx === 3 && currentIdx === 3)
              const isCurrent = idx === currentIdx && order.status !== 'delivered'
              return (
                <div
                  key={step.key}
                  className={`flex flex-col gap-1.5 rounded-[8px] border p-4 transition-colors ${
                    isCurrent
                      ? 'border-[#1049EB] bg-[#EEF3FE]/60'
                      : isDone
                      ? 'border-[#BBF7D0] bg-[#F0FDF4]'
                      : 'border-[#E5E7EB] bg-[#F6F7F9] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                      Step 0{idx + 1}
                    </span>
                    {isDone ? (
                      <CheckCircle size={16} weight="regular" className="text-[#15803D]" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-[#1049EB]" />
                    ) : null}
                  </div>
                  <h4 className="text-xs font-bold text-[#0B1220]">{step.label}</h4>
                  <p className="text-[11px] leading-relaxed text-[#5E6675]">{step.desc}</p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Line Items & Customer Address */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Itemized Order Table */}
          <section className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                <ShoppingBag size={15} weight="regular" className="text-[#1049EB]" />
                <span>Purchased Line Items</span>
              </h3>
              <span className="font-mono text-[11px] font-semibold text-[#5E6675]">
                {lineItems.length} {lineItems.length === 1 ? 'line' : 'lines'}
              </span>
            </div>

            {lineItems.length > 0 ? (
              <div className="divide-y divide-[#E5E7EB]">
                {lineItems.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.size || 'std'}-${index}`}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={item.image || '/images/catalog-banner-all.png'}
                        alt={item.name}
                        className="h-12 w-12 shrink-0 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] object-contain p-1"
                      />
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-xs font-semibold text-[#0B1220]">
                          {item.name}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#5E6675]">
                          <span>Qty: {item.quantity}</span>
                          {item.size ? (
                            <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-1.5 py-0.5 text-[10px] font-semibold text-[#0B1220]">
                              Size: {item.size}
                            </span>
                          ) : null}
                          <span>Unit: {formatNaira(item.unitPrice)}</span>
                          <span>Cost: {formatNaira(item.basePrice)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono tabular-nums text-xs font-bold text-[#0B1220] sm:text-sm">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[6px] border border-dashed border-[#D1D5DB] bg-[#F6F7F9] p-4 text-xs text-[#5E6675]">
                Line-item SKU breakdown was not recorded on this order document. Totals and supplier reconciliation are preserved below.
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 border-t border-[#E5E7EB] pt-4 text-xs text-[#374151]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums font-semibold text-[#0B1220]">
                  {formatNaira(itemsSubtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Delivery Fee ({order.deliveryMethod ? `${order.deliveryMethod} - ` : ''}
                  {order.deliveryArea})
                </span>
                <span className="font-mono tabular-nums font-semibold text-[#0B1220]">
                  {formatNaira(order.deliveryFee || 0)}
                </span>
              </div>
              <div className="mt-1 flex justify-between border-t border-[#E5E7EB] pt-2.5 text-sm font-bold text-[#0B1220]">
                <span>Total Amount Charged</span>
                <span className="font-mono tabular-nums text-[#0B1220]">
                  {formatNaira(order.total)}
                </span>
              </div>
            </div>
          </section>

          {/* Customer & Address Details */}
          <section className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              <User size={15} weight="regular" className="text-[#1049EB]" />
              <span>Customer &amp; Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Customer Name
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#0B1220]">
                  <User size={14} weight="regular" className="text-[#5E6675]" />
                  <span>{order.customer}</span>
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Phone Number
                </span>
                <span className="flex items-center gap-1.5 font-mono font-semibold text-[#0B1220]">
                  <Phone size={14} weight="regular" className="text-[#5E6675]" />
                  <span>{order.phone}</span>
                </span>
              </div>

              {order.email ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                    Email Address
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-[#374151]">
                    <Envelope size={14} weight="regular" className="text-[#5E6675]" />
                    <span>{order.email}</span>
                  </span>
                </div>
              ) : null}

              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Shipping Destination
                </span>
                <span className="flex items-start gap-1.5 font-medium text-[#0B1220]">
                  <MapPin size={14} weight="regular" className="mt-0.5 shrink-0 text-[#5E6675]" />
                  <span>{fullShippingAddress || order.deliveryArea}</span>
                </span>
                {fullShippingAddress && order.deliveryArea && fullShippingAddress !== order.deliveryArea ? (
                  <span className="pl-5 text-[11px] text-[#5E6675]">
                    Zone Summary: {order.deliveryArea}
                  </span>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        {/* Right Col: Money Reconciliation */}
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-5 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              <TrendUp size={15} weight="regular" className="text-[#1049EB]" />
              <span>Supplier &amp; Profit Reconciliation</span>
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                  Gross Total Received
                </span>
                <span className="font-mono tabular-nums text-xl font-bold text-[#0B1220]">
                  {formatNaira(order.total)}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-[6px] border border-[#FECACA] bg-[#FEF2F2] p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#B91C1C]">
                  Base Cost Owed to Supplier
                </span>
                <span className="font-mono tabular-nums text-xl font-bold text-[#B91C1C]">
                  {formatNaira(order.baseAmountOwed)}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-[6px] border border-[#BBF7D0] bg-[#F0FDF4] p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#15803D]">
                  Net Operator Profit Kept
                </span>
                <span className="font-mono tabular-nums text-2xl font-bold text-[#15803D]">
                  {formatNaira(order.markupEarned)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-[#E5E7EB] pt-4 text-xs">
              <div className="flex items-center justify-between gap-2 text-[#5E6675]">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={14} weight="regular" />
                  <span>Payment Reference</span>
                </span>
                <span className="font-mono font-semibold text-[#0B1220]">
                  {order.paymentRef || 'PSK-PENDING'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-[#5E6675]">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={14} weight="regular" />
                  <span>Payment Method</span>
                </span>
                <span className="font-semibold capitalize text-[#0B1220]">
                  {order.paymentMethod || 'Card / Transfer'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-[#5E6675]">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} weight="regular" />
                  <span>Delivery Method</span>
                </span>
                <span className="font-semibold capitalize text-[#0B1220]">
                  {order.deliveryMethod ? `${order.deliveryMethod} dispatch` : 'Standard dispatch'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
